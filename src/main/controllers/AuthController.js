const { Password } = require("../models/Password");
const { User } = require("../models/User");


class AuthController {


    async singin(e, values) {
        const user = await User.findOne({
            where: {
                name: values.name.toLowerCase(),
            }
        })
        console.log(user.toJSON())
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
            values.name = values.nombre.toLowerCase()
            values.password = passwordHash
            const user = User.create(values)

            return JSON.stringify({error:false, data:user})

        } catch (error) {
            return JSON.stringify({error:true, message:error})
        }


    }
  

}




module.exports = new AuthController()