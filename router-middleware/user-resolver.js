const User = require('../models/UserModel')
const ObjectId = require('mongoose').Types.ObjectId

const userResolver = (req, res, next) => {
    // Check to see if the user exists, if not, then create
    // the user.
    console.log('userResolver firing...');
    if(!req.hasOwnProperty('currentUser')) {
        // Kick them out, they did not authenticate
        res.status(488).send('Really chum, you do not belong here...')
    } else {
        // currentUser contains
        // {
        //      iss: token url
        //      aud: app id, I believe
        //      auth_time: time of authentication, I think
        //      user_id: firebaseID
        //      sub: the user_id again
        //      iat: same as the auth_time
        //      exp: a number for the expiration of the token...
        //      email: the user email address, important for new users
        //      email_verified: true/false.
        //      firebase: {
        //          identities: {
        //              email: [array]
        //          },
        //          sign_in_provider: 'password' // we're only set to use password right now
        //      },
        //      uid: same as user_id/sub
        // }

        // So the Firebase user_id cannot be used as a mongodb _id
        // it has 28 characters and mongo accepts 12 or 24 characters
        // as an ObjectId.   So I added it as a field called
        // firebaseID that we can lookup if needed.
        //
        // I am adding a field onto the req called currentUserID
        // Now let's see if the user exists...
        User.findOne({ firebaseID: req.currentUser.user_id })
            .then(async (user) => {
                if(!user) {
                    try {
                        user = await User.create({
                            firebaseID: req.currentUser.user_id,
                            email: req.currentUser.email
                        })
                        await user.save();
                    } catch (err) {
                        console.log('Unable to create user')
                    }
                }
                if(user) {
                    req['currentUserID'] = user._id.toString()
                }
            })
            .catch( err => {
                console.log('findOneFailure', err)
            })
            .finally(() => {
                next();
            })
    }
}

module.exports = userResolver