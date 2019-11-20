export default (sequelize, type) => {
  return sequelize.define('tip', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: type.STRING,
      allowNull: true
    },
    title: {
      type: type.STRING,
      allowNull: false,
    },
    description: {
      type: type.STRING(1024),
      allowNull: false,
    },
    schoolClass: {
      type: type.STRING,
      allowNull: true,
    },
    //vintage == Schuljahr
    vintage: {
      type: type.INTEGER,
      allowNull: false
    },
    department: {
      type: type.STRING,
      allowNull: true
    },
    issueDate: {
      type: type.DATE,
      allowNull: false
    },
    verified: {
      type: type.BOOLEAN,
      allowNull: false
    },
    gender: {
      type: type.CHAR(1),
      allowNull: true
    }
  });
};
