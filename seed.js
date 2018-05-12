const db = require('./db');
const Sequelize = require('sequelize');

/**
db.authenticate()
  .then(() => console.log('Connected'))
  .then(() => {
    db.query("SELECT * FROM `users`", { type: db.QueryTypes.SELECT})
      .then(users => {
      })
  });
**/

// Create users table
const createUsersSql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name text NOT NULL,
  username text NOT NULL
)
`;

const createQuestionSql = `
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY,
  quiz_code CHAR(1) NOT NULL,
  content text NOT NULL
)
`;

const createOptionsSql = `
CREATE TABLE IF NOT EXISTS options (
  option_id INTEGER PRIMARY KEY,
  question_id INT NOT NULL,
  code CHAR(1) NOT NULL,
  option TEXT NOT NULL,
  is_correct TINYINT
)
`;

const createResponsesSql = `
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY,
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  code CHAR(1) NOT NULL
)
`;

/**
function insertQuestions() {
  const q1 = `INSERT INTO questions (quiz_code, content) VALUES ('1', 'This is question 1');`
  const q1Options = id => `
    INSERT INTO options(question_id, code, content, is_correct)
    VALUES
      (${id}, 'A', 'This is A', 0),
      (${id}, 'B', 'This is B', 1),
      (${id}, 'C', 'This is C', 0)
    ;
  `;

  const q2 = `INSERT INTO questions (quiz_code, content) VALUES (1, 'This is question 2');`
  const q2Options = id => `
    INSERT INTO options(question_id, code, content, is_correct)
    VALUES
      (LAST_INSERT_ROWID(), 'A', 'This is A', 0),
      (LAST_INSERT_ROWID(), 'B', 'This is B', 1),
      (LAST_INSERT_ROWID(), 'C', 'This is C', 0)
    ;
  `;

  return Promise.all([
    db.query(q1, { type: Sequelize.QueryTypes.INSERT }).then(([id]) => db.query(q1Options(id))),
    db.query(q2, { type: Sequelize.QueryTypes.INSERT }).then(([id]) => db.query(q2Options(id)))
  ]);
}
**/

async function insertQuestions () {
  const q1 = `INSERT INTO questions (quiz_code, content) VALUES ('4', "An element of JSP where it contains any number of JAVA language
	statements, variable or method declarations, or expressions that are
	valid in the page scripting language.
");`
  const q1Options = id => `
    INSERT INTO options(question_id, code, option, is_correct)
    VALUES
      (${id}, 'A', 'Servlet
', 0),
      (${id}, 'B', 'Scriptlet
', 1),
      (${id}, 'C', 'Nodelet
', 0)
    ;
  `;

  const [q1Id] = await db.query(q1, { type: Sequelize.QueryTypes.INSERT })

  return Promise.all([
    db.query(q1Options(q1Id))
  ])
}

const print = e => console.log(e)


db.authenticate()
  .then(() => console.log('Connected'))
  .then(() => Promise.all([
    db.query(createQuestionSql),
    db.query(createOptionsSql)
  ]))
  .then(() => insertQuestions())
;
