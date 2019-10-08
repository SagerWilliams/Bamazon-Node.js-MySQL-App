-- create database
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

-- make sure we use the correct database
USE bamazon;
-- create table to store information
-- DROP TABLE IF EXISTS people;
CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(75) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL
);

-- create new rows
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ();

-- read rows
SELECT * FROM products;

-- update rows

-- delete rows