const { Password } = require("../models/Password");
const { User } = require("../models/User");
const { Op } = require("sequelize");
const crypto = require("crypto");
const fernet = require("fernet");
const { v4: uuidv4 } = require("uuid");
const AuthController = require("./AuthController");

class PasswordController {
  /**
   * Obtiene todas las contraseñas del usuario.
   * Las contraseñas viajan encriptadas, solo se desencriptan cuando el usuario las pide.
   */
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

  /**
   * Crea una nueva contraseña encriptada con PBKDF2 derivado de la contraseña del usuario.
   * Compatible con Flutter: misma key derivation.
   */
  async create(e, values) {
    try {
      values.uuid = uuidv4();

      // Derivar key desde la contraseña del usuario (compatible con Flutter)
      const derivedKey = AuthController.deriveKey(
        values.userPassword,
        values.userName
      );
      const fernetKeyBase64 = derivedKey.toString("base64");
      const secret = new fernet.Secret(fernetKeyBase64);
      const token = new fernet.Token({ secret: secret });

      values.password = token.encode(values.password);
      delete values.userPassword; // No guardar la contraseña en texto plano
      delete values.userName;

      const password = await Password.create(values);
      return JSON.stringify({ error: false, data: password });
    } catch (error) {
      return JSON.stringify({ error: true, message: error.message });
    }
  }

  async delete(e, values) {
    const password = await Password.destroy({
      where: { id: values.id, UserId: values.UserId },
    });
    return JSON.stringify({ error: false, data: password });
  }

  /**
   * Desencripta una contraseña usando PBKDF2 derivado de la contraseña del usuario.
   * Compatible con Flutter: misma key derivation.
   */
  async decryptPassword(e, values) {
    try {
      const { password, userPassword, userName } = values;

      // Derivar la misma key que usó Flutter
      const derivedKey = AuthController.deriveKey(userPassword, userName);
      const fernetKeyBase64 = derivedKey.toString("base64");
      const secret = new fernet.Secret(fernetKeyBase64);

      const token = new fernet.Token({
        secret: secret,
        token: password,
        ttl: 0,
      });

      const decryptedPassword = token.decode();
      return JSON.stringify({ error: false, data: decryptedPassword });
    } catch (error) {
      return JSON.stringify({
        error: true,
        message: "Error al desencriptar: contraseña incorrecta o datos corruptos",
      });
    }
  }
}

module.exports = new PasswordController();
