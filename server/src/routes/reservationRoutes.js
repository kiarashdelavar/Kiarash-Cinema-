import express from 'express';
import {
  createReservation,
  getReservations,
  deleteReservation,
  updateReservation,
  getMyReservations,
  getReservedSeats
} from '../controllers/reservationController.js';
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - showtimeId
 *               - buildingId
 *               - seats
 *               - seatClass
 *             properties:
 *               movieId:
 *                 type: integer
 *               showtimeId:
 *                 type: integer
 *               buildingId:
 *                 type: integer
 *               seats:
 *                 type: array
 *                 items:
 *                   type: integer
 *               seatClass:
 *                 type: string
 *                 enum: [first, second, regular]
 *               phoneNumber:
 *                 type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reservation created
 *       409:
 *         description: Seat already reserved
 *       400:
 *         description: Missing required data
 *       500:
 *         description: Internal error
 */
router.post('/', authenticate, createReservation);

/**
 * @openapi
 * /api/reservations:
 *   get:
 *     summary: Get all reservations (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reservations
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorizeRole("admin"), getReservations);

/**
 * @openapi
 * /api/reservations/my:
 *   get:
 *     summary: Get reservations of logged-in user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reservations
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, getMyReservations);

/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation deleted
 *       404:
 *         description: Reservation not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, deleteReservation);

/**
 * @openapi
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
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
 *               showtimeId:
 *                 type: integer
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Reservation updated
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, updateReservation);

/**
 * @openapi
 * /api/reservations/reserved-seats:
 *   get:
 *     summary: Get all reserved seats (public)
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the showtime
 *     responses:
 *       200:
 *         description: List of reserved seat IDs
 *       400:
 *         description: Missing showtimeId
 */
router.get("/reserved-seats", getReservedSeats);

export default router;
