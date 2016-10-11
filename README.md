# Node & Postgres Lecture

## Takeaways

* You can connect to your Postgres database using the `pg` module
* You need to know the name of the database (see `config` in routes/books.js)
* Use `pool.connect(...)` to connect to the database
* Use `client.query(...)` to query the database with SQL
* When creating queries with client-submitted data, always use the prepared statement pattern (see router.post in routes/books.js)
