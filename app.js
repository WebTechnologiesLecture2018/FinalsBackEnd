const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'default' }));
app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/coursewebsite', (req, res) => {
  res.render('coursewebsite');
})
// Route to get questions
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions JOIN options ON id == question_id ORDER BY id ASC, code ASC', {type: Sequelize.QueryTypes.SELECT})
    .then(questions => {
      var questionArr = [];
      for(var i = 0; i < questions.length; i+=3) {
        questionArr.push({
          "id": questions[i].id,
          "content": questions[i].content,
          "options": {
            "option1": {
              "code": questions[i].code,
              "option": questions[i].option
            },
            "option2": {
              "code": questions[i+1].code,
              "option": questions[i+1].option
            },
            "option3": {
              "code": questions[i+2].code,
              "option": questions[i+2].option
            }
          }
        });
      }
      res.render('questions', { questionArr });
    });
});

app.get('/sample', (req, res) => {
  res.render('sample');
});

app.get('/greetme', (req, res) => {
  var sample = req.query.username;
  res.render('greatme', {sample} );
});



// Route to save response

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server started @ http://localhost:' + port);
});
