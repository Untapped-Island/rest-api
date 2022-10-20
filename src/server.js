'use strict';

require('dotenv').config();

const express = require('express');

// CUSTOM MIDDLEWARE
const bearerAuth = require('./auth/middleware/bearer');
const {basicAuth} = require('./auth/middleware/basic');
const authUser = require('./users/userRoutes')
const serverError = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// DATABASE FUNCTIONS
const { getOneCardById, 
  getOneCardByName, 
  getCardsBySearchQuery
} = require('./database-logic/get-card-functions');

const { addCardToProfileById } = require('./database-logic/user-functions')

const prisma = require('./database-logic/prisma-client.js');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.js');

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
  res.status(200).send(`User Build.`);
})

app.get('/users', bearerAuth, async (req, res, next) => {
  let user = await userModel.findAll();
  let payload = {
    results: user,
  };
  res.status(200).send(payload);
});


app.post('/signup', async (req, res, next) => {
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
      addCardToProfileById("12cc97ec-5d03-4434-a31b-51e77d208466", user.name) //inquirer ---
      addCardToProfileById("04aa210a-235f-4e07-87d1-0d28cdf6888b", user.name)
      console.log(`User ${user.name} created successfully`);
      res.status(200).send({
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
app.post('/signin', basicAuth, (req, res, next) => {
  try {

    res.status(200).send({
      user: req.user,
      accessToken: req.accessToken
    });
  }
  catch(err){
    next('signin error occurred');
  }
});

// user PUT, GET, and DELETE routes:

app.use(authUser);

/**
 * SEPARATE THIS LATER TO A NEW MODULE. REST API LOGIC.
 */

app.get('/cards/:id', async (req, res, next) => {
  try {
    const card = await getOneCardById(req.params.id)
    res.status(200).send(card)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
});



app.get('/cards', async (req, res, next) => {
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

app.get('/users/:username', bearerAuth, async (req, res, next) => {
  // const foundUser = await getUserByUsername(req.params.username) // TODO - Write this function...
  const foundUser = await prisma.player.findUnique({
    where: {
      name: req.params.username
    }
  })
  if (foundUser) {
    if (req.user.payload === foundUser.name) {
      console.log('Hey, this is you')
    } else {
      console.log(`Found user ${foundUser.name}. Is this your friend?`)
    }
    res.status(200).send(foundUser.name)
  } else {
    next(`User ${req.params.username} not found.`)
  }

}) 

app.get('/jwtProtect', bearerAuth, async (req, res, next) => {
  res.status(200).send(req.user.payload)
})


// admin function



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

