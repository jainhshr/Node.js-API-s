function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'visit'
  })
}