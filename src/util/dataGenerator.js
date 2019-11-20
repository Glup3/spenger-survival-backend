const generateAuthor = () => {
  const authors = [null, 'Glup3', 'Max', 'Melanie X', 'Max Mustermann', 'Ukalto'];

  return authors[Math.floor(Math.random() * authors.length)];
};

const generateSchoolClass = () => {
  const classes = [null, '5CHIF', '1FHIF', '3EHIF', '2AHMNG', '3BHWIT'];

  return classes[Math.floor(Math.random() * classes.length)];
};

const generateDepartment = () => {
  const departments = [null, 'Informatik', 'Kunst und Design', 'Gamedesign', 'Biomedizin', 'Wirtschaft'];

  return departments[Math.floor(Math.random() * departments.length)];
}

const generateGender = () => {
  const genders = [null, 'm', 'w', '+'];
  
  return genders[Math.floor(Math.random() * genders.length)];
}

const randomBool = () => Math.random() > 0.5 ? true : false;

const generateWord = length => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const generateText = words => {
  let result = '';

  for (let i = 0; i < words; i++) {
    result += generateWord(Math.floor(Math.random() * 15)) + ' ';
  }

  return result;
};

const generateDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};



export const generateTip = (wordsTitle, wordsDescription) => {
  const date = generateDate(new Date(2011, 1, 1), new Date());

  return {
    author: generateAuthor(),
    title: generateText(wordsTitle),
    description: generateText(wordsDescription),
    schoolClass: generateSchoolClass(),
    vintage: date.getFullYear(),
    department: generateDepartment(),
    issueDate: date,
    verified: randomBool(),
    gender: generateGender()
  };
}

export const generateTips = (tips) => {
  const result = [];

  for (let i = 0; i < tips; i++) {
    result.push(generateTip(Math.floor(Math.random() * 7), Math.floor(Math.random() * 50)));
  }

  return result;
}