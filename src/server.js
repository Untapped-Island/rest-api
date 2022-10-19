'use strict';

require('dotenv').config();

const express = require('express');

// CUSTOM MIDDLEWARE
const bearerAuth = require('./auth/middleware/bearer');
const basicAuth = require('./auth/middleware/basic')
const { users } = require('./auth/models/usersSchema');
const serverError = require('./error-handlers/500.js')
const notFound = require('./error-handlers/404.js')

// DATABASE FUNCTIONS
const { getOneCardById, 
  getOneCardByName, 
  getCardsBySearchQuery
} = require('./database-logic/get-card-functions')

// INSTANTIATE EXPRESS AND CORS
const app = express();
const cors = require('cors');

// USE MIDDLEWARE IN ALL ROUTES
app.use(cors());
app.use(express.json());

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

/**
 * SEPARATE THIS LATER TO A NEW MODULE. REST API LOGIC.
 */

app.get('/card/:id', async (req, res, next) => {
  try {
    const card = await getOneCardById(req.params.id)
    res.status(200).send(card)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
})

app.get('/card', async (req, res, next) => {
  try {
    // /card?name=Jim&color=red
    const query = req.query;
    let searchObject = Object.keys(query).map(key => {
      let searchParam = {}
      searchParam[key] = query[key]
      return searchParam
    })
    if (query.search) {
      console.log(query.search)
      const cards = await getCardsBySearchQuery(query.search)
      res.status(200).send(cards)
    }
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
})

// const result = await prisma.card.findMany({
//   where: {
//     AND: [
//       {
//         name: {
//           search: 'swamp',
//         },
//       },
//       {
//         fullType: {
//           contains: 'Basic Land',
//         },
//       },
//     ],
//   },
// })
// console.log(result)
// }

module.exports = {
 start:(PORT) => app.listen(PORT, '127.0.0.1', console.log('Server has started on: ', PORT))
 
}
// // User access Routes
// app.use(authRouter);

