const express = require('express')
const app = express()
const port = 3030
var jwt = require('jsonwebtoken');
const pKey = 'ArslanaErfanAmirhossein'

var cors = require('cors')
app.use(cors())

function checkvalid() {
    try {
        let t = jwt.verify(token, pKey);
        return t.user;
        console.log(t.user + 'has just logged in');
    } catch (err) {
        console.log('Expired time user');
        return 'fail';
    }
}

// app.post('/Login', (req, res) => {
app.get('/Login', (req, res) => {
    let user;
    let pass;
    try {
        // user = req.body.user;
        user = req.query.user;
        if (user == undefined)
            throw 'Err';
        pass = req.query.pass;
        if (pass == undefined)
            throw 'Err';
    } catch {
        user = undefined;
        pass = undefined;
        res.json({
            message: 'No Input!'
        });
    }
    if (user != undefined && pass != undefined) {
        /* 
            Check with db
        */
        /* if valid */
        var token = jwt.sign({
            user: user,
            pass: pass,
            exp: Math.floor(Date.now() / 1000) + (5 * 60),
        }, pKey);

        res.json({
            token: token,
            message: 'Valid'
        });
        /* Else */
        // res.json({
        //     token: '',
        //     message: 'Username or Password is WRONG!'
        // });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})