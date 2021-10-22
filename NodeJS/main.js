const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const crypto = require('crypto');

app.post('/node', async(req, res) => {
  //res.send('Hello World!')
  //res.send(req.body.Input1)
  //const hash = crypto.createHash('sha256').update(pwd).digest('base64');
  //await client.end()

  const hash = crypto.createHash('sha256');
  //passing the data to be hashed
  data = hash.update(req.body.Input1, 'utf-8');
  //Creating the hash in the required format
  gen_hash= data.digest('hex');
  //Printing the output on the console
  console.log("hash : " + gen_hash);
  res.send("hash : " + gen_hash);

  const { Client } = require('pg')
  const client = new Client({
    user: 'postgres',
    password: 'Arsalan995384',
    database: 'DB_First'
  })
  await client.connect()
  const res2 = await client.query('SELECT * FROM "Train" WHERE "Hash"=\''+gen_hash+'\'')
  if(res2.rows.length === 0){
    const res3 = await client.query('SELECT id FROM "Train" ORDER BY id DESC LIMIT 1')
    const res4 = await client.query('INSERT INTO "Train"(id,"Hash") VALUES ('+res3.rows[0].id+',\''+gen_hash+'\') ')    
  }
  await client.end()
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})