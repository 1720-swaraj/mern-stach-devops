const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode < 400,
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, message, data);
};

module.exports = {
  sendResponse,
  sendError,
  sendSuccess
};
