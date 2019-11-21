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
    gender: {
      type: type.CHAR(1),
      allowNull: true
    },
    schoolClass: {
      type: type.STRING,
      allowNull: true,
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
  });
};
