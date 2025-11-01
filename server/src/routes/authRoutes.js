import express from "express";
import {
    register,
    login,
    getUsers,
    deleteUser,
    updateUser,
    updateProfile,
    getProfile
} from "../controllers/authController.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "kia@example.com"
 *               password:
 *                 type: string
 *                 example: "123456kd"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "user"
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: User already exists }
 *       400: { description: Missing required fields }
 *       500: { description: Error registering user }
 */
router.post("/register", register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "kia@example.com"
 *               password:
 *                 type: string
 *                 example: "123456kd"
 *     responses:
 *       200: { description: Logged in successfully, returns a JWT token }
 *       401: { description: Invalid credentials }
 *       500: { description: Login failed }
 */
router.post("/login", login);

/**
 * @openapi
 * /api/auth/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   email: { type: string, example: "kia@example.com" }
 *                   role: { type: string, example: "user" }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
router.get("/users", authenticate, authorizeRole("admin"), getUsers);

/**
 * @openapi
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *         description: The user ID
 *     responses:
 *       200: { description: User deleted successfully }
 *       404: { description: User not found }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
router.delete("/users/:id", authenticate, authorizeRole("admin"), deleteUser);

/**
 * @openapi
 * /api/auth/users/{id}:
 *   put:
 *     summary: Update a user (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "new@email.com" }
 *               password: { type: string, example: "newpassword123" }
 *               role: { type: string, enum: [user, admin], example: "admin" }
 *     responses:
 *       200: { description: User updated }
 *       404: { description: Not found }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       500: { description: Server error }
 */
router.put("/users/:id", authenticate, authorizeRole("admin"), updateUser);

/**
 * @openapi
 * /api/auth/profile:
 *   put:
 *     summary: Update your own profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               dateOfBirth: { type: string, format: date }
 *               favoriteMovies: { type: string }
 *               bio: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 *       404: { description: User not found }
 *       500: { description: Server error }
 */
router.put("/profile", authenticate, updateProfile);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get your own profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your profile info
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/profile", authenticate, getProfile);

export default router;
