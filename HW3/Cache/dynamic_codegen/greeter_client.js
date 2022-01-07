var PROTO_PATH = './../protos/cache.proto';

import parseArgs from 'minimist';
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
var cache = grpc.loadPackageDefinition(packageDefinition).cache;

function main() {
  var target;
  target = 'localhost:50051';

  var client = new cache.Greeter(target, grpc.credentials.createInsecure());

  client.SetKey({key: 'a1', value: 'aval'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a2', value: 'dovom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a3', value: 'sevom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a4', value: 'charom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a1', value: 'aval2'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a2', value: 'dovom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a3', value: 'sevom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.SetKey({key: 'a4', value: 'charom'}, function(err, response) {
    console.log('Set:', response.message);
  });
  client.GetKey({key: 'a2', value: 'aval'}, function(err, response) {
    console.log('Get:', response.message);
  });
  client.GetKey({key: 'a3', value: 'dovom'}, function(err, response) {
    console.log('Get:', response.message);
  });
  client.GetKey({key: 'a1', value: 'sevom'}, function(err, response) {
    console.log('Get:', response.message);
  });
  client.GetKey({key: 'a4', value: 'charom'}, function(err, response) {
    console.log('Get:', response.message);
  });
  // client.Clear({key: 'a', value: 'aval'}, function(err, response) {
  //   console.log('Clear:', response.message);
  // });
}

main();
