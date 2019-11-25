const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const router = express.Router();

app.use(bodyParser.json());
app.use(router);

const LoginController = require("./src/controllers/login");
const DashController = require("./src/controllers/dashboard");

router.post("/user", LoginController.login);
router.post("/verify", LoginController.verify2FA);
router.get("/dashbaord", DashController.get);

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: "100"
  })
);

const server = app.listen("3001", () => {
  console.log(`Servidor iniciado. Port: ${server.address().port}`);
});
