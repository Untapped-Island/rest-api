'use strict';
const express = require('express');
const bearerAuth = require('../auth/middlewre/bearer');
const { userModel } = require('./models');
const app = express()
const router = express.Router();
const bcrypt = require('bcrypt');


const PORT = process.env || 3002


app.get('/userWelcome', (req, res) => {
  let { name } = req.query;
  res.status(200).send(`Welcome ${name}, to the Magic of the Gathering Collection Card Porfolio!! You much signup/signin to join and add as many cards as you like.`)
})


router.post('/signup', async (req, res, next) => {
  console.log('I am here');
  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);

    console.log({
      username,
      password: encryptedPassword,
    });

    let user = await userModel.create({
      username,
      password: encryptedPassword,
    });

    res.status(200).send(user);
  } catch (err) {
    next('signup error occurred');
  }
});



//define a signin route to returns user to client (confirm user auth)
router.post('/signin', bearerAuth, (req, res, next) => {
  res.status(200).send(req.user);
});


app.listen(PORT, console.log(`Server is started on Port ${PORT}`));
