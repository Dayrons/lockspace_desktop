const { Password } = require("../models/Password");
const { User } = require("../models/User");

class PasswordController {
  async getPassword(e, user) {
    console.log(`User id : ${user.id}`);
    const passwords = await Password.findAll({
      where:{
          UserId :user.id
      },
      include:[User]
     
    });

    console.log(passwords);

    // return JSON.stringify({error:false, data:passwords})
  }

  async registerPassword(e, values) {
    // const password = new  Password(values)

    // await password.save()

    return "register password";
  }
}

module.exports = new PasswordController();
