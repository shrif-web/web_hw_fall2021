var PROTO_PATH = './protos/db.proto';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';


import createUser from './service/createUser.js'
import loginUser from './service/loginUser.js'
import createNote from './service/createNote.js'
import deleteNote from './service/deleteNote.js'
import updateNote from './service/updateNote.js'
import getNote from './service/getNote.js';


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
    const user_created = await createUser(call.request.username, call.request.password);
    if (user_created == false){
        callback(null, {successful: false , message: 'user allredy existed!' });
    }
    else{
        callback(null, {successful: true, message: 'user added successfuly!' });
    }
}

async function LoginUser(call, callback) {
    console.log(call.request)
    const login_failed =  await loginUser(call.request.username, call.request.password);

    if (login_failed == false){
        callback(null, {successful: false, message: 'user not existed!'});
    }
    
    else{
        console.log(login_failed)
        callback(null, {successful: true, message: 'user found!' });
    }
}

async function CreateNote(call, callback) {
    const note_created = await createNote(call.request.text, call.request.username);
    if (note_created == true){
        callback(null, {successful: true, message: 'note created!' });
    }
    else {
        callback(null, {successful: false, message: 'There was a problem try again!' });
    }
}

async function DeleteNote(call, callback) {
    const note_deleted = await deleteNote( call.request.text, call.request.username);
    if (note_deleted == true){
        callback(null, {successful: true, message: 'note deletetd!' });
    }
    else{
        callback(null, {successful: false, message: 'There was a problem try again!' });
    }
}

async function UpdateNote(call, callback) {
    console.log(call.request)
    const note_updated = await updateNote(call.request.text, call.request.username, call.request.newtext);
    if (note_updated == true){
        callback(null, {successful: true, message: 'note updtated!' });
    }
    else{
        callback(null, {successful: false, message: 'Text not found to update!' });
    }
}

async function GetNote(call, callback) {
    const note = await getNote(call.request.username, call.request.start, call.request.end);
    if (note != null){
        callback(null, {successful: true, texts: note });
    }
    else{
        callback(null, {successful: false, message: 'An error eccoured nothing to show' });
    }
}

function main() {
    var server = new grpc.Server();
    server.addService(db.database.service, {
        createUser: CreateUser,
        loginUser:  LoginUser,
        createNote: CreateNote,
        deleteNote: DeleteNote,
        updateNote: UpdateNote,
        getNote:    GetNote
        });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}
  
main();