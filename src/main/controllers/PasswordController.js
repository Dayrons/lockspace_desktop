const { Password } = require("../models/Password");
const { User } = require("../models/User");
const { Op } = require("sequelize");
const crypto = require("crypto");
const fernet = require("fernet");
const { machineId } = require("node-machine-id");
const { v4: uuidv4 } = require("uuid");
class PasswordController {
  async get(e, user) {
    const passwords = await Password.findAll({
      where: {
        UserId: user.id,
      },
      include: [User],
    });

    return JSON.stringify({ error: false, data: passwords });
  }

  async search(e, values) {
    const passwords = await Password.findAll({
      where: {
        UserId: values.user.id,
        title: {
          [Op.like]: `%${values.text}%`,
        },
      },
      include: [User],
    });

    return JSON.stringify({ error: false, data: passwords });
  }

  async create(e, values) {
    values.uuid = uuidv4();

    const hardwareId = await machineId();

    const hash = crypto.createHash("sha256");
    hash.update(hardwareId);
    const derivedKeyBytes = hash.digest();

    const fernetKeyBase64 = derivedKeyBytes.toString("base64");

    const secret = new fernet.Secret(fernetKeyBase64);

    const token = new fernet.Token({ secret: secret });

    values.password = token.encode(values.password);

    const password = await Password.create(values);

    return JSON.stringify({ error: false, data: password });
  }
  async delete(e, values) {
    const password = await Password.destroy({
      where: { id: values.id, UserId: values.UserId },
    });
    return JSON.stringify({ error: false, data: password });
  }
}

module.exports = new PasswordController();
