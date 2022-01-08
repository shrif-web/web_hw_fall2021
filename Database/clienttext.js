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
    {keepCase: true,
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

  client.createUser({username:'ali', password:'adfasfasdf'}, function(err, response) {
    console.log( response.successful, response.message);
    
      client.loginUser({username:'erfan', password:'adfasfasdf'}, function(err, response) {
        console.log( response.successful, response.message);
      });

      client.createNote({text:'salam arsalans', username:'ali'}, function(err, response) { 
        console.log( response.successful, response.message);
      });
  });
}

main()