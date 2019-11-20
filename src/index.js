import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { Tip } from './sequelize';
import { generateTips } from './util/dataGenerator';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const v1Prefix = '/api/v1';

app.get(v1Prefix + '/tips', (req, res) => {
  Tip.findAll().then(tips => res.json(tips));
});

app.post(v1Prefix + '/tips', (req, res) => {
  Tip.create(req.body).then(tip => res.json(tip));
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
    Tip.bulkCreate(
      generateTips(req.body.tips || 20)
    );
  });

  res.json('Success');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
