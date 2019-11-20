import express from 'express';
import bodyParser from 'body-parser';
import { Tip } from './sequelize';

const app = express();
app.use(bodyParser.json());

const v1Prefix = '/api/v1';

app.get(v1Prefix + '/tips', (req, res) => {
  Tip.findAll().then(tips => res.json(tips));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
