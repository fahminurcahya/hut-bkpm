const responseSukses = (result) => {
  return {
    error: false,
    message: "Succesfully",
    data: result,
  };
};

const responseReject = (message, data) => {
  return {
    error: true,
    message: message,
    data: data,
  };
};

const responseException = (err) => {
  return {
    error: true,
    message: "Internal server error",
    exception: err,
  };
};

module.exports = {
  responseSukses,
  responseReject,
  responseException,
};
