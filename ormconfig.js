const path = `${__dirname}/../../.env.${process.env.NODE_ENV}`;
require('dotenv').config({ path });

module.exports = {
  type: 'mysql',
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/db/typeorm/models/**/*.ts'],
  migrations: ['src/db/typeorm/migrations/**/*.ts'],
  subscribers: ['src/db/typeorm/subscribers/**/*.ts'],
};
