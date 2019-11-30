import { Router } from 'express';
import axios from 'axios';

import { searchTipsPaginated, addTip, initDefaultTips } from '../db/typeorm/logic';
import { reportTip } from '../core/slack';

const tips = Router();

tips.get('/', async (req, res, next) => {
  try {
    const page: number = parseInt(req.query.page, 10) || 0;
    const perPage: number = parseInt(req.query.perPage, 10) || 15;
    const searchTerm: string = req.query.q || '';
    const verified: string = req.query.verified || null;

    res.json(await searchTipsPaginated(page, perPage, searchTerm, verified));
  } catch (e) {
    next(e);
  }
});

tips.post('/', async (req, res, next) => {
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

    initDefaultTips(req.body.tips);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default tips;
