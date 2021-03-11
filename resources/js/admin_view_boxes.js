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

// to add view box by date functionality

const sort_selector = document.querySelector('#select-box-date')

sort_selector.addEventListener('change', (event)=> {
    date_for_find = event.target.value
    get_box_with_details(date_for_find)
    .then(box_details => present_box(box_details))
})

function present_box(box_details) {
    console.log(box_details);
}

function get_box_with_details(box_date) {
    return new Promise(function(resolve, reject) {
        let letter = {};
        letter.box_date = box_date;
        let envelope = new XMLHttpRequest();
        envelope.open('POST','/admin-boxes-view/details',true);
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
}

