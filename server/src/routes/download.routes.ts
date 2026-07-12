import { Router } from "express";
import { asyncHandler } from "../middleware/error.middleware";
import { handleDownload, handleManualCleanup } from "../controllers/download.controller";

const router = Router();

router.get("/download/:id", asyncHandler(handleDownload));
router.delete("/cleanup", asyncHandler(handleManualCleanup));

export default router;
