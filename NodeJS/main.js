const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

app.post('/node', async(req, res) => {
  /*
  const { Client } = require('pg')
  const client = new Client()
  await client.connect()
  const res2 = await client.query('SELECT * FROM "Students"')
  console.log(res2.rows[0].name) // Hello world!
  res.send(res2.rows[0].name)
  */
  //res.send('Hello World!')
  //res.send(req.body.Input1)
  //const hash = crypto.createHash('sha256').update(pwd).digest('base64');
  //await client.end()

  //passing the data to be hashed
  data = hash.update(req.body.Input1, 'utf-8');
  //Creating the hash in the required format
  gen_hash= data.digest('hex');
  //Printing the output on the console
  console.log("hash : " + gen_hash);
  res.send("hash : " + gen_hash);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})