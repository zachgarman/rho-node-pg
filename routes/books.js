var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

// initialize the database connection pool
var pool = new pg.Pool(config);

router.get('/', function(req, res){

  // err - an error object, will be not-null if there was an error connecting
  //       possible errors, db not running, config is wrong

  // client - object that is used to make queries against the db

  // done - function to call when you're done (returns connection back to the pool)
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    // 1. SQL string
    // 2. (optional)  input parameters
    // 3. callback function to execute once the query is finished
    //      takes an error object and a result object as args
    client.query('SELECT * FROM books;', function(err, result){
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.get('/:id', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }
    client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result){
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO books (author, title, published) VALUES ($1, $2, $3) returning *;',
                 [req.body.author, req.body.title, req.body.published],
                 function(err, result){
                   done();
                   if (err) {
                     console.log('Error querying the DB', err);
                     res.sendStatus(500);
                     return;
                   }
                   console.log('Got rows from the DB:', result.rows);
                   res.send(result.rows);
                 });
  });
});

module.exports = router;
