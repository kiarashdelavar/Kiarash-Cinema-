import express from "express";
import { getBuildings } from "../controllers/buildingController.js";

const router = express.Router();

/**
 * @openapi
 * /api/buildings:
 *   get:
 *     summary: Get all buildings
 *     tags: [Buildings]
 *     responses:
 *       200:
 *         description: List of buildings
 *       500:
 *         description: Error fetching buildings
 */
router.get("/", getBuildings);

export default router;
