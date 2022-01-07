var PROTO_PATH = './protos/db.proto';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';


import createUser from './service/createUser.js'
import loginUser from './service/loginUser.js'
import createNote from './service/createNote.js'
import deleteNote from './service/deleteNote.js'
import updateNote from './service/updateNote.js'


var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var db = grpc.loadPackageDefinition(packageDefinition).cache;


async function CreateUser(call, callback) {
    try{
        await createUser(call.request.username, call.request.password);
    }
    catch (err) {
        callback(null, {message: 'An error occuerd while creating a User with username =  ' + call.request.username + " " + err});
    }
}

async function LoginUser(call, callback) {
    try{
        console.log(call.request)
        const login_failed =  await loginUser(call.request.username, call.request.password);
        console.log(login_failed)
        if (login_failed == false){
            callback(null, {message: false });
        }
        else{
            console.log(login_failed)
            callback(null, {message: true });
        }
    }
    catch (err) {
        callback(null, {message: 'An error occuerd while updateing a Text with NewText =  ' + call.request.username + err});
    }
}

function CreateNote(call, callback) {
    try{
        createNote(call.request.text, call.request.UserId);
    }
    catch (err) {
        callback(null, {message: 'An error occuerd while creating a Note with text =  ' + call.request.text + err});
    }
}

function DeleteNote(call, callback) {
    try{
        deleteNote( call.request.text, call.request.UserId);
    }
    catch (err) {
        callback(null, {message: 'An error occuerd while deleting a Note with text =  ' + call.request.text  + err});
    }
}

function UpdateNote(call, callback) {
    try{
        updateNote(call.request.text, call.request.UserId, call.request.NewText);
    }
    catch (err) {
        callback(null, {message: 'An error occuerd while updateing a Text with NewText =  ' + call.request.username + err});
    }
}



function main() {
    var server = new grpc.Server();
    server.addService(db.database.service, {
        createUser: CreateUser,
        loginUser: LoginUser,
        createNote: CreateNote,
        deleteNote: DeleteNote,
        updateNote: UpdateNote
        });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}
  
main();