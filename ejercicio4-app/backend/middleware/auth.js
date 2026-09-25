export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({
      error: "No autorizado"
    });
  }

  next();
};