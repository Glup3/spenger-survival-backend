import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import { Op, fn, col, where } from 'sequelize';

import { Tip } from './sequelize';
import { generateTips } from './util/dataGenerator';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const v1Prefix = '/api/v1';

const paginate = (query, { page, perPage }) => {
  const offset = page * perPage;
  const limit = perPage;

  return {
    ...query,
    limit,
    offset
  };
};

app.get(v1Prefix + '/tips', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 15;
  const searchTerm = req.query.q || '';

  Tip.findAndCountAll(
    paginate(
      {
        attributes: ['id', 'author', 'title', 'description', 'gender', 'schoolClass', 'department', 'issueDate', 'verified'],
        where: {
          [Op.or]: [
            where(fn('lower', col('author')), { [Op.like]: '%' + searchTerm.toLowerCase() + '%' }),
            where(fn('lower', col('title')), { [Op.like]: '%' + searchTerm.toLowerCase() + '%' }),
            where(fn('lower', col('description')), { [Op.like]: '%' + searchTerm.toLowerCase() + '%' }),
            where(fn('lower', col('schoolClass')), { [Op.like]: '%' + searchTerm.toLowerCase() + '%' }),
            where(fn('lower', col('department')), { [Op.like]: '%' + searchTerm.toLowerCase() + '%' })
          ]
        },
        order: [['issueDate', 'DESC']]
      },
      {
        page,
        perPage
      }
    )
  ).then(tips => res.json(tips));
});

app.post(v1Prefix + '/tips', (req, res) => {
  const captchaToken = req.body.captcha;
  const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.GOOGLE_RECAPTCHA_SECRET + '&response=' + captchaToken;

  axios
    .post(verificationURL)
    .then(response => {
      console.log(response.data);

      if (response.data.success !== undefined && !response.data.success) {
        return res.json({ responseCode: 400, responseDesc: 'Failed captcha verification' });
      }

      Tip.create({
        author: req.body.author || 'Anonym',
        title: req.body.title,
        description: req.body.description,
        schoolClass: req.body.schoolClass || 'Unbekannt',
        department: req.body.department || 'Abteilungslos',
        gender: req.body.gender,
        issueDate: new Date(),
        verified: false
      }).then(tip => res.json({ responseCode: 200, tip: tip }));
    })
    .catch(error => {
      console.log(error);
    });
});

app.get(v1Prefix + '/tips/:id', (req, res) => {
  Tip.findOne({
    where: {
      id: req.params.id
    }
  }).then(tip => res.json(tip));
});

app.post(v1Prefix + '/init-defaults', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    res.json('DEVELOPMENT only');
    return;
  }

  Tip.destroy({
    where: {},
    truncate: true
  }).then(() => {
    Tip.bulkCreate(generateTips(req.body.tips || 20));
  });

  res.json('Success');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
