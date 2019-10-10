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
    // run the start function after the connection is made to prompt the user
    console.log("Connected!");
    getProductInfo();
});

var productArr = [];
var productName = [];
var productDepartment = [];
var productPrice = [];
var productStock = [];
function getProductInfo() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            productName.push(results[i].product_name);
            productDepartment.push(results[i].department_name);
            productPrice.push(results[i].price);
            productStock.push(results[i].stock_quantity);
        }
        for (var j = 0; j < productName.length; j++) {
            productArr.push("Product: " + productName[j] + " | Department: " + productDepartment[j] + " | Price: $" + productPrice[j] + " | Stock Left: " + productStock[j]);
        }
        start();
    });
}

function start() {
    inquirer.prompt({
            name: "product",
            type: "list",
            message: "Which product would you like to buy?",
            choices: productName
        })
        .then(function (choice) {
            connection.query("SELECT * FROM products WHERE product_name = " + '"' + choice.product + '"', function (err, results) {
                if (err) throw err;
                console.log("Department: " + results[0].department_name);
                console.log("Price: $" + results[0].price);
                console.log("Stock Remaining: " + results[0].stock_quantity + " units");

                inquirer.prompt({
                    name: "confirm",
                    type: "confirm",
                    message: "Are you sure you would like to purchase this product?"
                })
                .then(function (decision) {
                    connection.query("SELECT * FROM products WHERE product_name = " + '"' + choice.product + '"', function (err, results) {
                        if (err) throw err;
                        // update units and cb start
                        if (decision.confirm) {
                            connection.query("UPDATE products SET stock_quantity =" + (results[0].stock_quantity -= 1) + " WHERE item_id =" + results[0].item_id, function (err, results) {
                                if (err) throw err;
                                console.log("Product has been purchased!");
                                inquirer.prompt({
                                    name: "choice",
                                    type: "confirm",
                                    message: "Would you like to purchase another product?"
                                })
                                .then(function(choice) {
                                    if (choice.choice) {
                                        start();
                                    } else {
                                        console.log("Thanks for shopping!")
                                        connection.end();
                                    }
                                });
                            });
                        } else {
                            connection.end();
                        }
                    });
                });
            });
        });
}