import { Router } from 'express';
import { getAllCategories, initDefaultCategories } from '../db/typeorm/logic';

const categories = Router();

categories.get('/', async (req, res, next) => {
  try {
    res.json(await getAllCategories());
  } catch (e) {
    next(e);
  }
});

categories.post('/init', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      res.sendStatus(403);
      return;
    }

    await initDefaultCategories();

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default categories;
