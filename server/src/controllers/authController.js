import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../db/database-helper.js";

/**
 * Creates a JWT token for a user.
 *
 * @param {object} user - The user data from the database
 * @returns {string} A signed JWT token that expires in 2 hours
 */
function generateToken(user) {
  return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
  );
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Create a new user account
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
 *               name:
 *                 type: string
 *                 example: Admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: New user created
 *       409:
 *         description: Email is already taken
 *       400:
 *         description: Missing required info
 *       500:
 *         description: Server error during registration
 */
async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
        .status(400)
        .json({ message: "Name, email, password, and role are required." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res
        .status(500)
        .json({ message: "Something went wrong during registration", error: err.message });
  }
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in using email and password
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login success, returns JWT
 *       401:
 *         description: Wrong email or password
 *       500:
 *         description: Server error during login
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

/**
 * @openapi
 * /api/auth/users:
 *   get:
 *     summary: See all users (admin only)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Could not fetch users
 */
async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role"],
    });
    res.status(200).json(users);
  } catch (err) {
    res
        .status(500)
        .json({ message: "Something went wrong while fetching users", error: err.message });
  }
}

/**
 * @openapi
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 */
async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
        .status(500)
        .json({ message: "Error deleting user", error: err.message });
  }
}

/**
 * @openapi
 * /api/auth/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Auth]
 */
async function updateUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const { email, password, role } = req.body;

    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}

/**
 * Update the logged-in user's profile (self only)
 *
 * @param {import("express").Request} req - Request with user info from token
 * @param {import("express").Response} res - Server response
 */
async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const {
      name,
      email,
      phoneNumber,
      dateOfBirth,
      favoriteMovies,
      bio,
    } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (favoriteMovies) user.favoriteMovies = favoriteMovies;
    if (bio) user.bio = bio;

    await user.save();
    res.status(200).json({ message: "Profile updated." });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}

/**
 * Get the logged-in user's profile
 */
export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "phoneNumber",
        "dateOfBirth",
        "favoriteMovies",
        "bio",
      ],
    });

    if (!user)
      return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
}

export {
  register,
  login,
  getUsers,
  deleteUser,
  updateUser,
  updateProfile,
};
