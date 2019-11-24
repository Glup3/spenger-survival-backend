import { getRepository } from 'typeorm';

import Tip from './models/Tip.model';
import { generateTips } from '../../util/dataGenerator';

export const searchTipsPaginated = async (page: number, perPage: number, searchTerm: string) => {
  const q = `%${searchTerm.toLowerCase()}%`;
  const tipRepository = getRepository(Tip);

  const result = await tipRepository
    .createQueryBuilder()
    .where('author like :q', { q })
    .orWhere('title like :q', { q })
    .orWhere('description like :q', { q })
    .orWhere('schoolClass like :q', { q })
    .orWhere('department like :q', { q })
    .orderBy('issueDate', 'DESC')
    .skip(page * perPage)
    .take(perPage)
    .getManyAndCount();

  return {
    rows: result[0],
    count: result[1],
  };
};

export const addTip = async (
  title: string,
  description: string,
  gender: string,
  author?: string,
  schoolClass?: string,
  department?: string
) => {
  const tipRepository = getRepository(Tip);

  await tipRepository.insert({
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
  const tipRepository = getRepository(Tip);

  await tipRepository
    .createQueryBuilder()
    .delete()
    .execute();
  await tipRepository.insert(generateTips(amount || 20));
};
