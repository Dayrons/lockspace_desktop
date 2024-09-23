const { Password } = require("../models/Password");


class PasswordController {



    async registerPassword (e,values){
       

        // const password = new  Password(values)

        // await password.save()
       
        return "register password"
    }
  

}




module.exports = new PasswordController()