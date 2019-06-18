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

// 게시판 글 목록
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM board;', function(err, results) {

    req.session.num = req.query.NUM;
    req.session.title = req.query.TITLE;
    req.session.content = req.query.CONTENT;
    req.session.email = req.query.EMAIL;

    res.render('board', { results: results });
    console.log('---------게시판 접속---------');

     conn.release();
    });
  });
});

// 게시판 글 등록
router.get('/write', function(req, res, next) {
  console.log('---------게시글 작성 페이지 접속---------');
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE NUM='${req.session.num}';`, function(err, results){
      res.render('write', { results: results });
      
      conn.release();
    });
  });
});


/*게시판글 등록2*/
router.post('/write2', function(req, res, next) {

  const email = req.session.username;
  const title = req.body.title;
  const content = req.body.content;

  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO board (EMAIL, TITLE, CONTENT, NAME, WDATE) VALUES ('${email}', '${title}', '${content}', '이름', '2019-06-17');`, function(err, results){
      res.redirect('/board');
      console.log('---------게시판 글 등록 성공---------');
      conn.release();
    });
  });
});


/*게시판글 삭제*/
router.get('/delete', function(req, res, next) {
  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board;`, function(err, results){
      res.render('delete');
      conn.release();
    });
  });
});


/*게시판글 삭제*/
router.get('/delete2', function(req, res, next) {
  const title = req.query.title;
  pool.getConnection(function(err, conn){
    conn.query(`DELETE FROM board WHERE EMAIL='${req.session.id}'`, function(err, results){
      res.redirect('/board');
      
      conn.release();
    });
  });
});


//게시판 글 수정 페이지 이동
router.get('/update', function(req, res, next) {
  pool.getConnection(function(err, conn){
    
    // console.log(req.query.EMAIL);
    // console.log(req.session.username);

    if(req.query.EMAIL == req.session.username) {
      pool.getConnection(function(err, conn){
        conn.query(`SELECT FROM board WHERE NUM='${req.session.num}';`, function(err, results) {
          res.render('update',{results: results, id: req.query.id});
          
          conn.release();
        });
      });
    }
  });
});

//게시판 글 수정하기
router.post('/update', function(req, res, next) {

    const num = req.session.num;
    const title = req.body.title;
    const content = req.body.content;

    pool.getConnection(function(err, conn){
      console.log(`UPDATE board SET TITLE='${title}', CONTENT='${content}' WHERE NUM='${num}';`)
      conn.query(`UPDATE board SET TITLE='${title}', CONTENT='${content}' WHERE NUM='${num}';`, function(err, results){
        conn.query('SELECT * FROM board;', function(err, results){
          res.render('board', {results: results});
          conn.release();
        });
    });
  });
});

module.exports = router;