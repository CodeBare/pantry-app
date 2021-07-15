require('dotenv').config();

const headers_first = 'Origin, X-Requested-With, Content-Type, Accept';
const headers_second = 'Authorization, Access-Control-Allow-Credentials, x-access-token';

const whitelist = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];

const headerSetup  = (req, res, next) => {
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
}

module.exports = headerSetup