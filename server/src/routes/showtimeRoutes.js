import express from "express";
import { getShowtimes } from "../controllers/showtimeController.js";

const router = express.Router();

/**
 * @openapi
 * /api/showtimes:
 *   get:
 *     summary: Get all showtimes (or filter by movie)
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter showtimes by Movie ID
 *     responses:
 *       200:
 *         description: List of showtimes
 *       500:
 *         description: Server error
 */
router.get("/", getShowtimes);

export default router;
