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
VALUES  ("Keyboard", "Tech Equipment", 120, 5),
        ("Mouse", "Tech Equipment", 80, 1),
        ("Mouse Pad", "Tech Equipment", 15, 0),
        ("GeForce GTX 1080 Ti", "Tech Component", 1350, 1),
        ("ROG 144hz 1ms Monitor", "Tech Equipment", 425, 2),
        ("Webcam", "Tech Equipment", 50, 4),
        ("Tripod", "Camera Equipment", 25, 1),
        ("Standing Desk", "Office Furniture", 700, 1),
        ("Bang Energy Drink", "Energy Drinks", 3, 100),
        ("Doritos", "Snack Foods", 2, 250);

-- read rows
SELECT * FROM products;

-- update rows

-- delete rows