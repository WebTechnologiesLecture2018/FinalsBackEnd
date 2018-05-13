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
app.use(session({ secret: 'webtechLEC', resave: false, saveUninitialized: false }));

app.get('/', (req, res) => {
  let user = req.session.user;
  res.render('index');
});

app.post('/login', (req, res) => {
  if(req.body.user) {
    req.session.user = req.body.user;
  }
  res.redirect('/coursewebsite');
})

app.get('/about', (req, res) => {
  if(req.session.user) {
    res.render('about');
  } else {
    res.redirect('/');
  }
});
app.get('/jsp', (req, res) => {
  if(req.session.user) {
    res.render('jsp');
  } else {
    res.redirect('/');
  }
});
app.get('/node', (req, res) => {
  if(req.session.user) {
    res.render('node');
  } else {
    res.redirect('/');
  }
});
app.get('/servlet', (req, res) => {
  if(req.session.user) {
    res.render('servlet');
  } else {
    res.redirect('/');
  }
});
app.get('/session', (req, res) => {
  if(req.session.user) {
    res.render('session');
  } else {
    res.redirect('/');
  }
});
app.get('/coursewebsite', (req, res) => {
  if(req.session.user) {
    res.render('coursewebsite');
  } else {
    res.redirect('/');
  }
});
// Route to get questions
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions JOIN options ON id == question_id where quiz_code == ? ORDER BY id ASC, code ASC',
    {
      replacements: [3],
      type: Sequelize.QueryTypes.SELECT
    })
    .then(questions => {
      let questionArr = [];
      for(var i = 0; i < questions.length; i+=3) {
        questionArr.push({
          "id": questions[i].id,
          "showid": questions[i].id % 10 == 0 ? 10 : questions[i].id % 10,
          "name": 'q' + (questions[i].id % 10 == 0 ? 10 : questions[i].id % 10),
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

app.post('/getAnswers', (req, res) => {
  let q1 = req.body;
  console.log(q1.values);
});

// Route to save response

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server started @ http://localhost:' + port);
});
