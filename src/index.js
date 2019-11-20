import express from 'express';
import bodyParser from 'body-parser';
import { Tip } from './sequelize';

const app = express();
app.use(bodyParser.json());

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
    Tip.bulkCreate([
      {
        author: 'Glup3',
        title: 'Tipp Numero Uno',
        description: 'hier kommt einfach irgendein geiler text rein',
        schoolClass: '5CHIF',
        vintage: 2019,
        department: 'Informatik',
        issueDate: new Date(),
        verified: true,
        gender: 'm'
      },
      {
        author: null,
        title: 'Treppen',
        description: 'Immer eine Stufe überspringen - spart Kraft',
        schoolClass: '5CHIF',
        vintage: 2019,
        department: 'Informatik',
        issueDate: new Date(),
        verified: false,
        gender: 'w'
      },
      {
        author: null,
        title: 'Anonym',
        description: 'Ein Secret',
        schoolClass: null,
        vintage: 2019,
        department: null,
        issueDate: new Date(),
        verified: true,
        gender: 'm'
      },
      {
        author: 'Max',
        title: 'DSGVO',
        description: 'Jeder muss es machen, macht keinen Spaß',
        schoolClass: '5CHIF',
        vintage: 2019,
        department: 'Biomedizin',
        issueDate: new Date(),
        verified: false,
        gender: null
      }
    ]);
  });

  res.json('Success');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
