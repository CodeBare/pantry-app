const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PantrySchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId
    },
    pantryName: {
        type: String,
        default: ''
    }
})

PantrySchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.pantryID = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

module.exports = mongoose.model('Pantry', PantrySchema);