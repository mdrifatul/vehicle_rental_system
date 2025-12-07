import { Router } from "express";
import auth from "../../middleware/auth";
import { vechicleController } from "./vehicle.controller";

const router = Router();

router.post("/", auth("admin"), vechicleController.createVehicle);

router.get("/", vechicleController.getVehicle);

router.get("/:vehicleId", vechicleController.getSingle);

router.put("/:vehicleId", auth("admin"), vechicleController.updateVehicle);

router.delete("/:vehicleId", auth("admin"), vechicleController.deleteVehile);

export const VechileRouter = router;
