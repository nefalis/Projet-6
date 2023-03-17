
// import des modules
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")
const path = require('path');

// initialisation de l'API
const app = express()

app.use(cors({
    origin: "*", // acces non restreint
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], //donne autorisation d'utiliser les methodes ci contre
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// import des modules de routage			
const user_router = require('./routes/users')
const sauces_router = require('./routes/sauces')

// Acces au dossier images
//__dirname sous repertoire
app.use('/images', express.static(path.join(__dirname, 'images')));

// mise en place du routage
app.get('/', (req, res) => res.send(`Vous etes connecté`))

app.use('/api/auth', user_router)
app.use('/api/sauces', sauces_router)

app.all('*', (req, res) => res.status(501).send('Ressource inexistante'))


// lancement serveur
mongoose
    .set('strictQuery', true) //strictquery evolution base de donnée
    .connect(process.env.MONGODB_URL) //url base de donnée
    .then(() => {
        app.listen(process.env.SERVER_PORT, () => { // appel server environnement
        })
    })

    .catch(error => console.log("Connexion échouée", error)) //si marche pas


