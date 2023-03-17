// importation de multer
const multer = require("multer")

// mime type
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//destination du fichier
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images'); //nom dossier images
    },

    // nom unique pour le fichier
    //split supprime les espace et join met un _ a la place (underscore)
    // minetype format indique nature et format d'un document
    // date.now fichier unique - milliseconde qui se sont passé depuis 1970

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; //ajout extention fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});


// export du module
//single envoi un seul fichier
module.exports = multer({ storage }).single('image');

