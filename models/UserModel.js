const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    firebaseID: { type: String, unique: true },
    email: { type: String, unique: true },
    isAdmin: { type: Boolean, default: false }
})

UserSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.accountID = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})

module.exports = mongoose.model('User', UserSchema);

