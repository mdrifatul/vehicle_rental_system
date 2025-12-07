import { Request, Response } from "express";
import { userSignup } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await userSignup.signUp(req.body);
    res.status(201).json({
      success: true,
      message: "Sign Up successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await userSignup.signIn(req.body);
    res.status(201).json({
      success: true,
      message: "Sign In successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signUp,
  signIn,
};
