import { Router } from 'express';
import axios from 'axios';
import { Op, where, fn, col } from 'sequelize';

import Tip from '../db/models/Tip.model';
import { generateTips } from '../util/dataGenerator';

const tips = Router();

interface PaginateOptions {
  page: number;
  perPage: number;
}

const paginate = (query: any, { page, perPage }: PaginateOptions) => {
  const offset = page * perPage;
  const limit = perPage;

  return {
    ...query,
    limit,
    offset,
  };
};

tips.get('/', async (req, res, next) => {
  try {
    const page: number = parseInt(req.query.page, 10) || 0;
    const perPage: number = parseInt(req.query.perPage, 10) || 15;
    const searchTerm: string = req.query.q || '';

    res.json(
      await Tip.findAndCountAll(
        paginate(
          {
            attributes: [
              'id',
              'author',
              'title',
              'description',
              'gender',
              'schoolClass',
              'department',
              'issueDate',
              'verified',
            ],
            where: {
              [Op.or]: [
                where(fn('lower', col('author')), { [Op.like]: `%${searchTerm.toLowerCase()}%` }),
                where(fn('lower', col('title')), { [Op.like]: `%${searchTerm.toLowerCase()}%` }),
                where(fn('lower', col('description')), { [Op.like]: `%${searchTerm.toLowerCase()}%` }),
                where(fn('lower', col('schoolClass')), { [Op.like]: `%${searchTerm.toLowerCase()}%` }),
                where(fn('lower', col('department')), { [Op.like]: `%${searchTerm.toLowerCase()}%` }),
              ],
            },
            order: [['issueDate', 'DESC']],
          },
          {
            page,
            perPage,
          }
        )
      )
    );
  } catch (e) {
    next(e);
  }
});

tips.post('/', async (req, res, next) => {
  try {
    const captchaToken = req.body.captcha;
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET}&response=${captchaToken}`;

    const response = await axios.post(verificationURL);

    if (response.data.success !== undefined && !response.data.success) {
      res.sendStatus(400);
      return;
    }

    await Tip.create({
      author: req.body.author || 'Anonym',
      title: req.body.title,
      description: req.body.description,
      schoolClass: req.body.schoolClass || 'Unbekannt',
      department: req.body.department || 'Abteilungslos',
      gender: req.body.gender,
      issueDate: new Date(),
      verified: false,
    });

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

    await Tip.destroy({
      where: {},
      truncate: true,
    });

    await Tip.bulkCreate(generateTips(req.body.tips || 20));

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default tips;
