export const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err.message);

  let statusCode = err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let userMessage = err.message || 'An unexpected server error occurred.';

  // Provide helpful user-friendly messages for common issues
  if (userMessage.includes('ECONNREFUSED') || userMessage.includes('Python ML Service is unreachable')) {
    userMessage = 'Unable to connect to the Python ML Engine. Please ensure the Python service is running on port 8000.';
    statusCode = 503;
  } else if (userMessage.toLowerCase().includes('not found') || userMessage.includes('Invalid stock symbol')) {
    statusCode = 404;
  }

  res.status(statusCode).json({
    error: userMessage,
    isNotFound: statusCode === 404,
    timestamp: new Date().toISOString(),
  });
};

