import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { GetKey, SetKey, Clear } from './modules/modules.js'
var PROTO_PATH = './protos/cache.proto';
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var cache = grpc.loadPackageDefinition(packageDefinition).cache;

function main() {
  var server = new grpc.Server();
  server.addService(cache.Greeter.service, { Clear: Clear, SetKey: SetKey, GetKey: GetKey });
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
