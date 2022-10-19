'use strict';

const express = require('express');
const bearerAuth = require('../../src/auth/middleware/bearer');
// const basicAuth = require('./auth/middleware/basic')
const { usersSchema } = require('../../src/auth/models/usersSchema');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const userRouter = express.Router();

userRouter.post('/users/:id/cards/cardId', async (req, res, next) => {
  
});


userRouter.get('/users', bearerAuth, async (req, res, next) => {
  let allUsers = await usersSchema.findAll();
  let payload = {
    results: allUsers,
  };
  res.status(200).send(payload);
});

userRouter.get('/users/:id', async (req, res, next) => {
  let { id } = req.params;
  console.log('Checking for the id: ', id);

  let user = await usersSchema.findOne({where: {id: req.params}});
  res.status(200).send(user);
});

userRouter.put('/users/:id', async (req, res, next) => {
  let { id } = req.params;
  let userUpdate = await usersSchema.update(req.body, id);
  res.status(200).send(userUpdate);
});

// userRouter/delete('/users/:id', async (req, res, next) => {
//   try{
//     let { id } = req.params;
//     let message = await usersSchema.delete(id)
//   }
//   catch(err){
//     next(err.message);
//   }
// });

module.exports = {userRouter};
