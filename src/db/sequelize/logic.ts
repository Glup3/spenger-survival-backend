import { Op, where, fn, col } from 'sequelize';

import Tip from './models/Tip.model';
import { generateTips } from '../../util/dataGenerator';

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

export const searchTipsPaginated = async (page: number, perPage: number, searchTerm: string) => {
  return Tip.findAndCountAll(
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
  );
};

export const addTip = async (
  title: string,
  description: string,
  gender: string,
  author?: string,
  schoolClass?: string,
  department?: string
) => {
  await Tip.create({
    author: author || 'Anonym',
    title,
    description,
    schoolClass: schoolClass || 'Unbekannt',
    department: department || 'Abteilungslos',
    gender,
    issueDate: new Date(),
    verified: false,
  });
};

export const initDefaultTips = async (amount: number) => {
  await Tip.destroy({
    where: {},
    truncate: true,
  });
  await Tip.bulkCreate(generateTips(amount || 20));
};
