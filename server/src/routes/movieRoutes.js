import express from 'express';
import {
    getAllMovies,
    createMovie,
    deleteMovie,
    updateMovie,
    getMovieById,
    getMovieBySlug
} from '../controllers/movieController.js';
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 */
router.get('/', getAllMovies);

/**
 * @openapi
 * /api/movies:
 *   post:
 *     summary: Create a new movie (admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               genre:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins
 */
router.post('/', authenticate, authorizeRole("admin"), createMovie);

/**
 * @openapi
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie (admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               genre:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins
 */
router.put("/:id", authenticate, authorizeRole("admin"), updateMovie);

/**
 * @openapi
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie (admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins
 */
router.delete('/:id', authenticate, authorizeRole("admin"), deleteMovie);

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */
router.get('/:id', getMovieById);

/**
 * @openapi
 * /api/movies/slug/{slug}:
 *   get:
 *     summary: Get a movie by slug
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie slug (URL-friendly title)
 *     responses:
 *       200:
 *         description: Movie found
 *       404:
 *         description: Movie not found
 */
router.get('/slug/:slug', getMovieBySlug);

export default router;
