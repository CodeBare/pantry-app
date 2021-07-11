const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    measurement: {
        type: Schema.Types.ObjectId
    },
    system: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId
    }
})

IngredientSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.ingredientID = returnedObject._id.toString()
        returnedObject.createdBy = returnedObject.createdBy.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

module.exports = mongoose.model('Ingredient', IngredientSchema)