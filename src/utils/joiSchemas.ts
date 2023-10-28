import Joi from "joi";

export const serviceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  quantity: Joi.number().required(),
  rate: Joi.number().required(),
});

export const invoiceSchema = Joi.object({
  invoiceAddress: Joi.string().required(),
  userId: Joi.string().required(),
  clientName: Joi.string().required(),
  clientEmail: Joi.string().email().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  duration: Joi.string().required(),
  paymentType: Joi.string().required(),
  currency: Joi.string().required(),
  services: Joi.array().items(serviceSchema).required(),
  amount: Joi.number().required(),
  bankName: Joi.string().required(),
  accountNumber: Joi.number().required(),
  installment: Joi.number().required(),
  initialDepositPercentage: Joi.string().required(),
  initialDeposit: Joi.number().required(),
  taxPercentage: Joi.string().required(),
  tax: Joi.number().required(),
  discountPercentage: Joi.string().required(),
  discount: Joi.number().required(),
  termsAndConditions: Joi.array().items(Joi.string()).required(),
  accepted: Joi.boolean().required(),
  status: Joi.string()
    .valid("Approved", "Complete", "Disputed", "Paid", "Pending")
    .required(),
});

export const userSchema = Joi.object({
  walletId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (value === "undefined") {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  profilePic: Joi.string().allow(""),
  businessName: Joi.string().required(),
  businessLogo: Joi.string().allow(""),
});

export const loginSchema = Joi.object({
  walletId: Joi.string().required(),
});
