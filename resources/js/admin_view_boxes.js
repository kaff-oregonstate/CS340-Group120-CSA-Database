// name: admin_update_customer.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin update customer handlebars

// const baseUrl = 'http://flip3.engr.oregonstate.edu:3891/'
// const baseUrl = "http://localhost:28394/";

// ///////////////////////
//      ADMIN PAGE
// ///////////////////////

// *********************************
// ***** View & Add Boxes **********
// *********************************

async function get_boxes(){
        //create a request object
        let xhr = new XMLHttpRequest();
        //specify route/page that will handle request

            //when server responds
    xhr.onload = function(){
        if(xhr.status === 200){
            console.log("in onload");

        }
    };

    //prepare request using open(http method, url of page, boolean value for async)
    xhr.open('GET','/admin-boxes-view', true);
    xhr.send(null);

}


document.querySelector('#add-box').onclick = add_box;

async function add_box(event){
    //generate payload with new customer input
    var payload = {};
    payload.box_date = document.getElementById('box-date').value

    // console.log(payload)

    //check that user has filled out all inputs in add customer form
    if(isError(payload)){
        console.log("ERROR IN PAYLOAD--new box")
        $("#add-cust-error").html("Please fill out all the fields before submitting");
        return
    }

    //create a request object
    let xhr = new XMLHttpRequest();
    //specify route/page that will handle request
    xhr.open('POST','/INSERT-box', true);

    //tell server it will be receiving JSON
    xhr.setRequestHeader('Content-Type','application/json')

    xhr.addEventListener('load', function(){
        if(xhr.status >= 200 && xhr.status < 400){
            console.log("inside load event listener-new box!");
            alert("New box added successfully!")

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



// by david

function populate_box_modal(box_details) {
    console.log(box_details)
    let box_modal_header = document.getElementById('box_details_modal_label')
    box_modal_header.innerText = `Box for week of ${box_details.box.box_date}`

    let box_details_1 = document.getElementById('box_details_col_num_packed')
    while (box_details_1.childNodes[0]) box_details_1.childNodes[0].remove()

    var number_packed = document.createElement('h4')
    number_packed.innerText = `Number of boxes packed: ${box_details.box.number_packed}`
    box_details_1.appendChild(number_packed)

    let box_details_2 = document.getElementById('box_details_row')
    while (box_details_2.childNodes[0]) box_details_2.childNodes[0].remove()

    var col1 = document.createElement('div')
    col1.setAttribute('class', 'col-md-6')
    let contents_col = box_details_2.appendChild(col1)
    var head_1 = document.createElement('h4')
    head_1.innerText = "Box Contents:"
    contents_col.appendChild(head_1)
    var list_1 = document.createElement('ul')
    let contents_list = contents_col.appendChild(list_1)
    let contents = box_details.contents
    for (c in contents) {
        row = document.createElement('li')
        row.innerText = `${contents[c].qty_per} ${contents[c].crop_name}`
        contents_list.appendChild(row)
    }

    var col2 = document.createElement('div')
    col2.setAttribute('class', 'col-md-6')
    let customers_col = box_details_2.appendChild(col2)
    var head_2 = document.createElement('h4')
    head_2.innerText = "Customers Receiving This Box:"
    customers_col.appendChild(head_2)
    var list_2 = document.createElement('ul')
    let customers_list = customers_col.appendChild(list_2)
    let customers = box_details.customers
    for (c in customers) {
        row = document.createElement('li')
        row.innerText = `${customers[c].first_name} ${customers[c].last_name}`
        customers_list.appendChild(row)
    }
}

function present_box() {
    $('#box_details_modal').modal()
}

function hide_box() {

}

// view box by date functionality

const date_input = document.querySelector('#select-box-date')

function get_box_with_details_by_date() {
    box_date = date_input.value
    box_with_details = new Promise(function(resolve, reject) {
        let letter = {};
        letter.box_date = box_date;
        let envelope = new XMLHttpRequest();
        envelope.open('POST','/admin-boxes-view/details/date',true);
        envelope.setRequestHeader("Content-Type", "application/json");
        envelope.addEventListener('load',function(){
            if(envelope.status >=200 && envelope.status < 400){
                // reload page
                console.log('good return!');
                resolve(JSON.parse(envelope.responseText));
            } else {
                // log request error
                console.log("Error in network request: " + envelope.statusText)
                reject(envelope.statusText)
            }
        });
        envelope.send(JSON.stringify(letter));
    });
    load_details = box_with_details.then(box_details => populate_box_modal(box_details))
    load_details.then(b => present_box())
}

// view box by id functionality

const id_select = document.querySelector('#select-box-id')

function get_box_with_details_by_id() {
    box_id = id_select.value
    box_with_details = new Promise(function(resolve, reject) {
        let letter = {};
        letter.box_id = box_id;
        let envelope = new XMLHttpRequest();
        envelope.open('POST','/admin-boxes-view/details/id',true);
        envelope.setRequestHeader("Content-Type", "application/json");
        envelope.addEventListener('load',function(){
            if(envelope.status >=200 && envelope.status < 400){
                // reload page
                console.log('good return!');
                resolve(JSON.parse(envelope.responseText));
            } else {
                // log request error
                console.log("Error in network request: " + envelope.statusText)
                reject(envelope.statusText)
            }
        });
        envelope.send(JSON.stringify(letter));
    });
    load_details = box_with_details.then(box_details => populate_box_modal(box_details))
    load_details.then(b => present_box())
}
