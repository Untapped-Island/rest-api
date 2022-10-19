'use strict';
const express = require('express');
const bearerAuth = require('./auth/middleware/bearer');
const basicAuth = require('./auth/middleware/basic')
const { users } = require('./auth/models/usersSchema');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
// const router = express.Router();
// const bcrypt = require('bcrypt');


// const PORT = process.env || 3002
app.get('/userWelcome', (req, res) => {
  res.status(200).send(`Welcome, to the Magic of the Gathering Collection Card Porfolio!! You must signup/signin to join and add as many cards as you like.`);
})

app.get('/users', bearerAuth, async (req, res, next) => {
  let user = await userModel.findAll();
  let payload = {
    results: user,
  };
  res.status(200).send(payload);
});


app.post('/signup', async (req, res, next) => {
  console.log('I am here');
  try {
    console.log(req.body);
    let { username, password } = req.body;

    console.log('35=>', users);


    let user = await users.create(req.body);

    console.log(user);


    res.status(200).send(user);
  } catch (err) {
    next('signup error occurred');
  }
});



//define a signin route to returns user to client (confirm user auth)
app.post('/signin', (req, res, next) => {
  try{
    res.status(200).send(req.user);
  }
  catch(err){
    next('signin error occurred');
  }
});





module.exports = {
 start:(PORT) => app.listen(PORT, '127.0.0.1', console.log('Server has started on: ', PORT))
 
}
// // User access Routes
// app.use(authRouter);

