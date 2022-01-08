import express from 'express'
import cors from 'cors'
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import jwt from 'jsonwebtoken';

// Database
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
// Cache
var PROTO_PATH2 = './protos/cache.proto';
var packageDefinition2 = protoLoader.loadSync(
    PROTO_PATH2,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var cache = grpc.loadPackageDefinition(packageDefinition2).cache;

const app = express()
app.use(cors())
const port = 3030
const pKey = 'ArslanaErfanAmirhossein'

var target = 'localhost:50051';
var client_db = new db.database(target, grpc.credentials.createInsecure());
var target2 = 'localhost:50052';
var client_cache = new cache.Greeter(target2, grpc.credentials.createInsecure());

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
        let flag = 0;
        // Check if in cache
        console.log({
            key: 'USERTable' + user,
            value: ''
        })
        let res_cache;
        client_cache.GetKey({
            key: 'USERTable' + user,
            value: ''
        }, (err, response) => {
            res_cache = response.successful;
            if (res_cache != false) {
                console.log(res_cache);
                if (response.message == pass) {
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
                console.log('Found in Cache')
            } else {
                console.log('NOT Found in Cache')
                let valid;
                client_db.loginUser({ username: user, password: pass }, (err, response) => {
                    console.log(user)
                    console.log(pass)
                    console.log(response)
                    valid = response.successful;
                    console.log(valid)
                    if (valid) {
                        var token = jwt.sign({
                            user: user,
                            pass: pass,
                            exp: Math.floor(Date.now() / 1000) + (5 * 60),
                        }, pKey);

                        res.json({
                            token: token,
                            message: 'Valid'
                        });
                        client_cache.SetKey({
                            key: 'USERTable' + user,
                            value: pass
                        }, (err, response) => {
                            let res_cache2 = response.successful;
                            if (res_cache2 == true)
                                console.log('Stored in Cache')
                        });
                    } else {
                        res.json({
                            token: '',
                            message: 'Username or Password is WRONG!'
                        });
                    }
                });
            }
        });
    }
})

app.get('/Signup', async (req, res) => {
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
        client_db.createUser({ username: user, password: pass }, (err, response) => {
            console.log('Login: ' + user)
            valid = response.successful;
            console.log(valid)
            if (valid == true) {
                res.json({
                    message: 'Done!'
                });
                client_cache.SetKey({
                    key: 'USERTable' + user,
                    value: pass
                }, (err, response) => {
                    let res_cache = response.successful;
                    if (res_cache == true)
                        console.log('Stored in Cache')
                });
            } else {
                res.json({
                    token: '',
                    message: response.message
                });
            }
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})