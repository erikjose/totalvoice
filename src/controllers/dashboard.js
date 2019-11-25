const base64 = require("js-base64").Base64;
const userDb = require("../db/user");

class DashboardController {
  get(req, res) {
    const authorizationHeader = req.header("Authorization");

    const token = JSON.parse(base64.decode(authorizationHeader));

    const user = userDb.getById(token.getById());

    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json({
      message: "Success",
      data: userData
    });
  }
}

module.exports = new DashboardController();
