// btn_handler_farmer_harvest_row.js

  ////////////////////////////////////////////////////////////////////
// this file will do the SQL for the "farmer: harvest new row" page //
////////////////////////////////////////////////////////////////////


// on button click, INSERT and reload page
function func_INSERT_harvests() {

    remove_notification('err_in_last_request')

    let submit_button = document.getElementById('INSERT_button');
    disable_button(submit_button);

    // package up name:values into JSON
    let new_harvest = {};

    // row_id
    new_harvest.row_id = document.getElementById('row-to-harvest').value;
    console.log(new_harvest.row_id);

    // quantity
    new_harvest.quantity = document.getElementById('quantity-harvested').value;
    console.log(new_harvest.quantity);

    // harvest_date
    var date = new Date();
    // date is tomorrow for some reason at 16:25, decrementing ***check_this***
    date.setDate(date.getDate() - 1);
    new_harvest.harvest_date = date.toISOString().substring(0,10);
    console.log(new_harvest.harvest_date);

    // expiration_date
    new_harvest.expiration_date = document.getElementById('expire-date').value;
    console.log(new_harvest.expiration_date);

    // if new row is missing a date, notify the user and stop function:
    no_quantity_flag = no_quantity_handler(new_harvest);
    if (no_quantity_flag) {return;}

    // if new row is missing a date, notify the user and stop function:
    no_date_flag = no_expiration_date_handler(new_harvest);
    if (no_date_flag) {return;}

    // request to backbone

    // xmlrequest with values
    let envelope = new XMLHttpRequest();
    envelope.open('POST','/INSERT-harvests',true);
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
    envelope.send(JSON.stringify(new_harvest));
    notify_user('sending_request', "Sending Request, please wait...");
}


function no_quantity_handler(new_harvest) {
    let submit_button = document.getElementById('INSERT_button');

    // no quantity and no reminder
    if (new_harvest.quantity == '' && !document.getElementById('remind_to_count')) {
        notify_user('remind_to_count', "Please indicate the quantity harvested.");
        enable_button(submit_button);
        return 1;
    }
    // quantity and reminder
    else if (! (new_harvest.quantity == '') && document.getElementById('remind_to_count')) {
        document.getElementById('remind_to_count').remove()
    }
    // quantity and no reminder
    else if (! (new_harvest.quantity == '') && ! document.getElementById('remind_to_count')) {}
    // no quantity and reminder
    else {
        // enable submit button
        enable_button(submit_button);
        return 1;
    }
    return 0;
}


function no_expiration_date_handler(new_harvest) {
    let submit_button = document.getElementById('INSERT_button');

    // no date and no reminder
    if (new_harvest.expiration_date == '' && !document.getElementById('remind_to_date')) {
        notify_user('remind_to_date', "Please indicate the date to harvest the planted row.");
        enable_button(submit_button);
        return 1;
    }
    // date and reminder
    else if (! (new_harvest.expiration_date == '') && document.getElementById('remind_to_date')) {
        document.getElementById('remind_to_date').remove()
    }
    // date and no reminder
    else if (! (new_harvest.expiration_date == '') && ! document.getElementById('remind_to_date')) {}
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


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function wait_to_reload() {
    await sleep(5000);
    location.reload(true);
}


function reload_now() {
    location.reload(true);
}

