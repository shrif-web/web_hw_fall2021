const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const crypto = require('crypto');

app.post('/node', async(req, res) => {
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
    password: 'amir1379',
    database: 'postgres'
  })
  await client.connect()
  const res2 = await client.query('SELECT "Key" FROM public."Train" where "Hash" = \''+ gen_hash + '\'')
  if(res2.rows.length === 0){
    const res4 = await client.query('INSERT INTO "Train"("Key","Hash") VALUES (\'' + req.body.Input1 + '\',\''+gen_hash+'\')')    
}
  await client.end()
})

app.get('/node', async(req, res) => {

    const { Client } = require('pg')
    const client = new Client({
      user: 'postgres',
      password: 'amir1379',
      database: 'postgres'
    })
    await client.connect()
    const res2 = await client.query('SELECT "Key" FROM public."Train" where "Hash" = \''+ req.params.Input1 + '\'')
    if(res2.rows.length === 0){
      // const res4 = await client.query('INSERT INTO "Train"("Key","Hash") VALUES (\'' + req.params.Input1 + '\',\''+gen_hash+'\')')    
        res.send('No record!')
    } else{
        res.send(res2.rows[0].key)
    }
    console.log(req.params)
    await client.end()
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})