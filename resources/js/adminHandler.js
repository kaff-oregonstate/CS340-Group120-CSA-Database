// name: adminHandler.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin handlebars pages

var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 28394);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

// ///////////////////////
//      ADMIN PAGES
// ///////////////////////

// ***********************
// ***** New Customer ****
// ***********************

const get_all_customers = 'SELECT * FROM Customers';
const insert_customers = "INSERT INTO Customers (first_name, last_name, date_paid) VALUES(?,?,?);"

const getAllData = (res) => {
    var context = {};
    mysql.pool.query(get_all_customers, (err, rows, fields) => {
      if(err){
        return;
      }
      res.json({"rows": rows});
    });
  };


app.post('/',function(req,res,next){
    // var context = {};
    var {first_name, last_name, date_paid} = req.body;
    mysql.pool.query(insert_customers, [first_name, last_name, date_paid], (err, result)=>{
      if(err){
        next(err);
        return;
      }
      
      getAllData(res);
  
    });
  });















function search_cust(){
    console.log('search_cust()');
}

function add_cust(){
    console.log('add_cust()');
}

function updt_cust(){
    console.log('updt_cust()');
}

function delete_cust(){
    console.log('delete_cust()');
}
