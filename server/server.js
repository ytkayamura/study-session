const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const exec = () => {
  const app = express();
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // セッションの設定
  const sessionValues = {
    secret: process.env.SESSION_SECRET || Math.random().toString(36).split('.')[1],
    resave: false,
    saveUninitialized: false,
    cookie: {
      // maxAge: 30 * 60 * 1000,
      sameSite: 'strict',
    },
  };
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionValues.cookie.secure = true;
  }
  app.use(session(sessionValues));
  app.use(cookieParser());

  const PORT = process.env.PORT || 8081;

  app.post('/api/login', async (req, res) => {
    const { mail, pass } = req.body;
    // セッション開始、ログイン
    req.session.authenticated = true
    return res.status(200).send({
      authenticated: true
    });
  });

  app.post('/api/set-session-value', async (req, res) => {
    // セッション開始、ログインしない
    req.session.fuga = 'fuga';
    return res.status(200).send({
      ...req.cookies,
    });
  });

  app.post('/api/logout', async (req, res) => {
    try {
      req.session.destroy();
      return res.status(200).send();
    } catch {
      return res.status(500).send();
    }
  });

  app.get('/api/check-login', async (req, res) => {
    console.log(req.session);
    console.log(req.cookies['connect.sid'])
    // ログインチェック
    if(req.session.authenticated) {
      console.log('ok');
      return res.status(200).send({ ...req.cookies, authenticated: true });
    } else {
      console.log('ng');
      return res.status(200).send({ ...req.cookies, authenticated: false })
    }
  });

  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server is running at port:${PORT}`);
    }
  });
};
exec();

