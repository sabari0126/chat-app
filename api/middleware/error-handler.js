const { CustomErrorApi } = require("../error/customErrorHandler");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorApi) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(500)
    .json({ msg: "Something went woring please trry again some time" });
};

module.exports = errorHandler;
