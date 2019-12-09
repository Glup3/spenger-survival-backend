import { Router } from 'express';
import { getAllTodos, initDefaultTodos } from '../db/typeorm/logic';

const todos = Router();

todos.get('/', async (req, res, next) => {
  try {
    res.json(await getAllTodos());
  } catch (e) {
    next(e);
  }
});

todos.post('/init', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      res.sendStatus(403);
      return;
    }

    await initDefaultTodos();

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default todos;
