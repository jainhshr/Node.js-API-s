app.get("/users", (req, res) => {
  const connection = getConnection()
  const queryString = "SELECT * FROM health"
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})