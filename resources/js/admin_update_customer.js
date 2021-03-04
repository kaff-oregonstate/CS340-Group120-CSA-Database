
// name: admin_update_customer.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin update customer handlebars

// const baseUrl = 'http://flip3.engr.oregonstate.edu:3891/'
const baseUrl = "http://localhost:28394/";

// ///////////////////////
//      ADMIN PAGE
// ///////////////////////

// *********************************
// ***** Update/Delete Customer ****
// *********************************

//send http request to the route that renders update customer page 
//and populates it with the data from the customer table
const getData_update_delete_customer = async () => {
    console.log("getData ROUTE update/delete ...")

    //create request object
    let xhr = new XMLHttpRequest();
    
    //when server responds
    xhr.onload = function(){
        if(xhr.status === 200){
            console.log("in onload ud");
            // console.log(xhr.response);
            // //store contents of customer table in variable
            // var customer_rows = xhr.response;
            // console.log(customer_rows);
        }
    };

    //prepare request using open(http method, url of page, boolean value for async)
    xhr.open('GET', '/admin-update-customer', true);
    xhr.send(null);

}


//event listener for clicks on the search customer button
document.querySelector('#search-customer').onclick = search_customer;

async function search_customer(event){

    console.log("admin_update_customer-js--inside search customer!")

    //generate payload with new customer input
    var payload = {};
    payload.first_name = document.getElementById('first-name-search').value
    payload.last_name = document.getElementById('last-name-search').value

    console.log(payload)

    //check that user has filled out all inputs in add customer form
    if(isError(payload)){
        console.log("ERROR IN PAYLOAD -- search_customer ")
        $("#update-search-error").html("Please fill out all the fields before submitting.");
        return
    }

    //create a request object
    let xhr = new XMLHttpRequest();
    //specify route/page that will handle request
    xhr.open('POST', '/SEARCH-customer', true);

    //tell server it will be receiving JSON
    xhr.setRequestHeader('Content-Type','application/json')

    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            console.log("inside load event listener --- search customer!");
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    xhr.send(JSON.stringify(payload));
    event.preventDefault();

}



window.onload = function(){
    //event listener for clicks in the body of the customer update and delete table
    document.querySelector('#update-delete-table').addEventListener('click', click_ud_table)
}

async function click_ud_table(event){
    console.log("CLICK EVENT -- update table")
    //save location of user click in target
    var target = event.target;
    
    //if the target has a customer_id
    if(target.parentNode.parentNode.dataset.customer){
        //store the customer id of row clicked by user
        var customer_id = target.parentNode.parentNode.dataset.customer;

        //is the button clicked an update or delete button
        if(target.getAttribute('class') == "btn btn-green update-customer")
        {   
            //if row is disabled enable, if row is enabled collect info & disable
            if(target.innerHTML == "Update"){
                enable_row(target)
                toggle_button(target)
            
            }else{
                toggle_button(target)
                update_customer(target, customer_id)
            }

        } else if(target.getAttribute('class') == "btn btn-green delete-customer"){
            //if delete, do the send to the delete customer function
            delete_customer(customer_id);
        }
    }
}


//function associated with update button click:
//this function packages the changes the user made to the customer
//and sends them to the server in an HTTP request.
async function update_customer(target, customer_id){

    console.log("INSIDE UPDATE CUSTOMER")

    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //generate payload with updated customer input
    var payload = {};

    payload.customer_id = customer_id
    payload.first_name = first_name_input.value
    payload.last_name = last_name_input.value
    payload.date_paid = date_input.value

    console.log(payload)

    // console.log(payload)

    //error handling of updated customer input
    if(isError(payload)){
        console.log("ERROR IN PAYLOAD update customer")
        $("#update-delete-error").html("Please fill out all the fields before submitting")
        return
    }

    //create HTTP request object and open request
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', '/UPDATE-customer', true)
    xhr.setRequestHeader("Content-Type", "application/json");

    //event listener for response from server
    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            console.log("inside update server return successful!");
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    //convert JS object to JSON and send to server
    xhr.send(JSON.stringify(payload));

}

async function delete_customer(customer_id){

    console.log("inside delete customer function")

    //are you sure you want to delete customer?

    //collect customer id
    var payload = {};
    payload.customer_id = customer_id

        //create HTTP request object and open request
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/DELETE-customer' + customer_id, true)
    
        //event listener for response from server
        xhr.addEventListener('load', function(){
            if(xhr.status >= 200 && xhr.status < 400){
                console.log("inside delete customer return successful!");
                alert("customer successfully deleted")
            } else {
                console.log("Error in network request: " + xhr.statusText);
            }
        });
    
        //convert JS object to JSON and send to server
        xhr.send(JSON.stringify(payload));
}


//check if form inputs have been filled out
function isError(obj){
    for (key in obj){
        if(obj[key] == null || obj[key] == "" || obj[key] == "0000-00-00"){
            return true;
        }
    }
    console.log("ERROR = false");
    return false;
}

function enable_row(target){
    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //enable inputs
    first_name_input.disabled = false
    last_name_input.disabled = false
    date_input.disabled = false
}

function disable_row(target){
    
    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //enable inputs
    first_name_input.disabled = true
    last_name_input.disabled = true
    date_input.disabled = true
}

function toggle_button(target){

    if(target.innerHTML == "Update"){
        target.innerHTML = "Done" 
    }else if(target.innerHTML == "Done"){
        disable_row(target)
        target.innerHTML = "Update"
    }
}