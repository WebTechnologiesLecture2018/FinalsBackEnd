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
  if(req.session.user) {
    res.redirect('/home');
  }
  res.render('index');
});

app.post('/login', (req, res) => {
  if(req.body.user) {
    req.session.user = req.body.user;
  }
  res.redirect('/home');
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
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
    req.session.quizcode = 4;
    createQuestion(4).then(questionArr => {
      let remaining = req.session.remaining;
      res.render('jsp', { questionArr, remaining });
    });
  } else {
    res.redirect('/');
  }
});

app.get('/node', (req, res) => {
  if(req.session.user) {
    req.session.quizcode = 3;
    createQuestion(3).then(questionArr => {
      let remaining = req.session.remaining;
      res.render('node', { questionArr, remaining });
    });
  } else {
    res.redirect('/');
  }
});

app.get('/servlet', (req, res) => {
  if(req.session.user) {
    req.session.quizcode = 1;
    createQuestion(1).then(questionArr => {
      let remaining = req.session.remaining;
      res.render('servlet', { questionArr, remaining });
    });
  } else {
    res.redirect('/');
  }
});

app.get('/php', (req, res) => {
  if(req.session.user) {
    req.session.quizcode = 2;
    createQuestion(2).then(questionArr => {
      let remaining = req.session.remaining;
      res.render('php', { questionArr, remaining });
    });
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

app.get('/home', (req, res) => {
  if(req.session.user) {
    res.render('home');
  } else {
    res.redirect('/');
  }
});
// Route to get questions
const createQuestion = function(quizcode) {
  return db.query('SELECT * FROM questions JOIN options ON id == question_id where quiz_code == ? ORDER BY id ASC, code ASC',
    {
      replacements: [quizcode],
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
      return questionArr;
    });
}

app.post('/getAnswers', (req, res) => {
  let answers = req.body;
  if(Object.keys(answers).length != 10) {
    req.session.remaining = 10 - Object.keys(answers).length;
    switch(req.session.quizcode) {
      case 1:
        res.redirect('/servlet');
        break;
      case 2:
        res.redirect('/php');
        break;
      case 3:
        res.redirect('/node');
        break;
      case 4:
        res.redirect('/jsp');
        break;
      }
  } else {
    db.query('SELECT * FROM questions JOIN options ON id == question_id where quiz_code == ? AND is_correct == 1  ORDER BY id ASC',
      {
        replacements: [req.session.quizcode],
        type: Sequelize.QueryTypes.SELECT
      })
      .then(results => {
        let correct = 0;
        let count = 0;
        for(key in answers) {
          if(results[count].code == answers[key]) {
            correct++;
          }
          count++;
        };
        let heading = correct < 6
          ? "Try again!"
          : correct < 8
          ? "Keep it up!"
          : correct < 10
          ? "Good job!"
          : "Perfect";
        let body = correct < 6
          ? "Go back to the top and study more!"
          : correct < 8
          ? "You can still improve, study more!"
          : correct < 10
          ? "Fantastic, a little bit more you can Perfect it, study more!"
          : "Wow Amazing, This is just a beginning there are still more to learn, study more!"
        res.render('results', { correct, heading, body });
      });
  };
});

// Route to save response

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Server started @ http://localhost:' + port);
});
