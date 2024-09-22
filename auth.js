const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.createAccess = (user) => {
    const data = {
        id: user._id,
        email: user.mail
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
}

module.exports.verify = (req, res, next) => {
    console.log('authorization: ' + req.headers.authorization);

    let token = req.headers.authorization;
    console.log(typeof token)

    if (typeof token === 'undefined'){
        return res.status(404).send({error: 'Failed. No Token'})
    } else {
        console.log(token)

        token = token.slice(7, token.length);

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
            if(err){
                return res.status(403).send({
                    auth: 'Failed',
                    message: err.message
                })
            } else {
                console.log('result from verify method:')
                console.log(decodedToken)

                req.user = decodedToken;

                next();
            }
        })
    }
}