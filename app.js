const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Sequelize = require('sequelize');
const db = require('./db');

const $ = require('jquery');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'default' }));
app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/coursewebsite', (req, res) => {
  res.render('coursewebsite');
})
// Route to get questions
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions', { type: Sequelize.QueryTypes.SELECT })
    .then(questions => {
      db.query('SELECT * FROM options', { type: Sequelize.QueryTypes.SELECT })
      .then(options => {
        res.render('index', { questions, options });
      })
    })
});

app.get('/test', (req, res) => {
  db.query('SELECT * FROM questions JOIN options ON id == question_id ORDER BY id ASC, code ASC', {type: Sequelize.QueryTypes.SELECT})
    .then(questions => {
      res.render('test', { questions });
    })
})



// Route to save response

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server started @ http://localhost:' + port);
});
