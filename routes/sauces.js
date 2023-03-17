// import des modules

const express = require('express');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

// récupération du routeur 
const router = express.Router();

// routage de la ressource sauceCtrl

router.post('/', auth, multer, sauceCtrl.createSauce); // ajout sauce
router.get('/', auth, sauceCtrl.getAllSauce); // récupère toute les sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); // detail sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modifie sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // supprime sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); //gere like

module.exports = router;
