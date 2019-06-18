const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express;
const pool = require('../config/dbconfig.js')

// 게시판 글 목록
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM board;', function(err, results) {

    res.render('board/board', { results: results });
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
      res.render('board/write', { results: results });
      
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
      res.render('board/delete');
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


// 게시글 상세페이지
// router.get('/post', function(req, res, next) {
//   pool.getConnection(function(err, conn){

//     const num = req.query.NUM;
//     const email = req.query.EMAIL;

//     pool.getConnection(function(err, conn){
//       conn.query(`SELECT * FROM board WHERE NUM='${num}';`, function(err, results) {
//         res.render('board/post', {results: results[0]});
//         console.log('---------게시판 상세페이지 접속---------');
//         conn.release();
//       });
//     });
//   });
// });


// 게시글 상세페이지
router.get('/post', function(req, res, next) {
  pool.getConnection(function(err, conn){

    const num = req.query.NUM;

    conn.query(`SELECT COUNT(board_ID) AS 'count' FROM comment WHERE board_ID='${num}';`, function(err, counter){
      conn.query(`SELECT * FROM comment WHERE board_ID='${num}';`, function(err, board_results){
        conn.query(`SELECT a.*,COUNT(b.com_EMAIL) AS 'count' FROM board AS a LEFT JOIN comment AS b ON a.NUM=b.board_ID WHERE a.NUM='${num}';`, function(err, results){
          
          const email = req.session.username;
          res.render('board/post', {counter: counter, results: results, board_results: board_results, email: email});
          console.log('---------게시판 상세페이지 접속---------');
        });
      });
    });
    conn.release();
  });
});


//게시판 글 수정 페이지 이동
router.get('/update', function(req, res, next) {
  pool.getConnection(function(err, conn){

    const num = req.query.NUM;
    const email = req.query.EMAIL;

    console.log(req.query.EMAIL);
    console.log(req.session.username);

    pool.getConnection(function(err, conn){
      conn.query(`SELECT * FROM board WHERE NUM='${num}';`, function(err, results) {
        res.render('board/update', {results: results[0]});
        
        conn.release();
      });
    });
  });
});


//게시판 글 수정
router.post('/update', function(req, res, next) {

    const num = req.query.NUM;
    const title = req.body.title;
    const content = req.body.content;

    pool.getConnection(function(err, conn){
      console.log(`UPDATE board SET TITLE='${title}', CONTENT='${content}' WHERE NUM='${num}';`)
      conn.query(`UPDATE board SET TITLE='${title}', CONTENT='${content}' WHERE NUM='${num}';`, function(err, results){
        conn.query('SELECT * FROM board;', function(err, results){
          res.render('board/board', {results: results});
          conn.release();
        });
    });
  });
});

// 댓글을 등록할 때 사용하는 라우터

router.post('/comment', function(req, res, next) {
  const n_id = req.body.n_id;
  const comment = req.body.comment;
  const title = req.body.title;
  const description = req.body.description;
  const author = req.body.author;
  pool.getConnection(function(err, conn){
    conn.query(`INSERT INTO comments (n_id , email , description) VALUES ('${n_id}','${req.session.user_id}','${comment}');`,function(err, results){
      res.redirect(`/board/detail?id=${n_id}&title=${title}&description=${description}&author=${author}`);
      

      conn.release();
    });
  });
});

module.exports = router;