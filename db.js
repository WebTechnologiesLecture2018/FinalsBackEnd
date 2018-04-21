const Sequelize = require('sequelize');

const sequelize = new Sequelize('course_website', null, null, {
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: './course-website.sqlite'
});

module.exports = sequelize;
