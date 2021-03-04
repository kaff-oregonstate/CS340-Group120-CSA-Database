// name: btn_handler_box_packer.js, creator: Amelia Walsh, date: 1/31/21
// handles buttons within the admin handlebars pages

// edited 3/3/21 - David Kaff

function boxes_packed() {
    remove_notification('err_in_last_request')

    let submit_button = document.getElementById('INSERT_button');
    disable_button(submit_button);

    //-- package up name:values into JSON --//
    let new_packing = {};

    // box_id
    new_packing.box_id = document.getElementById('box-id').innerText;
    console.log(`box_id = ${new_packing.box_id}`);

    // quantity
    just_packed = document.getElementById('quantity-packed').value;
    console.log(`just_packed = ${just_packed}`);
    already_packed = document.getElementById('number-already-packed').innerText;
    console.log(`already_packed = ${already_packed}`);
    new_packing.quantity = parseInt(just_packed) + parseInt(already_packed);
    console.log(`quantity = ${new_packing.quantity}`);


    // if new harvest is missing a quantity, notify the user and stop function:
    if (no_quantity_handler(just_packed)) {return;}

    //-- request to backbone --//
    // xmlrequest with values
    let envelope = new XMLHttpRequest();
    envelope.open('POST','/pack-boxes',true);
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
    envelope.send(JSON.stringify(new_packing));
    notify_user('sending_request', "Sending Request, please wait...");
}

function no_quantity_handler(just_packed) {
    let submit_button = document.getElementById('INSERT_button');

    // no quantity and no reminder
    if (just_packed == '' && !document.getElementById('remind_to_count')) {
        notify_user('remind_to_count', "Please indicate the quantity of boxes packed.");
        enable_button(submit_button);
        return 1;
    }
    // quantity and reminder
    else if (! (just_packed == '') && document.getElementById('remind_to_count')) {
        document.getElementById('remind_to_count').remove()
    }
    // quantity and no reminder
    else if (! (just_packed == '') && ! document.getElementById('remind_to_count')) {}
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

