const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const SECRET_KEY = require('./router/auth_users.js').secretKey;
const TOKEN_KEY = require('./router/auth_users.js').tokenKey;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    const authorization = req.session.authorization;
    
    if (authorization) {
        const token = authorization[TOKEN_KEY];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({message: "User not authenticated: " + err});
            }
        })
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
