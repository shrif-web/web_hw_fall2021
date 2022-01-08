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
        const user_created = await createUser(call.request.username, call.request.password);
        if (user_created == false){
            callback(null, {successful: false , message: 'user allredy existed!' });
        }
        else{
            callback(null, {successful: true, message: 'user added successfuly!' });
        }
    }
    catch (err) {
        callback(null, {successful: false
            ,message: 'An error occuerd while creating a User with username =  ' 
            + call.request.username + " \n " + err});
    }
}

async function LoginUser(call, callback) {
    try{
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
    catch (err) {
        callback(null, {successful: false
            ,message: 'An error occuerd while updateing a Text with NewText =  ' 
            + call.request.username + " \n " + err});
    }
}

async function CreateNote(call, callback) {
    try{
        const note_created = await createNote(call.request.text, call.request.username);
        if (note_created == true){
            callback(null, {successful: true, message: 'note created!' });
        }
        else {
            callback(null, {successful: false, message: 'There was a problem try again!' });
        }
    }
    catch (err) {
        callback(null, { successful: false
            ,message: 'An error occuerd while creating a Note with text =  '
            + call.request.text + " \n " + err});
    }
}

async function DeleteNote(call, callback) {
    try{
        const note_deleted = await deleteNote( call.request.text, call.request.UserId);
        if (note_deleted == true){
            callback(null, {successful: true, message: 'note deletetd!' });
        }
        else{
            callback(null, {successful: false, message: 'There was a problem try again!' });
        }
    }
    catch (err) {
        callback(null, { successful: false
            ,message: 'An error occuerd while deleting a Note with text =  ' 
            + call.request.text + " \n " + err});
    }
}

async function UpdateNote(call, callback) {
    try{
        const note_updated = await updateNote(call.request.text, call.request.UserId, call.request.NewText);
        if (note_deleted == true){
            callback(null, {successful: true, message: 'note updtated!' });
        }
        else{
            callback(null, {successful: false, message: 'Text not found to update!' });
        }
    }
    catch (err) {
        callback(null,  { successful: false
            ,message: 'An error occuerd while updateing a Text with NewText =  ' 
            + call.request.username + " \n " + err});
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