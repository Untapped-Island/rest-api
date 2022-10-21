'use strict';

const express = require('express');

require('dotenv').config();

const userRouter = express.Router();
// middle
const bearerAuth = require('../../auth/middleware/bearer');

const { prisma } = require('.prisma/client');


userRouter.get('/users', bearerAuth, async (req, res, next) => {

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
// userRouter.put('/users/:username', bearerAuth, async (req, res, next) => {
//   try{
//     let { id } = req.params;
//     let userUpdate = await prisma.players.update(req.body, id);
//     res.status(200).send('update successful: ', userUpdate);
//   }
//   catch(err){
//     next('update error occurred');
//   }
// });

// // bearer auth implemented, check users by conditional
// userRouter.delete('/users/:username', bearerAuth, async (req, res, next) => {
//   try{

//     const { id } = req.params;
//     const post = await prisma.player.delete({
//       where: {
//         id: id,
//       },
//     });
//     res.status(200).send('user deleted')
//   }
//   catch(err){
//     next('Delete error occurred')
//   }
// });

module.exports = userRouter;
