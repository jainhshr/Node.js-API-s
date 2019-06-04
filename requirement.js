const express = require('express')
const app = express()
const morgan=require('morgan') 
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql')
const csv = require('fast-csv');

app.use(morgan('short'))

app.use(express.static('./public'));

