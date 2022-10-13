import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  console.log(token);

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      req.userId = decodedToken._id;

      next();
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(403).json({
      message: "Access denied",
    });
  }
};
