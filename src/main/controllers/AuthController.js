const { User } = require("../models/User");
const crypto = require("crypto");

class AuthController {
  /**
   * Genera un hash verificable de la contraseña usando HMAC-SHA256.
   * Formato: "hmac_sha256$<base64_hash>"
   * Compatible con Flutter (mismo algoritmo).
   */
  static hashPassword(password, username) {
    const key = `lockspace_auth_v1_${username.toLowerCase()}`;
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(password);
    return `hmac_sha256$${hmac.digest("base64")}`;
  }

  /**
   * Verifica una contraseña contra un hash guardado.
   */
  static verifyPassword(password, storedHash, username) {
    const computed = this.hashPassword(password, username);
    return computed === storedHash;
  }

  /**
   * Deriva una clave de 32 bytes desde la contraseña usando PBKDF2.
   * Compatible con Flutter (mismos parámetros).
   */
  static deriveKey(password, username) {
    const salt = `lockspace_v1_${username.toLowerCase()}`;
    return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  }

  async singin(e, values) {
    const user = await User.findOne({
      where: {
        name: values.name.toLowerCase(),
      },
    });

    if (user !== null) {
      // Verificar con HMAC-SHA256 (compatible con Flutter)
      const isValid = AuthController.verifyPassword(
        values.password,
        user.password,
        user.name
      );

      if (isValid) {
        return JSON.stringify({ error: false, data: user });
      } else {
        return JSON.stringify({
          error: true,
          message: "Contraseña invalida",
        });
      }
    } else {
      return JSON.stringify({ error: true, message: "Usuario invalido" });
    }
  }

  async signup(e, values) {
    try {
      // Generar hash HMAC-SHA256 (compatible con Flutter)
      const hash = AuthController.hashPassword(values.password, values.name);

      const userData = {
        uuid: require("uuid").v4(),
        name: values.name.toLowerCase(),
        password: hash,
      };

      const user = await User.create(userData);
      return JSON.stringify({ error: false, data: user, message: "" });
    } catch (error) {
      return JSON.stringify({ error: true, message: error.message });
    }
  }
}

const authInstance = new AuthController();
authInstance.hashPassword = AuthController.hashPassword;
authInstance.verifyPassword = AuthController.verifyPassword;
authInstance.deriveKey = AuthController.deriveKey;
module.exports = authInstance;
