const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'qazx1235',
  database        : 'sunny'
});

/* GET home page. */
router.get('/', function(req, res, next) {

  pool.getConnection(function(err, conn){
    conn.query('SELECT * FROM emp;', function(err, results){
      console.log('-------------results-------------');
      console.log(results);
      console.log('--------------------------');

      res.render('index', { results: results });

      conn.release();
    });
  });
});

module.exports = router;
