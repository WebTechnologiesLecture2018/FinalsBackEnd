const express = require('express');
//const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');

const db = require('./db');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'default' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('login');
});
// Route to get questions
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions', { type: Sequelize.QueryTypes.SELECT })
    .then(questions => {
      res.render('index', { questions      });
    })
});

// Route to save response

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server started @ http://localhost:' + port);
});
