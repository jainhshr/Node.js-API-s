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