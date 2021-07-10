const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = (require('dotenv')).config;
const firebaseAuth = require('./firebase/firebase-auth');

config()


const app = express();
const router = express.Router();

const headers_first = 'Origin, X-Requested-With, Content-Type, Accept';
const headers_second = 'Authorization, Access-Control-Allow-Credentials, x-access-token';
const whitelist = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];

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

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if(whitelist.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin)
    } else if(clientHeaderOrigin) {
        res.header('Access-Control-Allow-Origin', clientHeaderOrigin)
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS, PUT');
    res.header('Access-Control-Allow-Headers', `${headers_first}, ${headers_second}`);
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
})

app.use(firebaseAuth);

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