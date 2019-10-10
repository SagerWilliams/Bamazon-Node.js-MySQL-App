// imports
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

// connection options
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.SQL_PASS,
    database: "bamazon"
});

// connect to database
connection.connect(function (err) {
    if (err) throw err;
    // run the getProductInfo function after the connection is made to prompt the user
    console.log("Connected!");
    getProductInfo();
});

// variables storing information for each product that can be bought
var productName = [];
var productDepartment = [];
var productPrice = [];
var productStock = [];

// function for storing info on products
function getProductInfo() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        // loop through each product in database
        for (var i = 0; i < results.length; i++) {
            productName.push(results[i].product_name);
            productDepartment.push(results[i].department_name);
            productPrice.push(results[i].price);
            productStock.push(results[i].stock_quantity);
        }

        manage();
    });
}

function manage() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to view?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
        .then(function (choice) {
            if (choice.choice === "View Products for Sale") {
                viewProducts();
            }
            if (choice.choice === "View Low Inventory") {
                viewInventory();
            }
            if (choice.choice === "Add to Inventory") {
                addInventory();
            }
            if (choice.choice === "Add New Product") {
                addProduct();
            }
        });
}

// view products for sale
function viewProducts() {
    for (var i = 0; i < productName.length; i++) {
        console.log((i + 1) + ". " + productName[i]);
    }
    connection.end();
}

// view inventory
function viewInventory() {
    for (var i = 0; i < productStock.length; i++) {
        console.log((i + 1) + ". " + productName[i] + " Stock remaining: " + productStock[i]);
    }
    connection.end();
}

// add to inventory
function addInventory() {
    for (var i = 0; i < productStock.length; i++) {
        console.log((i + 1) + ". " + productName[i] + " Stock remaining: " + productStock[i]);
    }
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "Which would you like to get more inventory for?",
        choices: productName
    })
        .then(function (choice) {
            inquirer.prompt({
                name: "num",
                type: "number",
                message: "How many units would you like to get?"
            })
                .then(function (num) {
                    connection.query("UPDATE products SET stock_quantity = stock_quantity + " + parseInt(num.num) + " WHERE product_name =" + '"' + choice.choice + '"', function (err, results) {
                        if (err) throw err;
                        
                        console.log(num.num + " Unit(s) of " + choice.choice + " were ordered.");
                        connection.end();
                    });
                });
        });
}

// add new product
function addProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "text",
            message: "What product would you like to offer?"
        },
        {
            name: "productDepartment",
            type: "text",
            message: "What department is this product in?"
        },
        {
            name: "productPrice",
            type: "number",
            message: "How much will this product cost?"
        },
        {
            name: "productStock",
            type: "number",
            message: "How many of this product would you like to start with?"
        }]
    )
    .then(function(results) {
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (" + '"' + results.productName + '"' + ", " + '"' + results.productDepartment + '"' + ", " + results.productPrice + ", " + results.productStock + ")", function (err, results) {
            if (err) throw err;
            
            console.log("Product has been added to Inventory!");
            connection.end();
        });
    });
}