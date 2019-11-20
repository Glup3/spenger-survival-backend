import Sequelize from 'sequelize';
import TipModel from './models/Tip';
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'mysql',
});

const Tip = TipModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log('Database & tables created.');
  });

export { Tip }