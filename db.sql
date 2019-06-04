CREATE DATABASE visit;  
CREATE TABLE health(  
   id INT NOT NULL,  
   name VARCHAR(100) NOT NULL,  
   dates VARCHAR(100) NOT NULL,  
   steps INT NOT NULL,
   calories INT NOT NULL,
   PRIMARY KEY (id,name,dates)  
);  