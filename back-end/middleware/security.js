const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const token = header.split(" ")[1];

  let kod;

  const decodedToken = jwt.verify(
    token,
    process.env.TOKEN_HASH,
    (err, decoded) => {
      if (err) {
        kod = 1;
      }

      if (decoded) {
        req.auth = decoded.auth;
        req.instruktorId = decoded.instruktorId;
      }
    }
  );

  if (kod == 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  next();
};
