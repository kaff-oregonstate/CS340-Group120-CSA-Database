// name: adminHandler.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin handlebars pages

// const baseUrl = 'http://flip3.engr.oregonstate.edu:3891/'
const baseUrl = "http://localhost:28394/";



// ///////////////////////
//      ADMIN PAGE
// ///////////////////////

// ***********************
// ***** New Customer ****
// ***********************

// const get_all_customers = 'SELECT * FROM Customers';
// const insert_customers = "INSERT INTO Customers (first_name, last_name, date_paid) VALUES(?,?,?);"


// get data from the Customers table for display on the webpage
const getData_add_customer = async () => {
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
    xhr.open('GET', '/admin-add-customer', true);
    xhr.send(null);

};

//async function to insert customer into customer table


//event listener on "submit-customer" form on "new customer page"
document.querySelector('#submit-customer').onclick = add_customer;

//after clicking submit on the form 
async function add_customer(event){

    //generate payload with new customer input
    var payload = {};
    payload.first_name = document.getElementById('first-name-add').value
    payload.last_name = document.getElementById('last-name-add').value
    payload.date_paid = document.getElementById('date-paid-add').value

    //check that user has filled out all inputs in add customer form
    if(isError(payload)){
        console.log("ERROR IN PAYLOAD")
        $("#add-cust-error").html("Please fill out all the fields before submitting");
        return
    }

    console.log("NOT RETURN FROM FUNCTION")
    //create a request object
    let xhr = new XMLHttpRequest();
    //specify route/page that will handle request
    xhr.open('POST','/INSERT-customer', true);

    //tell server it will be receiving JSON
    xhr.setRequestHeader('Content-Type','application/json')

    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            console.log("inside load event listener!");
            getData_add_customer();
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    xhr.send(JSON.stringify(payload));
    event.preventDefault();
}

//check if form inputs have been filled out
function isError(obj){
    for (key in obj){
        if(obj[key] == null || obj[key] == "" || obj[key] == "0000-00-00"){
            return true;
        }
    }
    console.log("returning false");
    return false;
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


