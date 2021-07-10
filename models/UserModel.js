const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true }
})

UserSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.accountID = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

const User = mongoose.model('User', UserSchema);