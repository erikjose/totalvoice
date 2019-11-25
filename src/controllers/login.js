const Totalvoice = require("totalvoice-node");
const base64 = require("js-base64").Base64;
const userDb = require("../db/user");

class LoginController {
  async login(req, res) {
    const totalvoiceClient = new Totalvoice("81b488b24c3958bb17616a607889cfec");

    const { email, password } = req.body;

    const user = userDb.getByLogin(email, password);

    if (user == undefined) {
      return res.status(404).json({
        message: "Invalid credentials"
      });
    }

    const token = {
      type: "2fa-send",
      userId: user.id,
      email: user.email,
      sign: "0123456789"
    };

    try {
      const api = await totalvoiceClient.verificacao.enviar(
        "35997332539",
        "app-top",
        5,
        false
      );

      token.twoFactorVerificationId = api.dados.id;

      const base64Token = base64.encode(JSON.stringify(token));

      return res.status(200).json({
        message: "Success. Waiting 2FA validation",
        token: base64Token
      });
    } catch (err) {
      return res.status(500).json({
        message: "Deu ruim"
      });
    }
  }

  async verify2FA(req, res) {
    const totalvoiceClient = new Totalvoice("81b488b24c3958bb17616a607889cfec");

    const authorizationHeader = req.header("Authorization");

    const token = JSON.parse(base64.decode(authorizationHeader));

    const user = userDb.getById(token.userId);

    try {
      const api = await totalvoiceClient.verificacao.buscar(
        token.twoFactorVerificationId,
        req.body.pin
      );

      const permanentToken = {
        type: "permanent",
        userId: user.id,
        email: user.email,
        sign: "0123456789"
      };

      const base64Token = base64.encode(JSON.stringify(permanentToken));

      return res.status(201).json({
        message: "Success",
        token: base64Token
      });
    } catch (err) {
      return res.status(500).json({
        message: "Deu ruim"
      });
    }
  }
}

module.exports = new LoginController();
