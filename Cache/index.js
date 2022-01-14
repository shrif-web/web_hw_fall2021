import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv'
import { ClearKey, GetKey, SetKey, Clear } from './modules/modules.js'
console.log('Cache service has just started');
dotenv.config();

var PROTO_PATH = process.env.Cache_Proto_Path;
console.log(PROTO_PATH)
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
  server.addService(cache.Greeter.service, {
    Clear: Clear,
    SetKey: SetKey,
    GetKey: GetKey,
    ClearKey: ClearKey
  });
  server.bindAsync(process.env.Cache_Port, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
