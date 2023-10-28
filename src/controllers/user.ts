import { Request, Response } from "express";
import { ValidationResult } from "joi";
import { loginSchema, userSchema } from "../utils/joiSchemas";
import { verifyUser } from "../utils/validation";
import { userResolver } from "../resolvers/userResolver";
import { uploadToCloudinary } from "../utils/cloudinary";
import { UserDocument } from "../models/user";

export const createUser = async (req: Request | any, res: Response) => {
  console.log(req.body);
  console.log(req.files);
  
  const { walletId, fullName, businessName, email }: UserDocument = req.body;
  const validation: ValidationResult = userSchema.validate(req.body);
  const getToken = process.env.TOKEN as string;
  try {
    if (validation.error) {
      return res
        .status(400)
        .json({ error: validation.error.details[0].message });
    } else {
      const allUsers = await userResolver.Query.users();
      const existingUser = allUsers.find((user) => user.walletId === walletId);
      let profilePicUrl;
      let businessLogoUrl;
      if (req.files) {
        console.log("Files", req.files);

        const valuesArr: any[] = Object.values(req.files).flat();
        if (valuesArr[0]) {
          // Upload profile picture to Cloudinary
          profilePicUrl = await uploadToCloudinary(valuesArr[0]);
        }
        if (valuesArr[1]) {
          // Upload business logo to Cloudinary
          businessLogoUrl = await uploadToCloudinary(valuesArr[1]);
        }
      }
      if (existingUser) {
        const message = "User already exists!!! Login instead";
        return res.status(409).json(message);
      } else {
        const newUser = {
          walletId,
          fullName,
          businessName,
          email,
          profilePic: profilePicUrl,
          businessLogo: businessLogoUrl,
        };
        const user = await userResolver.Mutation.createUser(null, newUser);
        const token = verifyUser(user._id, user.walletId);
        res.cookie(getToken, token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000 * 7,
        });
        return res
          .status(201)
          .json({ message: "User signed up successfully", user, token });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { walletId } = req.body;
  const getToken = process.env.TOKEN as string;
  try {
    const validUser = loginSchema.validate(req.body);
    if (validUser.error) {
      return res
        .status(400)
        .json({ error: validUser.error.details[0].message });
    }
    const user: any = await userResolver.Mutation.loginUser(null, { walletId });
    if (user.error) {
      return res.status(400).json(user.error);
    } else {
      const id = user._id;
      const token = verifyUser(user._id, user.walletId);
      res.cookie(getToken, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000 * 7,
      });
      return res
        .status(200)
        .json({ message: "User logged in successfully", user, token });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateUser = async (req: Request | any, res: Response) => {
  try {
    console.log('Hello');
    console.log(req.user);
    console.log(req.files);
    console.log(req.files);
  
    const loggedInUser: any = req.user;
    const { id } = loggedInUser;
    const { walletId, fullName, businessName, email } = req.body;
    let profilePicUrl;
    let businessLogoUrl;
    if (Object.values(req.files).length > 0) {
      // Upload profile picture to Cloudinary
      console.log(req.files);

      if (req.files.profilePic[0]) {
        profilePicUrl = await uploadToCloudinary(req.files.profilePic[0]);
      }
      console.log("Here2");
      // Upload business logo to Cloudinary
      if (req.files?.businessLogo[0]) {
        businessLogoUrl = await uploadToCloudinary(req.files?.businessLogo[0]);
      }
    }

    const { error } = await userSchema.validateAsync({
      walletId,
      fullName,
      businessName,
      email,
      profilePic: profilePicUrl,
      businessLogo: businessLogoUrl,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await userResolver.Query.user(null, { id });
    if (!user) {
      return res.status(404).json(`User with ID:${id} not found`);
    }
    const updatedUser = {
      walletId,
      fullName,
      businessName,
      email,
      businessLogo: businessLogoUrl,
      profilePic: profilePicUrl,
    };
    const updated = await userResolver.Mutation.updateUser(null, {
      _id: id,
      input: updatedUser,
    });
    return res
      .status(200)
      .json({ message: "User updated successfully", updated });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await userResolver.Mutation.deleteUser(null, {
      _id: id,
    });
    if (!deletedUser) {
      return res.status(404).json(`User with ID:${id} not found`);
    }
    return res.status(200).json({
      message: `User with ID:${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await userResolver.Query.users();
    if (!allUsers) {
      return res.status(400).json({ message: "No users found" });
    } else {
      return res
        .status(200)
        .json({ message: "All users fetched successfully", allUsers });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userResolver.Query.user(null, { id });
    if (!user) {
      return res.status(400).json({ message: `User with ID: ${id} not found` });
    } else {
      return res
        .status(200)
        .json({ message: "User retrieved successfully", user });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
