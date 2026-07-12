import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/** General API rate limiter - applied to all routes. */
export const generalRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down and try again shortly.",
  },
});

/** Stricter limiter for the expensive upload/convert endpoints to blunt DoS/abuse. */
export const strictRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: Math.max(Math.floor(env.rateLimitMaxRequests / 4), 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many upload/convert requests. Please wait a few minutes and try again.",
  },
});
