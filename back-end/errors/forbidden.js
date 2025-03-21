import CustomAPIError from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;