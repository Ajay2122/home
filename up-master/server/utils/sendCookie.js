const sendCookie = (user, statusCode, res, token) => {
  const options = {
    maxAge: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};

 module.exports = sendCookie;
