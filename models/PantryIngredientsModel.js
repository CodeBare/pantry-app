const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PantryIngredientSchema = new Schema({
    pantryID: {
        type: Schema.Types.ObjectId
    },
    ingredientID: {
        type: Schema.Types.ObjectId
    },
    quantity: {
        type: Number,
        default: 1
    }
})

PantryIngredientSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.pantryID = returnedObject.pantryID.toString()
        returnedObject.ingredientID = returnedObject.ingredientID.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

// Create an index to prevent duplicate pantry/ingredient combinations
PantryIngredientSchema.index( {pantryID: 1, ingredientID: 1}, { unique: true })

module.exports = mongoose.model('PantryIngredient', PantryIngredientSchema)