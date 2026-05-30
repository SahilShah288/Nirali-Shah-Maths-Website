/**
 * MVP admin guard: send header `x-admin-key` matching ADMIN_API_KEY.
 * Set ADMIN_API_KEY in .env before using admin slot routes in production.
 */
function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return res.status(503).json({
      success: false,
      message:
        "Admin routes are disabled. Set ADMIN_API_KEY in your environment.",
    });
  }

  const provided = req.headers["x-admin-key"];
  if (provided !== expected) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — invalid or missing x-admin-key header",
    });
  }

  next();
}

module.exports = adminAuth;
