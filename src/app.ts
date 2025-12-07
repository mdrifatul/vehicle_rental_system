import express, { Request, Response } from "express";
import { authRouter } from "./auth/auth.router";
import initDB from "./config/db";
import { bookignRouter } from "./modules/booking/booking.router";
import { userRouter } from "./modules/users/user.router";
import { VechileRouter } from "./modules/vehicles/vehicle.router";

const app = express();
//perser
app.use(express.json());
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", VechileRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookignRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;
