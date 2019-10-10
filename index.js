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
var productArr = [];
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
        
        shop();
    });
}

// shop function runs the user through the process of chosing and purchasing producs
function shop() {
    inquirer.prompt({
        name: "product",
        type: "list",
        message: "Which product would you like to buy?",
        choices: productName
    })
        .then(function (choice) {
            // gets information on chosen product
            connection.query("SELECT * FROM products WHERE product_name = " + '"' + choice.product + '"', function (err, results) {
                if (err) throw err;
                console.log("Department: " + results[0].department_name);
                console.log("Price: $" + results[0].price);
                console.log("Stock Remaining: " + results[0].stock_quantity + " units");

                // makes sure there's enough stock before letting the user purchase the product
                if (results[0].stock_quantity > 0) {
                    inquirer.prompt({
                        name: "confirm",
                        type: "confirm",
                        message: "Are you sure you would like to purchase this product?"
                    })
                        .then(function (decision) {
                            connection.query("SELECT * FROM products WHERE product_name = " + '"' + choice.product + '"', function (err, results) {
                                if (err) throw err;

                                // make sure the user wants to purchase the product
                                // if they do, update the stock and let them know they purchased it
                                if (decision.confirm) {
                                    connection.query("UPDATE products SET stock_quantity =" + (results[0].stock_quantity -= 1) + " WHERE item_id =" + results[0].item_id, function (err, results) {
                                        if (err) throw err;
                                        console.log("Product has been purchased!");
                                        inquirer.prompt({
                                            name: "choice",
                                            type: "confirm",
                                            message: "Would you like to purchase another product?"
                                        })
                                            .then(function (choice) {
                                                // if they want to buy another product, rerun through the shop function
                                                if (choice.choice) {
                                                    shop();
                                                }
                                                // if they don't want to buy another product, end the connection 
                                                else {
                                                    console.log("Thanks for shopping!")
                                                    connection.end();
                                                }
                                            });
                                    });
                                } 
                                // if they end up not wanting that product let them go back and chose a different one
                                else {
                                    shop();
                                }
                            });
                        });
                } 
                // if there's no stock left restart the purchasing process
                else {
                    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
                    console.log("Sorry, the product you requested is currently out of stock.");
                    console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
                    shop();
                }
            });
        });
}