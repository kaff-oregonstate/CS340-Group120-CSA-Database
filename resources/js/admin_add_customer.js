// name: adminHandler.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin handlebars pages

// //////////////////////////////
//   ADMIN PAGE-- Add Customer
// //////////////////////////////

// *******************************
// ***** New Customer ************
// *******************************

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
        $("#add-cust-error").html("Please fill out all the fields before submitting.");
        return
    }
    
    //create a request object
    let xhr = new XMLHttpRequest();
    //specify route/page that will handle request
    xhr.open('POST','/INSERT-customer', true);

    //tell server it will be receiving JSON
    xhr.setRequestHeader('Content-Type','application/json')

    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            //if add was successful reload page with new name
            location.reload(true)
            // alert("New customer successfully added!")
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    xhr.send(JSON.stringify(payload));
    event.preventDefault();
}

// ~~~~~~~~~~~~~~ERROR HANDLING~~~~~~~~~~~~~~~
//check if form inputs have been filled out
function isError(obj){
    for (key in obj){
        if(obj[key] == null || obj[key] == "" || obj[key] == "0000-00-00"){
            return true;
        }
    }
    return false;
}

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



