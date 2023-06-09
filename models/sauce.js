// import module
const mongoose = require('mongoose')


// modèle de sauce 		
const modelSauce = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: ["String <sauceId>"], default: [] },
    usersDisliked: { type: ["String <sauceId>"], default: [] }
});

module.exports = mongoose.model('Sauce', modelSauce);



//["String <sauceId>"] tableau 