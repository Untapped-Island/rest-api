'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

// middle
const bearerAuth = require('../../auth/middleware/bearer');

// const { usersSchema } = require('../../src/auth/models/usersSchema');
const { prisma } = require('.prisma/client');

app.get('/users', bearerAuth, async (req, res, next) => {

  try{
  let allUsers = await prisma.players.findAll();
  let payload = {
    results: allUsers,
  };
  res.status(200).send(payload);
}
catch(err){
  next('User error occurred');
}
});

// bearer auth implemented, check users by conditional
app.put('/users/:username', bearerAuth, async (req, res, next) => {
  try{

    let { id } = req.params;
    let userUpdate = await prisma.players.update(req.body, id);
    res.status(200).send('update successful: ', userUpdate);
  }
  catch(err){
    next('update error occurred');
  }
});

// bearer auth implemented, check users by conditional
app.delete('/users/:username', bearerAuth, async (req, res, next) => {
  try{

    const { id } = req.params;
    const post = await prisma.player.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send('user deleted')
  }
  catch(err){
    next('Delete error occurred')
  }
});

module.exports = app;
