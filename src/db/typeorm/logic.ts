import { getRepository, Brackets } from 'typeorm';

import Tip from './models/Tip.model';
import Todo from './models/Todo.model';
import { generateTips } from '../../util/dataGenerator';

export const searchTipsPaginated = async (page: number, perPage: number, searchTerm: string, verified: string) => {
  const tipRepository = getRepository(Tip);
  const verifiedExpression = verified != null ? 'verified = :verified' : 'verified is not :verified';
  const q = `%${searchTerm.toLowerCase()}%`;

  const query = tipRepository
    .createQueryBuilder()
    .where(
      new Brackets(qb => {
        qb.where('author like :q', { q })
          .orWhere('title like :q', { q })
          .orWhere('description like :q', { q })
          .orWhere('schoolClass like :q', { q })
          .orWhere('department like :q', { q });
      })
    )
    .andWhere(verifiedExpression, { verified })
    .orderBy('issueDate', 'DESC')
    .skip(page * perPage)
    .take(perPage);

  const result = await query.getManyAndCount();

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

export const getAllTodos = async (): Promise<Todo[]> => {
  const todoRepository = getRepository(Todo);

  return todoRepository
    .createQueryBuilder()
    .orderBy('done')
    .addOrderBy('createdAt', 'DESC')
    .getMany();
};

export const initDefaultTodos = async () => {
  const todoRepository = getRepository(Todo);
  await todoRepository
    .createQueryBuilder()
    .delete()
    .execute();

  await todoRepository.insert([
    { title: 'Kategorien einbauen' },
    { title: 'Suche entfernen' },
    { title: 'TODO page' },
    { title: 'Datum fixen' },
    { title: 'Infinite Scrolling fixen' },
  ]);
};
