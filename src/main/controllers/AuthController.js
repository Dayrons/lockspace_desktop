
const { User } = require("../models/User");
const { Password } = require("../models/Password");
const bcrypt = require('bcrypt');

class AuthController {


    async singin(e, values) {
        const user = await User.findOne({
            where: {
                name: values.name.toLowerCase(),
            },
            // include: [Password]
        })
    //    await Password.create({
    //         title:"Prueba",
    //         password:"12345678",
    //         UserId :user.id
    //     })

        if (user !== null) {
            const validatePassword = await bcrypt.compare(values.password, user.password)
            if (validatePassword) {
                return JSON.stringify({ error: false, data: user })
            } else { return JSON.stringify({ error: true, message: 'Contraseña invalida' }) }
        } else {
            return JSON.stringify({ error: true, message: 'usuario invalido' })

        }
        
    }
    async signup(e, values) {
        
        try {
            const passwordHash = await bcrypt.hash(values.password, 8)
            values.name = values.name.toLowerCase()
            values.password = passwordHash
            const user = await User.create(values)
            return JSON.stringify({error:false, data:user, message:""})

        } catch (error) {
            return JSON.stringify({error:true, message:error})
        }

    }
  
}




module.exports = new AuthController()