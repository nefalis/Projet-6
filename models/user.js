
// imports de module nécessaire
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')


// enregistrement du model user 
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // utilisateur unique
    password: { type: String, required: true }
});

//string = chaine de caractere

// ajout sécurité 
userSchema.plugin(uniqueValidator);

//exportation du module
module.exports = mongoose.model('User', userSchema);

