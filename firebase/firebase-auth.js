const firebaseSetup = require('./firebase-setup')

const firebaseAuth = async (req, res, next) => {
    try {
        if(req.headers?.authorization?.startsWith('Bearer ')) {
            const idToken = req.headers.authorization.split('Bearer ')[1];

            const decodedToken = await firebaseSetup.auth().verifyIdToken(idToken)
            req['currentUser'] = decodedToken;
            next();
        } else {
            res.status(488).send('Unauthorized, sorry chum.')
        }
    } catch(err) {
        console.log(err);
    }

}

module.exports = firebaseAuth