import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { ExtendRequest } from "../extendedRequest";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    return res.status(403).send("Authorization header missing");
  }
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send("Token missing");
  }

  jwt.verify(token, process.env.JWT_SECRET!, async (err, payload) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    if (!payload) {
      return res.status(403).send("Invalid payload");
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    const user = await userModel.findOne({ email: userPayload.email });
    req.user = user;
    next();
  });
};
export default validateJWT;
