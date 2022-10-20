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

app.get('/users/:id', async (req, res, next) => {
  try{
    let { id } = req.params;
    console.log('Checking for the id: ', id);
    
    let user = await prisma.players.findUnique({where: {id: req.params}});
    res.status(200).send(user);
  }
  catch(err){
    next('user not found');
  }
});

app.put('/users/:id', async (req, res, next) => {
  try{

    let { id } = req.params;
    let userUpdate = await prisma.players.update(req.body, id);
    res.status(200).send('update successful: ',userUpdate);
  }
  catch(err){
    next('update error occurred');
  }
});


app.delete('/users/:id', async (req, res, next) => {
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
