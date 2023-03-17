// import des modules				
const Sauce = require('../models/sauce');
const fs = require('fs');

///// routage sauce				

// ajout sauce sur le site - POST				
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce); //chaine caractere en objet pour chercher valeur/key
    delete sauceObject._id; // supprime id objet car id va etre generé automatiquement
    delete sauceObject._userId; //supprime userid qui fait sauce pour prendre le token
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}: // ${req.get('host')} /images/${req.file.filename}` //host va chercher adresse - 3choses pour url image
    });
    // enregistrement de la sauce dans base de donnée
    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'La sauce a été enregistré'
            })
        })
        .catch(error => {
            res.status(400).json({ error })
        })
};



// Récupère toute les sauces - GET				
exports.getAllSauce = (req, res) => {
    Sauce.find() //cherche toute les sauces
        .then((allSauce) => {
            res.status(200).json(allSauce) //affiche resultat de find
        })
        .catch(error => {
            res.status(400).json({ error })
        })
};


// details d'une sauce - GET				
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id }) //affiche la sauce voulu
        .then(oneSauce => res.status(200).json(oneSauce))
        .catch(error => res.status(404).json({ error }))
};


// modification de la sauce - PUT				

exports.modifySauce = (req, res) => {
    // Récupération de l'image si existante
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), //on recup sauce et on parse
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    }
        : { ...req.body }; //operateur de décomposition

    // Suppression de userId  
    delete sauceObject._userId; //evite qu'un utilisateur utilise l'id d'un autre
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) { //userid base / userid token donc quelqu'un utilise l'id de quelqu'un d'autre
                res.status(401).json({ message: "Action non autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => { //unlink supp de maniere asynchrone
                    // mise a jour de la sauce
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { ...sauceObject, _id: req.params.id }
                    )
                        .then(() => res.status(200).json({ message: "Sauce modifié" }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};



//supprime sauce - DELETE				

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id }) //selectionne la sauce a supprimer
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Requete non autorisé' })
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Sauce'
                            })
                        })
                        .catch(error => {
                            res.status(400).json({ error })
                        })
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};


// gestion des likes - POST

exports.likeSauce = (req, res) => {
    const like = req.body.like

    // Ajout like
    if (like === 1) {
        Sauce.updateOne({ _id: req.params.id },
            {
                $inc: { likes: 1 }, //operateur incremente un champ
                $push: { usersLiked: req.body.userId }//operateur ajoute valeur specifique tableau
            })
            .then(() => res.status(200).json({ message: 'Le like a été ajouté' }))
            .catch(error => res.status(400).json({ error }))
    }

    // Ajout dislike
    else if (like === -1) {
        Sauce.updateOne({ _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: 'Le dislike a été ajouté' }))
            .catch(error => res.status(400).json({ error }))
    }

    // Suppression like dislike
    else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                // suppression du like
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: "Like supprimé !" }))
                        .catch((error) => res.status(400).json({ error }))
                }
                // suppression dislike
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: "Dislike supprimé !" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    }
}