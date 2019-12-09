import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from 'strong-error-handler';

import tips from './routes/tips';
import feedbacks from './routes/feedbacks';
import todos from './routes/todos';

const server = express();

server.set('x-powered-by', false);
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
server.use(`${v1Prefix}/feedbacks`, feedbacks);
server.use(`${v1Prefix}/todos`, todos);

export default server;
