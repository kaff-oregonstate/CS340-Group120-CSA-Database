// name: adminHandler.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin handlebars pages

// const { get } = require("https");

// const baseUrl = 'http://flip3.engr.oregonstate.edu:3891/'
const baseUrl = "http://localhost:28394/";


// var express = require('express');
// var mysql = require('./dbcon.js');
// var CORS = require('cors');

// var app = express();
// app.set('port', 28394);

// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(CORS());

// ///////////////////////
//      ADMIN PAGES
// ///////////////////////

// testing connectivity with handlebars


// var customers = 
// [
//     {first_name: "Amelia",last_name: "Walsh",subs_date: "2021-06-01"},
//     {first_name: "Amelia",last_name: "Walsh",subs_date: "2021-06-01"}
// ];

// $("#people").html(tableTemplate({ array: customers }));

// console.log(customers.first_name);


// ***********************
// ***** New Customer ****
// ***********************

// const get_all_customers = 'SELECT * FROM Customers';
// const insert_customers = "INSERT INTO Customers (first_name, last_name, date_paid) VALUES(?,?,?);"


// get data from the Customers table for display on the webpage
const getData = async () => {
    
    console.log("getData ROUTE ...")

    //create request object
    let xhr = new XMLHttpRequest();
    
    //when server responds
    xhr.onload = function(){
        if(xhr.status === 200){
            console.log("in onload");
            // console.log(xhr.response);
            // //store contents of customer table in variable
            // var customer_rows = xhr.response;
            // console.log(customer_rows);
        }
    };

    //prepare request using open(http method, url of page, boolean value for async)
    xhr.open('GET', baseUrl + 'admin-add-cust', true);
    xhr.send(null);

};

//async function to insert customer into customer table


//event listener on "submit-customer" form on "new customer page"
document.querySelector('#submit-customer').onsubmit = submit_customer;

//after clicking submit on the form 
async function submit_customer(event){

    //create a request object
    let xhr = new XMLHttpRequest();
    //specify route/page that will handle request
    xhr.open('POST', baseUrl + 'INSERT-customer', true);

    //generate payload with new customer input
    var payload = {};
    payload.first_name = document.getElementById('first-name-add').value
    payload.last_name = document.getElementById('last-name-add').value
    payload.date_paid = document.getElementById('date-paid-add').value

    //check that user has filled out all inputs in add customer form
    if(isFull(payload)){
        console.log("payload full");
        $("#add-cust-error").html("");
    }else{
        console.log("in else clause");
        $("#add-cust-error").html("Please fill out all the fields before submitting");
        return;
    }

    //tell server it will be receiving JSON
    xhr.setRequestHeader('Content-Type','application/json')

    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            console.log("inside load event listener!");
            getData();
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    xhr.send(JSON.stringify(payload));
    event.preventDefault();
}

//check if form inputs have been filled out
function isFull(obj){
    for (key in obj){
        if(obj[key] == null || obj[key] == "" || obj[key] == "0000-00-00"){
            console.log("returning false");
            disableButton('#submit-customer')
            return false;
        }
    }
    console.log("returning true");
    return true;
}


// enableButton('#submit-customer');
// disableButton('#submit-customer');

function disableButton(target){
    if($(target).disabled == true){
        $(target).disabled = false;
    }
}

function enableButton(target){
    if ($(target).disabled == false){
        $(target).disabled == true;
    }
}


//potential additional error handling---no two customers with all same values?










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
