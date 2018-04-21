const db = require('../db');
const DataTypes = require('sequelize/lib/data-types');

module.exports = db.define(
  'questions',
  {
    quiz_code: Sequelize.CHAR(1),
    id: { type: Sequelize.INTEGER, primaryKey: true },
    content: Sequelize.TEXT
  },
  { timestamps: false }
);

