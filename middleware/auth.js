const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.params.token;
  if (!token) return res.render('index', {
    errorMessage: 'Error: Invalid User!'
  });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.render('index',{  errorMessage: "User Invalid" });
  }
};