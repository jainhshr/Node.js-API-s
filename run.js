const express = require('express')
const app = express()
const morgan=require('morgan') 
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql')
const csv = require('fast-csv');

app.use(morgan('short'))

app.use(express.static('./public'));


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

function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'visit'
  })
}


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null, __dirname + '/uploads/')
	},
	filename: (req, file, cb) => {
	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
});
 
const upload = multer({storage: storage});

// -> Express Upload RestAPIs
app.post('/upload', upload.single("uploadfile"), (req, res) =>{
	importCsvData2MySQL(__dirname + '/uploads/' + req.file.filename);
	res.send(JSON.stringify({
				'msg': 'File uploaded/import successfully!'
			}));
});

function importCsvData2MySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
 
            // Create a connection to the database
				const connection = getConnection()
 
            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO health (id, name, date, steps, calories) VALUES ?';
                    connection.query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
			
			// delete file after saving to MySQL database
			// -> you can comment the statement to see the uploaded CSV file.
			fs.unlinkSync(filePath)
        });
 
    stream.pipe(csvStream);
}
	

//localhost:3003
app.listen(3003, () =>{
	console.log("server is up and listening on 3003..")
})