import { Building } from "../db/database-helper.js";

/**
 * Get all cinema buildings.
 *
 * @route GET /api/buildings
 * @returns {Array} 200 - List of buildings
 * @returns {Error} 500 - Server error
 *
 * @openapi
 * /api/buildings:
 *   get:
 *     summary: Get all buildings
 *     tags: [Buildings]
 *     responses:
 *       200:
 *         description: All buildings returned
 *       500:
 *         description: Failed to load buildings
 */
export async function getBuildings(req, res) {
    try {
        const buildings = await Building.findAll();
        res.status(200).json(buildings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching buildings", error: err.message });
    }
}
