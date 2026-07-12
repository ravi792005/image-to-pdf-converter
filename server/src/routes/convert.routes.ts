import { Router } from "express";
import { strictRateLimiter } from "../middleware/rateLimit.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { handleConvert } from "../controllers/convert.controller";

const router = Router();

router.post("/convert", strictRateLimiter, asyncHandler(handleConvert));

export default router;
