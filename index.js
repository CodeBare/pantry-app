const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = (require('dotenv')).config;
const firebaseAuth = require('./firebase/firebase-auth');
const headerSetup = require('./router-middleware/header-setup')
const userResolver = require('./router-middleware/user-resolver')

config()

const whitelist = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];
const app = express();

const corsOptionsDelegate = (req, callback) => {
    const corsOptions = {}
    if(whitelist.indexOf(req.header('Origin')) !== -1)
        corsOptions.origin = true;
    else if(process.env.NODE_ENV === 'production')
        corsOptions.origin = true;
    else
        corsOptions.origin = false;

    callback(null, corsOptions)
}

if(process.env.MONGODB) {
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Connected to database')
        })
        .catch(err => {
            console.log('Error connecting to database', err.message)
        })
} else {
    console.log('Add MONGODB connection string to environment')
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const clientHeaderOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL : null;

app.use(cors(corsOptionsDelegate));

app.use(headerSetup);
app.use(firebaseAuth);
app.use(userResolver);

// stub for api routes
// app.use('/api', null);

// Get all other routes and send a response.
// Eventually replace with API documentation.
app.get('*', (req, res) => {
    res.status(200).send('These are not the bots you are looking for.' + req.toString())
})

app.listen(8850, () => {
    console.log('Server started on port', 8850)
})