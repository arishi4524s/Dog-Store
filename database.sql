CREATE DATABASE IF NOT EXISTS pawfect_store;
USE pawfect_store;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(50), role VARCHAR(10));
INSERT INTO users (username,password,role) VALUES ('user','password','customer'),('admin','admin123','admin');
CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100),category VARCHAR(50),price DECIMAL(10,2),description TEXT,emoji VARCHAR(10));
