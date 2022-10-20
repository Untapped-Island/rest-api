'use strict';

require('dotenv').config();

const express = require('express');

// CUSTOM MIDDLEWARE
const authSigning = require('./router/authCreate/index');
const authCards = require('./router/cards/cardRoutes');
const authUser = require('./router/users/userRoutes');
const serverError = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// DATABASE FUNCTIONS

// INSTANTIATE EXPRESS AND CORS
const app = express();
const cors = require('cors');

// USE MIDDLEWARE IN ALL ROUTES
app.use(cors());
app.use(express.json());


// const PORT = process.env || 3002


// signup/signin route from router->authCreate
app.use(authSigning);
// cards route from router->cards
app.use(authCards)
// routes to user from router->userRoutes:
app.use(authUser);
// Catch all routes
app.use(serverError);
app.use(notFound);

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

