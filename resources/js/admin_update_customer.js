
// name: admin_update_customer.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin update customer handlebars

// ///////////////////////////////////
//   ADMIN PAGE -- Update/Delete
// //////////////////////////////////

// ***************************************
// ********** Search Customers ***********
// ***************************************

//event listener for clicks on the search customer button
document.querySelector('#search-customer').onclick = search_customer;

async function search_customer(event){

    //generate payload with new customer input
    var payload = {};
    payload.first_name = document.getElementById('first-name-search').value
    payload.last_name = document.getElementById('last-name-search').value

    //check that user has filled out all inputs in add customer form
    if(isError(payload)){
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
            //empty all customers table, to replace with search results
            document.getElementById("update-delete-table").innerHTML = "";

            //store customers in variable, create new table-body with search data
            var customers = JSON.parse(xhr.response)
            make_search_table(customers)
            
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    xhr.send(JSON.stringify(payload));
    event.preventDefault();

}


// *********************************************
// ************ Update/Delete Customers ********
// *********************************************
//event listener for clicks in the body of the customer update and delete table
document.querySelector('#update-delete-table').addEventListener('click', click_ud_table)


async function click_ud_table(event){
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
                // toggle_button(target)
                update_customer(target, customer_id)
            }

        } else if(target.getAttribute('class') == "btn btn-green delete-customer"){
            //if delete, do the send to the delete customer function
            delete_customer(customer_id);
        }
    }
}

// ~~~~~~~UPDATE CUSTOMER~~~~~~~
//function associated with update button click:
//this function packages the changes the user made to the customer
//and sends them to the server in an HTTP request.
async function update_customer(target, customer_id){

    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //generate payload with updated customer input
    var payload = {};

    payload.customer_id = customer_id
    payload.first_name = first_name_input.value
    payload.last_name = last_name_input.value
    payload.date_paid = date_input.value

    //error handling of updated customer input
    if(isError(payload)){
        $("#update-delete-error").html("Please fill out all the fields before submitting.")
        return
    }

    //if all fields are filled out switch button to update & send request
    toggle_button(target)
    
    // remove error message
    $("#update-delete-error").html("")

    //create HTTP request object and open request
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', '/UPDATE-customer', true)
    xhr.setRequestHeader("Content-Type", "application/json");

    //event listener for response from server
    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
        } else {
            console.log("Error in network request: " + xhr.statusText);
        }
    });

    //convert JS object to JSON and send to server
    xhr.send(JSON.stringify(payload));

}

// ~~~~~~~DELETE CUSTOMER~~~~~~~
async function delete_customer(customer_id){
    //collect customer id
    var payload = {};
    payload.customer_id = customer_id

        //create HTTP request object and open request
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/DELETE-customer' + customer_id, true)
    
        //event listener for response from server
        xhr.addEventListener('load', function(){
            if(xhr.status >= 200 && xhr.status < 400){
                location.reload(true)
            } else {
                console.log("Error in network request: " + xhr.statusText);
            }
        });
    
        //convert JS object to JSON and send to server
        xhr.send(JSON.stringify(payload));
}



// ~~~~~~~~~~~~~ERROR HANDLING~~~~~~~~~~~~~~~
//check if form inputs have been filled out
function isError(obj){
    for (key in obj){
        if(obj[key] == null || obj[key] == "" || obj[key] == "0000-00-00"){
            return true;
        }
    }
    return false;
}

//function that enables inputs in the update-delete customer table
function enable_row(target){
    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //enable inputs
    first_name_input.disabled = false
    last_name_input.disabled = false
    date_input.disabled = false
}

//function that disables rows in update-delete table 
function disable_row(target){
    
    var first_name_input = target.parentNode.parentNode.children[0].children[0]
    var last_name_input = target.parentNode.parentNode.children[1].children[0]
    var date_input = target.parentNode.parentNode.children[2].children[0]

    //enable inputs
    first_name_input.disabled = true
    last_name_input.disabled = true
    date_input.disabled = true
}

//function that changes toggles the update button to done when it's clicked by user
function toggle_button(target){

    if(target.innerHTML == "Update"){
        target.innerHTML = "Done" 
    }else if(target.innerHTML == "Done"){
        disable_row(target)
        target.innerHTML = "Update"
    }
}
// ******************************************************************
// ***************** MAKE SEARCH RESULT TABLE ***********************
// ******************************************************************

//function that generates a new table body based on data returned from search query
function make_search_table(customers){

    //select the table body to add new data
    var table_body = document.getElementById('update-delete-table')

    for(i in customers){
        //create new row for each customer in customer object
        var new_row = document.createElement("tr")

        for(key of Object.keys(customers[i])){
            //collect customer_id, first name, last name, date paid values
            var name = key;
            var value = customers[i][key];
            
            //take the customer id value and make a dataset attribute
            if(key == "customer_id"){
                new_row.setAttribute("data-customer", customers[i][key])
            }
            
            //store a new td cell in new_data variable
            var new_data = make_table_data(name, value);

            //if return isn't a null (customer_id) add the cell to the row
            if(new_data){
                new_row.appendChild(new_data)
            }
            
        }

        //add update/delete buttons to each customer row
        var action_column = make_buttons();
        new_row.appendChild(action_column)

        //add the generated row to the table
        table_body.appendChild(new_row)
        
    }
}

//generate cells for the search specific customer table
function make_table_data(name,value){
    var new_data = null;

    //create a new cell for all data except for customer_id values
    if(name != "customer_id"){
        new_data = document.createElement("td");
    }

    //generate and input value using the name, value of the data
    var new_input = make_input(name,value);

    //if the generated input exists (not customer_id), add it to the td element
    if(new_input){
        new_data.appendChild(new_input);
    }

    return new_data;

}


//function responsible for generating input fields for the customer search table
function make_input(name,value){
    var type = null;
    var id = null;
    //determine type of input for each data type
    switch(name){
        case "customer_id":
            type = "id";
            break;
        case "first_name":
            var input = document.createElement("input");
            type = "text";
            id="first-name-action";
            break;
        case "last_name":
            var input = document.createElement("input");
            type = "text";
            id="last-name-action";
            break;
        case "date_paid":
            var input = document.createElement("input");
            type = "date";
            id="date-paid-action";
            value = value.slice(0,10);
            break;
    }

    //if not customer id make input and add attributes
    if(type!= null && type!= "id"){
        input.setAttribute("type", type);
        input.setAttribute("id", id);
        input.setAttribute("disabled", "true");
        input.defaultValue = value;
        return input;
    }

}

//function responsible for adding update/delete buttons to the search results table
function make_buttons(){

    //generate Action column with td and button elements
    var action_column = document.createElement("td");
    var update_button = document.createElement("button");
    var delete_button = document.createElement("button");

    //add the update button
    update_button.setAttribute("class" , "btn btn-green update-customer")
    update_button.setAttribute("type", "button")
    update_button.innerHTML = "Update"
    action_column.appendChild(update_button)

    //add the delete button
    delete_button.setAttribute("class" , "btn btn-green delete-customer")
    delete_button.setAttribute("type", "button")
    delete_button.innerHTML = "Delete" 
    action_column.appendChild(delete_button)

    return action_column;

}