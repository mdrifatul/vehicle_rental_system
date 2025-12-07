import { Request, Response } from "express";
import { vechileService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vechileService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      date: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vechileService.getVehicle();
    res.status(201).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingle = async (req: Request, res: Response) => {
  try {
    const result = await vechileService.getSingle(
      req.params.vehicleId as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "signle vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "vehicle find successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vechileService.updateVehicle(
      req.params.vehicleId as string,
      req.body
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "signle vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehile = async (req: Request, res: Response) => {
  try {
    const result = await vechileService.deleteVehile(
      req.params.vehicleId as string
    );
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete booked vehicle",
      });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "single vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "vehicle deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vechicleController = {
  createVehicle,
  getVehicle,
  getSingle,
  updateVehicle,
  deleteVehile,
};
