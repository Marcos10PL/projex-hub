import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-api.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ success: false, msg: err.message });
  }

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.msg =
      "Validation failed on: " +
      Object.values(err.errors)
        .map(item => item.path)
        .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "SyntaxError") {
    customError.msg = "Invalid data format";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = "Invalid value provided";
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // console.log(err);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, msg: customError.msg });
};

export default errorHandler;
