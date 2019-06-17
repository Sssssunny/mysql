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
     res.render('board', { results: results });
     console.log('---------게시판 접속---------');

     conn.release();
    });
  });
});

// 게시판 글 등록
router.get('/write', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE EMAIL='${req.session.ID}';`, function(err, results){
      res.render('write', { results: results });
      
      conn.release();
    });
  });
});


/*게시판글 등록2*/
router.post('/write2', function(req, res, next) {
  const title = req.body.title;
  const content = req.body.content;
  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO board (TITLE, CONTENT, EMAIL) VALUES ('${title}','${content}','${req.session.ID}');`, function(err, results){
      res.redirect('/board');
      
      conn.release();
    });
  });
});

/*게시판글 삭제*/
router.get('/delete', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query(`SELECT * FROM board WHERE NAME='${req.session.id}';`, function(err, results){
      res.render('delete', { results: results });
      
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

module.exports = router;