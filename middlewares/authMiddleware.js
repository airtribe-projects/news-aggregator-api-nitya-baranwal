// require('dotenv').config();
// const SECRETPASSWORD = process.env.SECRET_PASSWORD;

// function authMiddleware(req, res, next) {
//     const headers = req.headers;
//     const authorization = headers["authorization"];
//     console.log(authorization, "authorization");

//     if(authorization === SECRETPASSWORD) {
//         next();
//     } else {
//         res.send({message: "error"});
//     }
// }

// module.exports = authMiddleware;
