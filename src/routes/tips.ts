import { Router } from 'express';
import axios from 'axios';

import { searchTipsPaginated, addTip, initDefaultTips } from '../db/typeorm/logic';
import { reportTip } from '../core/slack';

const tips = Router();

tips.post('/', async (req, res, next) => {
  try {
    const { page, perPage, searchTerm, verified, department, gender, category } = req.body;

    res.json(
      await searchTipsPaginated({
        page,
        perPage,
        searchTerm: searchTerm || '',
        verified,
        department,
        gender,
        category: category ? parseInt(category, 10) : null,
      })
    );
  } catch (e) {
    next(e);
  }
});

tips.post('/add', async (req, res, next) => {
  try {
    const { author, title, description, schoolClass, department, gender, captcha } = req.body;

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${captcha}`;

    const response = await axios.post(verificationURL);

    if (response.data.success !== undefined && !response.data.success) {
      res.sendStatus(444);
      return;
    }

    await addTip(title, description, gender, author, schoolClass, department);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

tips.post('/report', async (req, res, next) => {
  try {
    reportTip(req.body.title, req.body.id, req.body.message);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

tips.post('/init', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      res.sendStatus(403);
      return;
    }

    initDefaultTips(req.body.amount);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default tips;
