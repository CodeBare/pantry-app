const User = require('../models/UserModel')
const ObjectId = require('mongoose').Types.ObjectId

const UserValidator = async (req, userID) => {
    try {
        let currentUserID = req.currentUserID;
        if(currentUserID) {
            const user = await User.findOne({_id: ObjectId(currentUserID)})
            if(user) {
                if(user._id.toString() === userID) {
                    return true // this is a match
                } else if(user.isAdmin) {
                    return true // this is a match
                } else {
                    return false // this user is not valid
                }
            } else {
                throw new Error('Current user is invalid')
            }
        } else {
            throw new Error('Current user is missing')
        }
    } catch (err) {
        throw new Error('Unable to validate user')
    }
}

module.exports = UserValidator