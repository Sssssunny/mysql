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
//
//   console.log(id);
//   console.log(pw);
  // conn.query('SELECT * FROM user WHERE `EMAIL` = id;', function(err, results){

  //   res.render('index', { results: results });

  //   conn.release();
  // });
});

// 로그인 페이지
router.post('/', function(req, res, next) {
  
  const id = req.body.id;
  const pw = req.body.pw;

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM user WHERE EMAIL = '${id}' AND PW = password('${pw}');`,function(err, result){
      if(result.length > 0) {
        res.render('true', {ID: id, PW: pw});
        console.log('---------로그인 성공---------');
      }
    });
    conn.query(`SELECT * FROM user WHERE EMAIL = '${id}' AND PW = password('${pw}');`,function(err, result){
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


// 회원정보 테이블
router.get('/table', function(req, res, next) {
  pool.getConnection(function(err, conn){
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

module.exports = router;



// app.post('/', function(req, res) {
//   const id = req.body.id;
//   const pw = req.body.pw;
//   const sql = 'SELECT * FROM user';
//   conn.query(sql, [id], function(err, results){
//     if(err)
//       console.log(err);

//     if(!results[0])
//       return res.send('존재하지 않는 아이디입니다.');

//     const user = results[0];
//     crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function(err, derivedKey){
//       if(err)
//         console.log(err);
//       if(derivedKey.toString('hex') === user.password){
//         return res.send('login success');
//       }
//       else {
//         return res.send('존재하지 않는 비밀번호입니다.');
//       }
//     });
//   });
// });