// btn_handler_farmer_plant_new_row.js

  //////////////////////////////////////////////////////////////////
// this file will do the SQL for the "farmer: plant new row" page //
//////////////////////////////////////////////////////////////////


// on button click, INSERT and reload page
function func_INSERT_crop_rows() {

    remove_notification('err_in_last_request')

    let submit_button = document.getElementById('INSERT_button');
    disable_button(submit_button);

    // package up name:values into JSON
    let new_row = {};

    // crop_id
    new_row.crop_id = document.getElementById('crop-type').value;
    console.log(new_row.crop_id);

    // mature_date
    new_row.mature_date = document.getElementsByName('date-to-harvest')[0].value;
    console.log(new_row.mature_date);

    // if new row is missing a date, notify the user and stop function:
    no_date_flag = no_date_handler(new_row);
    if (no_date_flag) {return;}


    // two requests (nested):
        // first to backbone so INSERT can be made
        // second to /farmer-plant-new-row just reloading page

    // request to backbone

    // xmlrequest with values
    let envelope = new XMLHttpRequest();
    envelope.open('POST','/INSERT-crop-rows',true);
    envelope.setRequestHeader("Content-Type", "application/json");

    // add listener
    envelope.addEventListener('load',function(){
        if(envelope.status >=200 && envelope.status < 400){
            // reload page
            console.log('good return!');
            remove_notification('sending_request');
            notify_user('good_return', "Request processed successfully!")
            wait_to_reload();

        } else {
            // log request error
            console.log("Error in network request: " + envelope.statusText)
            enable_button(submit_button);
            remove_notification('sending_request');
            notify_user('err_in_last_request', "Last Request failed in network, please try again.")
            return
        }
    });
    envelope.send(JSON.stringify(new_row));
    notify_user('sending_request', "Sending Request, please wait...");

}

function no_date_handler(new_row) {
    let submit_button = document.getElementById('INSERT_button');

    // no date and no reminder
    if (new_row.mature_date == '' && !document.getElementById('remind_to_date')) {
        notify_user('remind_to_date', "Please indicate the date to harvest the planted row.");
        enable_button(submit_button);
        return 1;
    }
    // date and reminder
    else if (! (new_row.name == '') && document.getElementById('remind_to_date')) {
        document.getElementById('remind_to_date').remove()
    }
    // date and no reminder
    else if (! (new_row.name == '') && ! document.getElementById('remind_to_date')) {}
    // no date and reminder
    else {
        // enable submit button
        enable_button(submit_button);
        return 1;
    }
    return 0;
}

function disable_button(submit_button) {
    submit_button.setAttribute('disabled','');
}

function enable_button(submit_button) {
    submit_button.removeAttribute('disabled');
}

function notify_user(notification_id, notification_text) {
    entry_form = document.getElementsByTagName('form')[0];
    notification = entry_form.appendChild(document.createElement('p'));
    notification.setAttribute('id', notification_id);
    notification.innerText = notification_text;
}

function remove_notification(notification_id){
    if (document.getElementById(notification_id)) {
        document.getElementById(notification_id).remove()
    }
}

function addEntry(){



    // xmlrequest with values
    let envelope = new XMLHttpRequest();
    envelope.open('POST','/addEntry',true);
    envelope.setRequestHeader("Content-Type", "application/json");

    // add listener
    envelope.addEventListener('load',function(){
        if(envelope.status >=200 && envelope.status < 400){
            // remake table
            let response = JSON.parse(envelope.responseText);
            remakeTable(response);

            // clear values in input form
                document.getElementsByName('name')[0].value = '';
                document.getElementsByName('reps')[0].value = 12;
                document.getElementsByName('weight')[0].value = 10.0;
                document.getElementsByName('date')[0].value = '';
        } else {
            // log request error
            console.log("Error in network request: " + envelope.statusText)
            // enable submit button
            submit_button.removeAttribute('disabled')
            return
        }
    });
    envelope.send(JSON.stringify(new_row));
}

// sleep?
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function wait_to_reload() {
    await sleep(5000);
    location.reload(true);
}
// async function demo() {
//     await sleep(2000);
// }
// demo();
