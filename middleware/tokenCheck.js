const jwt = require("jsonwebtoken");
module.exports = function () {
  return async (req, res, next) => {
    try {
      if (
        req.headers.authorization == undefined ||
        req.headers.authorization == "undefined"
      ) {
        return res.json({ success: false, message: "Please Add Token" });
      }
      const decode = await jwt.verify(
        req.headers.authorization,
        process.env.JWTSECRET
      );
      req.user = decode;
      next();
    } catch (error) {
      console.log("token invalid error", error);
      return res.json({ success: false, message: "token invalid" });
    }
  };
};
