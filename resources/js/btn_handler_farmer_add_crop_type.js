// btn_handler_farmer_add_crop_type.js

  //////////////////////////////////////////////////////////////////////
// this file will do the SQL for the "farmer: add new crop type" page //
//////////////////////////////////////////////////////////////////////


// on button click, INSERT and reload page
function func_INSERT_crop_types() {

    remove_notification('err_in_last_request')

    let submit_button = document.getElementById('INSERT_button');
    disable_button(submit_button);

    //-- package up name:values into JSON --//
    let new_crop_type = {};

    // crop_name
    new_crop_type.crop_name = document.getElementById('crop-type').value;
    console.log(new_crop_type.crop_name);

    // if new type is missing a name, notify the user and stop function:
    if (no_name_handler(new_crop_type)) {return;}

    //-- request to backbone --//
    // xmlrequest with values
    let envelope = new XMLHttpRequest();
    envelope.open('POST','/INSERT-crop-types',true);
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
    envelope.send(JSON.stringify(new_crop_type));
    notify_user('sending_request', "Sending Request, please wait...");
}


function no_name_handler(new_crop_type) {
    let submit_button = document.getElementById('INSERT_button');

    // no quantity and no reminder
    if (new_crop_type.quantity == '' && !document.getElementById('remind_to_count')) {
        notify_user('remind_to_count', "Please indicate the name of the new crop.");
        enable_button(submit_button);
        return 1;
    }
    // quantity and reminder
    else if (! (new_crop_type.quantity == '') && document.getElementById('remind_to_count')) {
        document.getElementById('remind_to_count').remove()
    }
    // quantity and no reminder
    else if (! (new_crop_type.quantity == '') && ! document.getElementById('remind_to_count')) {}
    // no quantity and reminder
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

