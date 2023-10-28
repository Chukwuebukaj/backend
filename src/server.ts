import express from "express";
import { ApolloServer } from "@apollo/server";
import mongoose, { ConnectOptions } from "mongoose";
import { invoiceResolver } from "./resolvers/invoiceResolver";
import { userResolver } from "./resolvers/userResolver";
import invoiceTypeDefs from "./typeDefs/invoiceTypeDefs";
import userTypeDefs from "./typeDefs/userTypeDefs";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRoutes from "./routes/user";
import invoiceRoutes from "./routes/invoice";
import { cloudinaryMiddleware } from "./utils/cloudinary";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";

interface MongooseOpts {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

dotenv.config();
const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://frontend-zeta-rust.vercel.app",
    "https://res.cloudinary.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin!)) {
    res.setHeader("Access-Control-Allow-Origin", origin!);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (allowedOrigins.includes(origin!)) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://frontend-zeta-rust.vercel.app",
      "https://res.cloudinary.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cloudinaryMiddleware);
app.use("/user", userRoutes);
app.use("/invoice", invoiceRoutes);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOpts: ConnectOptions & Partial<MongooseOpts> = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI as string, mongooseOpts);
const httpServer = http.createServer(app);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB successfully!");
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
});

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, invoiceTypeDefs],
    resolvers: [invoiceResolver, userResolver],
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
};

startApolloServer().catch((err) =>
  console.error("Error starting Apollo Server:", err)
);

export default app;
