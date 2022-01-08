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

function main() {

  var target = 'localhost:50052';

  var client = new db.database(target, grpc.credentials.createInsecure());

  client.loginUser({ username: 'arsalan', password: 'anghezis' }, function (err, response) {
    console.log('Greeting:', response.message);
  });
}

main()