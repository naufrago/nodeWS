const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

// eliminar del schema el objeto password al retornar
usuarioSchema.methods.toJSON = function() {
        let user = this;
        let userObject = user.toObject();
        delete userObject.password;

        return userObject;

    }
    // inyecta elmensaje de error de validacion
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);