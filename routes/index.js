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
  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM user;', function(err, results){
      if (req.session.id && req.session.pw ) {
        res.render('index', { results : results });
      } else {
        res.render('login', {  });
      }      
      conn.release();
    });
  });
});

// 로그인 DB 검사
router.post('/', function(req, res, next) {
  
  const id = req.body.id;
  const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE EMAIL = '${id}' AND PW = password('${pw}');`,function(err, result){
      if (result.length > 0) {

        req.session.username = req.body.id;
        req.session.pw = req.body.pw;

        // console.log(req.session.username);

        res.render('logintrue', {ID: id, PW: pw});
        console.log('---------로그인 성공---------');
      }
      else {
        res.render('loginfalse');
        console.log('---------로그인 실패---------');
      }
    });
    conn.release();
  });
});


// 로그아웃
router.get('/logout', function(req, res, next) {
  
  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM user;', function(err, results){
      if (req.session.id && req.session.pw ) {
        res.render('logout', { results : results });
        req.session.destroy();
      } else {
        res.send('로그인을 먼저 해주세요.');
      }
      conn.release();
    });
  });
});


// 회원정보 페이지
router.get('/table', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM user;', function(err, results) {
    console.log('---------회원정보 페이지 접속---------');
  
    pool.getConnection(function(err, conn){
    });
     res.render('index', { results: results });

     conn.release();
    });
  });
});


// 회원 탈퇴
router.get('/delete', function(req, res, next) {
  
  pool.getConnection(function(err, conn){
    if(err) {throw err;
    }
    conn.query(`DELETE FROM user WHERE num = '${req.query.NUM}'`, function(err, results){
      conn.release();
      req.session.destroy();
      res.redirect('/table');
    });
  });
});


// 회원가입 페이지
router.get('/join', function(req, res, next) {
  console.log('---------회원가입 페이지 접속---------');
  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM user;', function(err, results){
      res.render('join', { results: results });
      conn.release();
    });
  });
});


// 회원가입 기능
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
    conn.query(`INSERT INTO user (\`NAME\`, AGE, BIRTH, \`ADD\`, POST, HOBBY, PHONE, EMAIL, PW) VALUES('${name}', '${age}', '${birth}', '${add}', '${post}', '${hobby}', '${phone}', '${id}', password('${pw}'));`, function(err, result) {
        if (err) { throw err;}
        res.render('true', {ID: id, PW: pw});
    })
  });
});

module.exports = router;