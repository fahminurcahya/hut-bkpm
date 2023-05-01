const { generateQRPNG } = require("../../utils/generateQRPNG");

const {
  responseSukses,
  responseReject,
  responseException,
} = require("../../utils/handlerResponse");

const User = require("../../models/Users");

const register = async (req, res) => {
  console.log * req;
  try {
    let dataUser = {
      nama: "administrator",
      email: "admin@gmail.com",
      password: "admin",
    };
    console.log(dataUser);
    const user = await User.create(dataUser);

    let result = {
      user,
    };

    res.status(200).json(responseSukses(result));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseException(err.message));
  }
};

module.exports = { register };
