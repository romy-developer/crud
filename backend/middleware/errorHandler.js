function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === '23505') {
    return res.status(409).json({
      success: false,
      error: { message: 'An employee with this email already exists.' },
    });
  }

  // Keep technical details in the server console, never in the API response.
  console.error(error.message);
  return res.status(error.status || 500).json({
    success: false,
    error: { message: error.status ? error.message : 'An unexpected server error occurred.' },
  });
}

module.exports = errorHandler;
