import { Router } from 'express';

import Group from '../db/models/Group.model';
import Person from '../db/models/Person.model';

const groups = Router();

groups.get('/', async (req, res, next) => {
  try {
    res.json(
      await Group.findAll({
        attributes: ['id', 'name'],
      })
    );
  } catch (e) {
    next(e);
  }
});

groups.post('/default', async (req, res, next) => {
  try {
    await Person.update(
      {
        groupId: null,
      },
      { where: {} }
    );

    await Group.destroy({ where: {} });

    await Group.bulkCreate([
      {
        id: 1,
        name: 'Entwickler',
      },
      {
        id: 2,
        name: 'Helper',
      },
    ]);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default groups;
