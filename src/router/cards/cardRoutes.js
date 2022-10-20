'use strict';

require('dotenv').config();

const express = require('express');

const cardRouter = express.Router();
// USE MIDDLEWARE IN ALL ROUTES

// const bearerAuth = require('../../auth/middleware/bearer');

const { 
  getOneCardById, 
  getCardsByFilter,
} = require('../../database-logic/get-card-functions');


  cardRouter.get('/cards/:id', async (req, res, next) => {
    try {
      const card = await getOneCardById(req.params.id)
      res.status(200).send(card)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
});



cardRouter.get('/cards', async (req, res, next) => {
  try {
    const cards = await getCardsByFilter(req.query)
    res.status(200).send(cards)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
})


module.exports = cardRouter;
