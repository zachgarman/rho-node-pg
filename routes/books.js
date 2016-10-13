var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'       // key value pair = database key, with a value of rho-node-pg
};                      // this database must exist in Postico

var pool = new pg.Pool(config);   // creates a pool for people to access server
                                  // pool does not destroy access points, recycles them.
                                  // pool object is what we go through whenver we need
                                  // to access the datbase
// make a server query only asking for 1 book with a specific id provided by the user
router.get('/:id', function (req, res) {
  pool.connect(function(err, client, done) {
    // first thing, check to see if there was an error.
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }
    client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result){
      // first thing, check to see if there was an error.
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        done();   // even if there is an error, call done and release
                  // that connection so someone else can use it
        return;
      }

      //console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.get('/', function(req, res) {
  // err = an error object, will be not-null if there was an error connecting
	// if the config is wrong or db is not running, will get an error

	// client - object that is used to make queries against the db

	// done = function to call when you’re done (returns connection back to the pool for other users to use)
  pool.connect(function(err, client, done) {
    // first thing, check to see if there was an error.
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    // 1. SQL string
    // 2. (optional) input parameters
    // 3. callback function to execute once the query is finished
    // callback function takes an error object anda  result object as args
    client.query('SELECT * FROM books ORDER BY title ASC;', function(err, result){
      // first thing, check to see if there was an error.
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        done();   // even if there is an error, call done and release
                  // that connection so someone else can use it
        return;
      }

      //console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO books (author, title, published, publisher, edition) VALUES ($1, $2, $3, $4, $5) returning *;',
                 [req.body.author, req.body.title, req.body.published, req.body.publisher, req.body.edition],
                 function(err, result) {
      done();
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.send(result.rows);
    });
  });
});

router.delete('/', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      res.sendStatus(500);
      done();
      return;
    }
                                                  // since nothing is returned, no result needs to be included, can delete result
    client.query('DELETE FROM books WHERE id = $1;', [req.body.id], function(err, result) {
      done();
      if (err) {
        console.log(req.body.id);
        console.log('Error querying the DB in delete');
        res.sendStatus(500);
        return;
      }
      res.send(result.rows);
    });
  });
});

// different way for delete :
// router.delete('/:id', function(req, res) {
//   var id = req.params.id;
//
//   pool.connect(function(err, client, done) {
//     try {
//       if (err) {
//         console.log('Error connecting to the DB', err);
//         res.sendStatus(500);
//         return;
//       }
//
//       client.query('DELETE FROM books WHERE id = $1;', [id], function(err) {
//         if (err) {
//           console.log('Error querying the DB', err);
//           res.sendStatus(500);
//           return;
//         }
//         res.sendStatus(204);
//       });
//
//
//     } finally {
//       done();
//     }
//   });
// });

router.put('/:id', function (req, res) {
  var id = req.params.id;       // id is part of the url, so it is in the req.params
  var author = req.body.author; // author etc. is part of the request, req.body
  var title = req.body.title;
  var published = req.body.published;
  var publisher = req.body.publisher;
  var edition = req.body.edition;

  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log('Error connecting the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE books SET author=$1, title=$2, published=$3, publisher=$4, edition=$5 WHERE id=$6 RETURNING *;',
      [author, title, published, publisher, edition, id],
      function(err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);
          return;
        }

        res.send(result.rows);
     });
    } finally {
      done();
    }
  });
});

module.exports = router;
