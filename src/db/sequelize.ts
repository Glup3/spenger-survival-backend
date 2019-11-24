import { Sequelize } from 'sequelize-typescript';
import Tip from './models/Tip.model';

const path = `${__dirname}/../../.env.${process.env.NODE_ENV}`;
require('dotenv').config({ path });

const sequelize = new Sequelize({
  host: process.env.HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dialect: 'mysql',
  logging: false,
});

sequelize.addModels([Tip]);

export default sequelize;
