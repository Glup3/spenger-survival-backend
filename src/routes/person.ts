import { Router } from 'express';

import Person from '../db/models/Person.model';
import Group from '../db/models/Group.model';

const persons = Router();

persons.get('/', async (req, res, next) => {
  try {
    res.json(
      await Person.findAll({
        include: [Group],
        where: { groupId: parseInt(req.body.groupId, 10) || null },
      })
    );
  } catch (e) {
    next(e);
  }
});

persons.post('/test', async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== 'dev') {
      res.sendStatus(403);
      return;
    }

    await Person.destroy({ where: {} });

    await Person.bulkCreate([
      {
        id: 1,
        name: 'Glup3',
        title: 'Owner & Admin',
        email: 'glup3.tran@gmail.com',
        groupId: 1,
      },
      {
        id: 2,
        name: 'Glup5',
        title: 'Admin',
        email: 'glup5.tran@gmail.com',
        groupId: 1,
      },
      {
        id: 3,
        name: 'Ukalto',
        title: 'Dataprotection Specialist',
        email: 'ukalto@gmail.com',
        groupId: 2,
      },
      {
        id: 4,
        name: 'Dave',
        title: 'UX Expert',
        email: 'dave@gmail.com',
        groupId: 2,
      },
      {
        id: 5,
        name: 'Lena',
        title: 'Marketing Queen',
        email: 'lena@gmail.com',
        groupId: 2,
      },
    ]);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default persons;
