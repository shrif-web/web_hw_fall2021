// importing the required libraries
const express = require('express')
const app = express()

// using this library to send json response
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using this library to hash the input
const crypto = require('crypto');

// using this libraries cors
var cors = require('cors')
app.use(cors())


// read static data from config file
const config_data = require('./config/config.json');
const { config } = require('process');

// setting the port from config file
const port = config_data.port

// This function get a string as a key and calculate it's hash and
// if the hash doesn't exist save the key and the hash in the database
app.post('/node', async(req, res) => {
  
  // handel the empty input 
  try {
    // the input must be greater than 8 character
    if (req.body.Input1.length < 8){
      res.json({response: "Input needs to be 8 character at least!"});
      return
    }
  } catch (error) {
    res.json({response: "No Input!"});
    return
  }

  //distinguish the hash tupe
  const hash = crypto.createHash('sha256');

  //passing the data to be hashed
  data = hash.update(req.body.Input1, 'utf-8');

  //Creating the hash in the required format
  gen_hash= data.digest('hex');

  //Printing the output on the console
  console.log("hash : " + gen_hash);

  //Send the hash as the response
  res.json({response: gen_hash});

  // fill out the connection string 
  const { Client } = require('pg')
  const client = new Client({
    host: "www.pg.com",
    user: config_data.user,
    password: config_data.password,
  })

  // connect to the database
  await client.connect()

  // this block of code checks if the database existed or not and if the database if not existed create a database
  const data_base_state =  await client.query('SELECT 1 AS result FROM pg_database WHERE datname=\'test-db\'')
  if (data_base_state.rows.length === 0){
    await client.query('CREATE DATABASE "test-db" WITH OWNER = admin ENCODING = \'UTF8\' CONNECTION LIMIT = -1;')
    await client.query('CREATE TABLE public."Train"("Key" character varying,"Hash" character varying,PRIMARY KEY ("Key"));ALTER TABLE IF EXISTS public."Train" OWNER to admin;')
  }

  // search for the corresponding hash of the given key
  const query_result = await client.query('SELECT "Key" FROM public."Train" where "Hash" = \''+ gen_hash + '\'')
  if(query_result.rows.length === 0){
    await client.query('INSERT INTO "Train"("Key","Hash") VALUES (\'' + req.body.Input1 + '\',\''+gen_hash+'\')')    
  }

  // close the connection
  await client.end()
})

// This function returns the corresponding key of the given hash 
app.get('/node', async(req, res) => {
  // handel the empty input 
  try {
    // the hash must be greater than 8 character
    if (req.query.Input1.length < 8){
      res.json({response: "Input needs to be 8 character at least!"});
      return
    }
  } catch (error) {
    res.json({response: "No Input!"});
    return
  }
  // fill out the connection string 
  const { Client } = require('pg')
  const client = new Client({
    host: "www.pg.com",
    user: config_data.user,
    password: config_data.password,
  })

  // connect to the database
  await client.connect()

  // this block of code checks if the database existed or not and if the database if not existed create a database
  const data_base_state =  await client.query('SELECT 1 AS result FROM pg_database WHERE datname=\'test-db\'')  
  if (data_base_state.rows.length === 0){
    await client.query('CREATE DATABASE "test-db" WITH OWNER = admin ENCODING = \'UTF8\' CONNECTION LIMIT = -1;')
    await client.query('CREATE TABLE public."Train"("Key" character varying,"Hash" character varying,PRIMARY KEY ("Key"));ALTER TABLE IF EXISTS public."Train" OWNER to admin;')
  }

  // search the database for the key of the given hash
  const query_result = await client.query('SELECT "Key" FROM public."Train" where "Hash" = \''+ req.query.Input1 + '\'')
  if(query_result.rows.length === 0){
    // const res4 = await client.query('INSERT INTO "Train"("Key","Hash") VALUES (\'' + req.params.Input1 + '\',\''+gen_hash+'\')')    
      res.json({response: "No record found!"})
  } else{
      res.json({response: query_result.rows[0].Key})
  }

  // close the connection
  await client.end()
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})