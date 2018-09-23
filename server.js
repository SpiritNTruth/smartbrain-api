const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const pgdb = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'pgadmin',
    password : 'rkatk153',
    database : 'smart-brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(pgdb.users) });
app.post('/signin', signin.handleSignin(pgdb, bcrypt));  //this one is the same as others - put (req, res) in signin.js
app.post('/register', (req, res) => { register.handleRegister(req, res, pgdb, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, pgdb) });
app.put('/image', (req, res) => { image.handleImage(req, res, pgdb) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(3000, () => {
  console.log('app is running on port 3000');
});