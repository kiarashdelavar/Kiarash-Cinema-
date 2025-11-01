import jwt from "jsonwebtoken";

/**
 * Check if user is logged in using a JWT token.
 * Adds `req.user` if token is valid.
 * @route Middleware
 * @returns 401 if token is missing or invalid
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

/**
 * Allow only users with given roles (e.g. "admin").
 * @param {...string} allowedRoles - Allowed roles
 * @returns 403 if role is not allowed
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(403).json({ message: "Forbidden: No role assigned." });
    }

    const userRoles = Array.isArray(userRole)
        ? userRole
        : userRole.split(",").map(r => r.trim().toLowerCase());

    const hasAccess = allowedRoles.some(role =>
        userRoles.includes(role.toLowerCase())
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden: Role not authorized." });
    }

    next();
  };
}

/**
 * Allow only admin users.
 * Shortcut for authorizeRole("admin").
 * @route Middleware
 * @returns 403 if not admin
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }
  next();
}

export { authenticate, authorizeRole, requireAdmin };
