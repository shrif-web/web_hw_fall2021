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

function checkvalid(token) {
    try {
        let t = jwt.verify(token, pKey);
        return t.user;
        console.log(t.user + 'has just logged in');
    } catch (err) {
        console.log('Expired time user');
        return undefined;
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

app.get('/Create', async (req, res) => {
    let token;
    let text;
    try {
        // user = req.body.user;
        token = req.query.token;
        if (token == undefined)
            throw 'Err';
        text = req.query.text;
        if (text == undefined)
            throw 'Err';
    } catch {
        token = undefined;
        text = undefined;
        res.json({
            message: 'No Input!'
        });
    }
    if (text != undefined && token != undefined) {
        let res_cache;
        let user = checkvalid(token);
        if (user != undefined) {
            client_db.createNote({
                text: text,
                username: user
            }, (err, response) => {
                let res_db = response.successful;
                if (res_db) {
                    client_cache.SetKey({
                        key: 'TEXTTABLE' + user,
                        value: text
                    }, () => {
                        res.json({
                            message: 'Done!'
                        });
                    })
                }
            });
        } else {
            res.json({
                message: 'Please Login Again!'
            });
        }
    }
})

app.get('/See', async (req, res) => {
    let token;
    let num;
    try {
        // user = req.body.user;
        token = req.query.token;
        if (token == undefined)
            throw 'Err';
        num = req.query.num;
        if (num == undefined)
            throw 'Err';
    } catch {
        token = undefined;
        num = undefined;
        res.json({
            message: 'No Input!'
        });
    }
    if (num != undefined && token != undefined) {
        let res_cache;
        let user = checkvalid(token);
        if (user != undefined) {
            // TODO cahce checking
            client_db.getNote({
                start: num,
                end: num + 2,
                username: user
            }, (err, response) => {
                console.log(response)
                let res_db = response.successful;
                if (res_db) {
                    let message = response.texts[0];
                    client_cache.SetKey({
                        key: 'TEXTTABLE' + user,
                        value: message
                    }, () => {
                        res.json({
                            message: message
                        });
                    })
                }
            });
        } else {
            res.json({
                message: 'Please Login Again!'
            });
        }
    }
})

app.get('/Update', async (req, res) => {
    let oldtext;
    let newtext;
    let token;
    try {
        // user = req.body.user;
        token = req.query.token;
        if (token == undefined)
            throw 'Err';
        oldtext = req.query.oldtext;
        if (oldtext == undefined)
            throw 'Err';
        newtext = req.query.newtext;
        if (newtext == undefined)
            throw 'Err';
    } catch {
        oldtext = undefined;
        newtext = undefined;
        token = undefined;
        res.json({
            message: 'No Input!'
        });
    }
    if (oldtext != undefined && newtext != undefined && token != undefined) {
        let res_cache;
        let user = checkvalid(token);
        if (user != undefined) {
            // TODO cahce checking
            client_db.updateNote({
                text: oldtext,
                newtext: newtext,
                username: user
            }, (err, response) => {
                console.log(response)
                let res_db = response.successful;
                if (res_db) {
                    client_cache.SetKey({
                        key: 'TEXTTABLE' + user,
                        value: newtext
                    }, () => {
                        res.json({
                            message: 'Done!'
                        });
                    })
                } else {
                    res.json({
                        message: 'Error!'
                    });
                }
            });
        } else {
            res.json({
                message: 'Please Login Again!'
            });
        }
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})