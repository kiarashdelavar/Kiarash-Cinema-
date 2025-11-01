import { Showtime } from "../db/database-helper.js";

/**
 * Get all showtimes, optionally filtered by movie ID.
 * @route GET /api/showtimes
 * @returns {Array} 200 - List of showtimes
 * @returns {Error} 500 - Server error
 */
export async function getShowtimes(req, res) {
    const { movieId } = req.query;
    try {
        const where = movieId ? { MovieId: movieId } : {};
        const showtimes = await Showtime.findAll({ where });
        res.status(200).json(showtimes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching showtimes", error: err.message });
    }
}
