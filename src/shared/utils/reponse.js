export const response = (
  res,
  { statusCode = 200, message = null, data = null },
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
