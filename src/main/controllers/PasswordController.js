const { Password } = require("../models/Password");
const { User } = require("../models/User");
const { Op } = require("sequelize");
class PasswordController {
  async get(e, user) {
  
    const passwords = await Password.findAll({
      where:{
          UserId :user.id
      },
      include:[User]
     
    });

    return JSON.stringify({error:false, data:passwords})
  }

  async search(e, values){
    const passwords = await Password.findAll({
      where:{
          UserId :values.user.id,
          title: {
            [Op.like]: `%${values.text}%`
          }
      },
      include:[User]
     
    });

    return JSON.stringify({error:false, data:passwords})
  }

  async create(e, values) {
    const password =   await Password.create(values)

    return {error:false, data:password};
  }
}

module.exports = new PasswordController();
