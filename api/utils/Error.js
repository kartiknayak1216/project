export default function errorHandler(statusCode, message) {
  const error = new Error();
  error.status = statusCode; // Use "status" instead of "statusCode"
  error.message = message; // Use "message" instead of "message"
  return error;
}
