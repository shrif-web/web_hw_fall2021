/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = './protos/db.proto';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

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

async function main() {

  var target = 'localhost:50051';

  var client = new db.database(target,
    grpc.credentials.createInsecure());

  client.updateNote({ username: 'admin', id: 1, newtext: "adfadsfsadfsadfasd" }, function (err, response) {
    console.log(response.successful, response.message);;

    // client.getNote({ username: 'ali', id: 0 }, function (err, response) {
    //   console.log( response.successful, response.text);
    // });

      // client.createNote({username:'mamd' ,text: "text1"}, function(err, response) { 

      //   console.log( response.successful, response.message);
      // });
      // client.createNote({username:'mamd' ,text: "text2"}, function(err, response) { 

      //   console.log( response.successful, response.message);
      // });
      // client.createNote({username:'ali' ,text: "text3"}, function(err, response) { 

      //   console.log( response.successful, response.message);
      // });
      // client.createNote({username:'ali' ,text: "text4"}, function(err, response) { 

      //   console.log( response.successful, response.message);
      // });
    });
  }

main()