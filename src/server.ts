import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from 'strong-error-handler';

import tips from './routes/tips';
import groups from './routes/group';
import persons from './routes/person';

const server = express();

server.use(bodyParser.json());
server.use(cors());
server.use(
  errorHandler({
    debug: process.env.NODE_ENV !== 'prod',
    log: true,
  })
);

const v1Prefix = '/api/v1';

server.use(`${v1Prefix}/tips`, tips);
server.use(`${v1Prefix}/groups`, groups);
server.use(`${v1Prefix}/persons`, persons);

export default server;
