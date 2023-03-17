// import des modules 			
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


/////// routage de la ressource User				

// creer et enregistrer l'user				
exports.signup = (req, res) => {
    const { email, password } = req.body

    // validation des données recue				
    if (!email || !password) {// si manque quelque chose				
        return res.status(400).json({ message: 'Données manquantes' })
    }
    User.findOne({ where: { email: email }, raw: true })//on regarde si utilisateur existe				
        .then(user => {
            if (user !== null) { //existe deja				
                return res.status(409).json({ message: `L'utilisateur ${email} existe déjà !` })
            }

            //haché le mdp - saltRound =salage chaine- salage complexifie le mdp avant hachage				
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    //creation de l'utilisateur				
                    User.create(req.body)
                        .then(user => res.json({ message: `Utilisateur crée`, data: user }))
                        .catch(err => res.status(500).json({ message: 'Erreur dans la base de donnée', error: err }))
                })
                .catch(err => res.status(500).json({ message: 'Erreur du processus de hachage', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Erreur dans la base de donnée', error: err }))
}


// connexion user
exports.login = (req, res) => {
    User.findOne({ email: req.body.email }) //findOne va chercher dans base de donné
        .then(user => {

            //verification de l'utilisateur email
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }

            // verification mot de passe
            bcrypt.compare(req.body.password, user.password) // compare clair / haché
                .then(valid => {

                    //incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // correct - obtention du token
                    res.status(200).json({
                        userId: user._id, // userid en clair
                        token: jwt.sign( //sign 3 arguments pour marcher 
                            { userId: user._id }, //userid chiffré
                            `${process.env.JWT_SECRET}`,
                            { expiresIn: (process.env.JWT_DURING) }
                        )
                    }
                    );
                })
                .catch(error => res.status(500).json({ error: 'Erreur dans la base de donnée' }));
        })
        .catch(error => res.status(500).json({ error: "Erreur dans la base de donnée" }));
}
