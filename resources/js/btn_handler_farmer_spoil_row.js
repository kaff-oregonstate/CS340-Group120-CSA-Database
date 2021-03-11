// btn_handler_farmer_spoil_row.js


function func_DELETE_crop_row() {
    remove_notification('err_in_last_request')

    let submit_button = document.getElementById('INSERT_button');
    disable_button(submit_button);

    // row_id
    let row = document.getElementById('row-to-spoil');
    disable_button(row);
    console.log(row.value);

    let harvests = get_harvests_by_row(row.value)
    .then(result => prompt_for_confirmation(row.value, result))
    .catch(reason => {
        console.log("Caught failure: " + reason);
        notify_user('err_in_last_request', "Last Request failed in network, please try again.");
    });
    notify_user('sending_request', "Sending Request, please wait...");
}


function get_harvests_by_row(row_id) {
    return new Promise(function(resolve, reject) {
        let letter = {};
        letter.row_id = row_id;
        let envelope = new XMLHttpRequest();
        envelope.open('POST','/farmer-spoil-row/try',true);
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

function DELETE_crop_row(row_id) {
    return new Promise(function(resolve, reject) {
        let letter = {};
        letter.row_id = row_id;
        let envelope = new XMLHttpRequest();
        envelope.open('POST','/farmer-spoil-row/do',true);
        envelope.setRequestHeader("Content-Type", "application/json");
        envelope.addEventListener('load',function(){
            if(envelope.status >=200 && envelope.status < 400){
                // reload page
                console.log('good return!');
                resolve(envelope.responseText);
            } else {
                // log request error
                console.log("Error in network request: " + envelope.statusText)
                reject(envelope.statusText)
            }
        });
        envelope.send(JSON.stringify(letter));
    });
}


function prompt_for_confirmation(row_id, harvests) {
    remove_notification('sending_request');
    console.log(harvests);

    if (harvests.length != 0) {
        notify_user('prompt_for_confirmation', "Are you sure you want to 'spoil' (DELETE) this row of crops? This action will nullify the crop types of the following harvests:");
        create_harvest_table();
        for (h in harvests) {
            show_user_harvest(harvests[h]);
        }
    }
    else {
        notify_user('prompt_for_confirmation', "Are you sure you want to 'spoil' (DELETE) this row of crops? There are no harvests that will be affected (NULLified) for this row...");
    }

    // insert buttons
    entry_form = document.getElementsByTagName('form')[0];
    row = entry_form.appendChild(document.createElement('div'));
    row.setAttribute("class", "form-row");
    group = row.appendChild(document.createElement('div'));
    group.setAttribute("class", "form-group mb-3");
    prompt_user('confirm_button', "Yes, I'm sure.", "confirm_DELETE_crop_row(" + row_id + ")");
    prompt_user('deny_button', "Nevermind.", "cancel_DELETE_crop_row()");
}


function confirm_DELETE_crop_row(row_id) {
    console.log("we're in the confirm game now.");

    remove_notification("prompt_for_confirmation");
    remove_notification("harvest_table");
    remove_notification("confirm_button");
    remove_notification("deny_button");

    let deletion = DELETE_crop_row(row_id)
    .then(v => {
        remove_notification('sending_request');
        notify_user('success', "Good delete on row of crops.");
        entry_form = document.getElementsByTagName('form')[0];
        notification = entry_form.appendChild(document.createElement('p'));
        notification.setAttribute('id', 'instruct');
        t = document.createTextNode("Go to ");
        notification.appendChild(t);
        link = notification.appendChild(document.createElement('a'));
        // link.setAttribute("class", "text-decoration-none text-reset");
        link.setAttribute("href", "/farmer-view-produce-on-hand")
        link.innerText = "view produce on hand";
        t = document.createTextNode(" to verify NULL crop types on any linked Harvests.");
        notification.appendChild(t);
        notify_user('reload', "Page reloading in 7 seconds...");
        wait_to_reload();
    }
    )
    .catch(reason => {
        remove_notification('sending_request');
        console.error(reason);
        notify_user('err_in_last_request', "Error in last request, please try again.");
        let submit_button = document.getElementById('INSERT_button');
        let row = document.getElementById('row-to-spoil');
        enable_button(submit_button);
        enable_button(row);
    })
    notify_user('sending_request', "Sending Request, please wait...");

    //
}

function cancel_DELETE_crop_row() {
    // delete prompt_for_confirmation
    remove_notification("prompt_for_confirmation");
    remove_notification("harvest_table");
    remove_notification("confirm_button");
    remove_notification("deny_button");
    let submit_button = document.getElementById('INSERT_button');
    let row = document.getElementById('row-to-spoil');
    enable_button(submit_button);
    enable_button(row);
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


function prompt_user(button_id, button_text, button_fn) {
    form_row = document.getElementsByTagName('form')[0].lastChild;
    button = form_row.appendChild(document.createElement('input'));
    button.setAttribute('type', "button");
    button.setAttribute('class', "btn btn-green")
    button.setAttribute('id', button_id);
    button.setAttribute('onclick', button_fn);
    button.setAttribute('value', button_text);
    button.setAttribute('style', "margin-right: 1rem;")
}


function create_harvest_table() {
    entry_form = document.getElementsByTagName('form')[0];
    harvest_table = entry_form.appendChild(document.createElement('table'));
    harvest_table.setAttribute("class", "table table-sm table-light");
    harvest_table.setAttribute("id", "harvest_table");
    header = harvest_table.appendChild(document.createElement('thead'));
    header.setAttribute("class", "thead-light");
    columns = ["Crop Type:", "Qty:", "Harvest Date:", "Expiration Date:"]
    for (c in columns) {
        col = header.appendChild(document.createElement('th'));
        col.innerText = columns[c];
    }
}


function show_user_harvest(harvest) {
    harvest_table = document.getElementsByTagName('table')[0];
    harvest_row = harvest_table.appendChild(document.createElement('tr'));
    type = harvest_row.appendChild(document.createElement('td'));
    type.innerText = harvest.crop_name;
    qty = harvest_row.appendChild(document.createElement('td'));
    qty.innerText = harvest.quantity_harvested;
    harvest_date = harvest_row.appendChild(document.createElement('td'));
    harvest_date.innerText = harvest.harvest_date;
    expiration_date = harvest_row.appendChild(document.createElement('td'));
    expiration_date.innerText = harvest.expiration_date;
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
    await sleep(7000);
    location.reload(true);
}


function reload_now() {
    location.reload(true);
}

