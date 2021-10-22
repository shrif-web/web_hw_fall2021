const express = require('express')
const app = express()
const port = 3000

app.get('/node', async(req, res) => {
  /*
  const { Client } = require('pg')
  const client = new Client()
  await client.connect()
  const res2 = await client.query('SELECT * FROM "Students"')
  console.log(res2.rows[0].name) // Hello world!
  res.send(res2.rows[0].name)
  */
  //res.send('Hello World!')
  res.send(req.body.Input1)
  //const hash = crypto.createHash('sha256').update(pwd).digest('base64');
  //await client.end()
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})