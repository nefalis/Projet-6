// import des modules 
const jwt = require('jsonwebtoken');

//vérification de l'authentification de l'utilisateur avec verif token
module.exports = (req, res, next) => {
    try {
        //récupération du token
        //[1] position du token en 2 car indique 'Bearer', 'numero token'
        // headers  = requete
        //bearer porte le token
        const token = req.headers.authorization.split(' ')[1]; // split coupe a partir de ' ' 

        // decode le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // verification du token
        const userId = decodedToken.userId; // user id du decodedtoken
        req.auth = { //valeur transmis aux routes
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
