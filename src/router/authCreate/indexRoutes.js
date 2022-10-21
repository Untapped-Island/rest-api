"use strict";
const express = require('express');
const basicAuth = require('../../auth/middleware/basic')
const { 
  addCardToProfileById,
} = require('../../database-logic/user-functions')

const prisma = require('../../database-logic/prisma-client.js');
const bcrypt = require('bcrypt');
const jwt = require('../../../utils/jwt.js');

// INSTANTIATE EXPRESS AND CORS
const indexRouter = express.Router();
// USE MIDDLEWARE IN ALL ROUTES


// const PORT = process.env || 3002
indexRouter.get('/userWelcome', (req, res) => {
  res.status(200).send(`User Build.`);
})



  indexRouter.post('/signup', async (req, res, next) => {
    try {
    let { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const checkUserExists = await prisma.player.findUnique({
      where: {
        name: username
      }
    })
    if (checkUserExists) {
      next('Username already exists.')
    } else {
      const user = await prisma.player.create({
        data: {
          name: username,
          password: hashedPassword
        }
      })
      const accessToken = await jwt.signAccessToken({
        user: user.name,
      })
      // addCardToProfileById("12cc97ec-5d03-4434-a31b-51e77d208466", user.name) //inquirer ---
      // addCardToProfileById("04aa210a-235f-4e07-87d1-0d28cdf6888b", user.name)
      console.log(`User ${user.name} created successfully`);
      res.status(201).send({
        id: user.id,
        username: user.name,
        createdAt: user.createdAt,
        accessToken: accessToken
      });
    }
    // let user = await users.create(req.body);

  } catch (err) {
    console.error(err.message)
    next('signup error occurred');
  }
});


//define a signin route to returns user to client (confirm user auth)
indexRouter.post('/signin', basicAuth, (req, res, next) => {
  try {

    res.status(200).send({
      username: req.user,
      accessToken: req.accessToken
    });
  }
  catch(err){
    next('signin error occurred');
  }
});


module.exports = indexRouter;





