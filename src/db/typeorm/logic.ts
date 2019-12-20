import { getRepository, Brackets } from 'typeorm';

import Tip from './models/Tip.model';
import Todo from './models/Todo.model';
import { generateTips } from '../../util/dataGenerator';
import Category from './models/Category.model';

interface SearchTipsPaginatedArgs {
  page: number;
  perPage: number;
  orderBy: 'ASC' | 'DESC';
  searchTerm: string;
  verified: string;
  department: string;
  gender: string;
  category: string;
  schoolClass: string;
}

export const searchTipsPaginated = async ({
  page,
  perPage,
  orderBy,
  // searchTerm,
  verified,
  department,
  gender,
  category,
  schoolClass,
}: SearchTipsPaginatedArgs) => {
  const tipRepository = getRepository(Tip);
  const verifiedExpression = verified != null ? 'verified = :v' : 'verified is not :v';
  const categoryExpression = category != null ? 'categoryId = :c' : '1=1';

  let departmentExpression = 'department is null';
  let genderExpression = 'gender is null';
  let schoolClassExpression = 'schoolClass is null';

  if (department != null) {
    departmentExpression = department === '' ? '1=1' : 'department = :d';
  }

  if (gender != null) {
    genderExpression = gender === '' ? '1=1' : 'gender = :g';
  }

  if (schoolClass != null) {
    schoolClassExpression = schoolClass === '' ? '1=1' : 'schoolClass = :s';
  }

  // const q = `%${searchTerm.toLowerCase()}%`;

  const query = tipRepository
    .createQueryBuilder()
    // .where(
    //   new Brackets(qb => {
    //     qb.where('author like :q', { q });
    //     //     .orWhere('title like :q', { q })
    //     //     .orWhere('description like :q', { q })
    //     //     .orWhere('schoolClass like :q', { q });
    //   })
    // )
    // .where('author like :q', { q })
    // .orWhere('title like :q', { q })
    .where(categoryExpression, { c: category })
    .andWhere(departmentExpression, { d: department })
    .andWhere(genderExpression, { g: gender })
    .andWhere(verifiedExpression, { v: verified })
    .andWhere(schoolClassExpression, { s: schoolClass })
    .orderBy('issueDate', orderBy)
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

export const getAllCategories = async (): Promise<Category[]> => {
  const categoryRepository = getRepository(Category);

  return categoryRepository
    .createQueryBuilder()
    .orderBy('name', 'ASC')
    .getMany();
};

export const initDefaultCategories = async () => {
  const categoryRepository = getRepository(Category);
  await categoryRepository
    .createQueryBuilder()
    .delete()
    .execute();

  await categoryRepository.insert([
    { name: 'Lerntipps', description: 'Tipps zum Lernen', color: '#00FFAA' },
    { name: 'Essen', description: 'Food', color: '#44FF33' },
    { name: 'Schummeln', description: 'Hehe xd', color: '#55CCBB' },
    { name: 'Sonstiges', description: 'Alles andere', color: '#1111AA' },
  ]);
};

export const getAllSchoolClasses = async () => {
  const tipRepository = getRepository(Tip);

  return tipRepository
    .createQueryBuilder()
    .select('schoolClass')
    .groupBy('schoolClass')
    .orderBy('schoolClass', 'ASC')
    .execute();
};
