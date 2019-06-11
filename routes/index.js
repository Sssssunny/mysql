const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express;

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'qazx1235',
  database        : 'sunny',
  dateStrings     : 'date'
});

// 로그인 페이지
router.get('/', function(req, res, next) {
  console.log('---------로그인 페이지 접속---------');
  const id = req.body.id;
  const pw = req.body.pw;
  res.render('login');
});

// 로그인 DB 검사
router.post('/', function(req, res, next) {
  
  const id = req.body.id;
  const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE EMAIL = '${id}' AND PW = password('${pw}');`,function(err, result){
      if(result.length > 0) {
        res.render('true', {ID: id, PW: pw});
        console.log('---------로그인 성공---------');
      } else
      if(result.length >= 0) {
        res.render('false');
        console.log('---------로그인 실패---------');
      }
    });
    conn.release();
  });
});


// 로그아웃
router.get('/logout', function(req, res, next) {
  res.render('logout');
  req.session.destroy();
  console.log('---------로그아웃---------');
});


// 회원정보 페이지
router.get('/table', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM user;', function(err, results){
    console.log('---------회원정보 페이지 접속---------');
    // console.log(results[0].BIRTH);
    // console.log('-------------');
      res.render('index', { results: results });

      conn.release();
    });
  });
});

router.post('')

// 회원가입 페이지
router.get('/join', function(req, res, next) {
  console.log('---------회원가입 페이지 접속---------');
  res.render('join');
});

// router.post('/join', function (req, res, next) {
//   const name = req.body.name;
//   const id = req.body.id;
//   const pw = req.body.pw;
//   const phone = req.body.phone;
//   const birth = req.body.birth;
//   const age = req.body.age;
//   const post = req.body.post;
//   const add = req.body.add;
//   const hobby = req.body.hobby;

//   conn.query('INSERT into user values(?,?,?,?,?,?,?,?,?)',
//       [name, age, birth, add, post, hobby, phone, id, pw], function (err, rows, fields) {
//       if (!err) {
//           res.send('success');
//       }
//       else {
//           res.send('err : ' + err);
//       }
//       conn.release();
//   });

  router.post('/join', function(req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const birth = req.body.birth;
    const add = req.body.add;
    const post = req.body.post;
    const hobby = req.body.hobby;
    const phone = req.body.phone;
    const id = req.body.id;
    const pw = req.body.pw;

    pool.getConnection(function(err, conn) {
      const query = conn.query(`INSERT INTO user (NAME, AGE, BIRTH, ADD, POST, HOBBY, PHONE, EMAIL, PW) VALUES('${name}', '${age}', '${birth}', '${add}', '${post}', '${hobby}', '${phone}', '${id}', 'password(${pw}));`, function(err, result) {
          if (err) { throw err;}
          console.log('---------회원가입 성공---------');
      })
    });
  });


module.exports = router;