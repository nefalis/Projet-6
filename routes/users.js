// import des modules 
const express = require('express');
const userCtrl = require('../controllers/user');


// récupération du routeur  
const router = express.Router();

// routage de la ressource User
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

// exportation du module
module.exports = router;

