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
  author: string;
}

export const searchTipsPaginated = async ({
  page,
  perPage,
  orderBy,
  searchTerm,
  verified,
  department,
  gender,
  category,
  schoolClass,
  author,
}: SearchTipsPaginatedArgs) => {
  const tipRepository = getRepository(Tip);
  const q = `%${searchTerm.toLowerCase()}%`;
  const verifiedExpression = verified != null ? 'verified = :v' : 'verified is not :v';

  let departmentExpression = 'department is null';
  let genderExpression = 'gender is null';
  let schoolClassExpression = 'schoolClass is null';
  let authorExpression = 'author is null';
  let categoryExpression = 'categoryId is null';

  if (department != null) {
    departmentExpression = department === '' ? '1=1' : 'department = :d';
  }

  if (gender != null) {
    genderExpression = gender === '' ? '1=1' : 'gender = :g';
  }

  if (schoolClass != null) {
    schoolClassExpression = schoolClass === '' ? '1=1' : 'schoolClass = :s';
  }

  if (author != null) {
    authorExpression = author === '' ? '1=1' : 'author = :a';
  }

  if (category != null) {
    categoryExpression = category === '' ? '1=1' : 'categoryId = :c';
  }

  const query = tipRepository
    .createQueryBuilder('tip')
    .leftJoinAndSelect('tip.category', 'category')
    .where(categoryExpression, { c: category })
    .andWhere(
      new Brackets(qb => {
        qb.where('title like :q', { q }).orWhere('tip.description like :q', { q });
      })
    )
    .andWhere(authorExpression, { a: author })
    .andWhere(departmentExpression, { d: department })
    .andWhere(genderExpression, { g: gender })
    .andWhere(verifiedExpression, { v: verified })
    .andWhere(schoolClassExpression, { s: schoolClass })
    .orderBy('tip.issueDate', orderBy)
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
  author: string,
  schoolClass: string,
  department: string,
  category: string
) => {
  const tipRepository = getRepository(Tip);

  await tipRepository
    .createQueryBuilder()
    .insert()
    .values({
      author,
      title,
      description,
      schoolClass,
      department,
      gender,
      issueDate: new Date(),
      verified: false,
      category: () => category,
    })
    .execute();
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

export const getAllAuthors = async () => {
  const tipRepository = getRepository(Tip);

  return tipRepository
    .createQueryBuilder()
    .select('author')
    .groupBy('author')
    .orderBy('author', 'ASC')
    .execute();
};
