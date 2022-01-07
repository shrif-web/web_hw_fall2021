import express from 'express'
import cors from 'cors'
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import jwt from 'jsonwebtoken';

var PROTO_PATH = './protos/db.proto';
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var db = grpc.loadPackageDefinition(packageDefinition).cache;

const app = express()
app.use(cors())
const port = 3030
const pKey = 'ArslanaErfanAmirhossein'

var target = 'localhost:50051';
var client = new db.database(target, grpc.credentials.createInsecure());

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
app.get('/Login', async (req, res) => {
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
        let valid;
        client.loginUser({ username: user, password: pass }, (err, response) => {
            console.log(user)
            console.log(pass)
            valid = response.message;
            console.log(valid)
            if (valid == 'true') {
                var token = jwt.sign({
                    user: user,
                    pass: pass,
                    exp: Math.floor(Date.now() / 1000) + (5 * 60),
                }, pKey);

                res.json({
                    token: token,
                    message: 'Valid'
                });
            } else {
                res.json({
                    token: '',
                    message: 'Username or Password is WRONG!'
                });
            }
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})