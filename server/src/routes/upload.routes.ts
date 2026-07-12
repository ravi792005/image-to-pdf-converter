import { Router } from "express";
import { uploadMiddleware } from "../middleware/upload.middleware";
import { strictRateLimiter } from "../middleware/rateLimit.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { handleUpload } from "../controllers/upload.controller";

const router = Router();

router.post(
  "/upload",
  strictRateLimiter,
  uploadMiddleware.array("images", 50),
  asyncHandler(handleUpload)
);

export default router;
