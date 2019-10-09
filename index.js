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

var productArr = [];

// connect to database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("Connected!");
    connection.query("SELECT product_name FROM products", function (err, results) {
        if (err) throw err;
        
        for (var i = 0; i < results.length; i++) {
            productArr.push(results[i].product_name);
        }
        start();
    });
});

function start() {
    inquirer
        .prompt({
            name: "product",
            type: "list",
            message: "Which product would you like to buy?",
            choices: productArr
        })
        .then(function (answer) {
            
        });
}