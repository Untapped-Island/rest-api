'use strict';

const {Sequelize, DataTypes} = require('sequelize'); 
const databaseUrl = 'sqlite::memory:'
const database = new Sequelize(databaseUrl);

const jwt = require('jsonwebtoken');

const userModel = (sequelizeDatabase, DataTypes) => {
  const model = sequelizeDatabase.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get(){
        return jwt.sign({username: this.username}, process.env.API_SECRET, {expiresIn: '15m'});
      },
      set(){
        return jwt.sign({username: this.usernmame}, process.env.API_SECRET, {expiresIn: '15m'});
      },
    },
  });
  return model;
};

const userTable = userModel(database, DataTypes);
// userModel.authenticateBearer = async (token) => {
  //   try {
//     let payload = jwt.verify(token, process.env.API_SECRET);

//     const user = await this.findOne({ where: { username: payload.username } });
//     if (user) {
//       return user;
//     }
//   }
//   catch (e) {
//     console.error(e);
//     return e;
//   }
// };


module.exports = { users: userTable};
