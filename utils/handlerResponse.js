const responseSukses = (result) => {
  return {
    error: false,
    message: "Succesfully",
    data: result,
  };
};

const responseReject = (message) => {
  return {
    error: true,
    message: message,
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
