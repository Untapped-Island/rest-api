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
const userRouter = express.Router();


userRouter.get('/users', bearerAuth, async (req, res, next) => {
  let user = await users.findAll();
  let payload = {
    results: user,
  };
  res.status(200).send(payload);
});

userRouter.get('/users/:id', async (req, res, next) => {
  let { id } = req.params;
  console.log('Checking for the id: ', id);
})

