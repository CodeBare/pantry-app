require('dotenv').config();
const firebase = require('firebase-admin');
const serviceAccount = require('./firebase-config');

module.exports = firebase.initializeApp(serviceAccount)

