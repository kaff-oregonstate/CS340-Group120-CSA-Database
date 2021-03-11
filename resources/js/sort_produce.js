// sort_produce.js

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
const sort_selector = document.querySelector('#sort-by')

let first_sort = true

sort_selector.addEventListener('change', (event)=> {
    type_of_sort = event.target.value;
    if (type_of_sort == "Harvest Date") {
        sort_by('date1')
    }
    else if (type_of_sort == "Expiration Date") {
        sort_by('date2')
    }
    else if (type_of_sort == "Crop Type") {
        sort_by('crop')
    }
    else console.log("no sort")
});

function sort_by(type) {
    rows = get_the_rows()
    // if (first_sort) {
    rows = sort_the_rows(rows, type)
    wipe_the_rows()
    paste_the_rows(rows)

    if (first_sort) {
        first_sort = false
    }
}


function paste_the_rows(rows) {
    let properties = ["harvest_id", "crop_name", "quantity", "harvest_date", "expiration_date"]
    table = document.getElementsByTagName('table')[0]
    let tbody = table.appendChild(document.createElement('tbody'))
    for (r in rows) {
        row = tbody.appendChild(document.createElement('tr'))
        for (p in properties) {
            data = row.appendChild(document.createElement('td'))
            if (p < 1) data.setAttribute('hidden', '')
            data.setAttribute('name', properties[p])
            data.innerText = rows[r][properties[p]]
        }
    }
}


function wipe_the_rows() {
    document.getElementsByTagName('tbody')[0].remove()
}


function sort_the_rows(rows, type) {
    if (type == 'date1') {
        return rows.sort(compare_rows_by_date_1)
    }
    else if (type == 'date2') {
        return rows.sort(compare_rows_by_date_2)
    }
    return rows.sort(compare_rows_by_crop)
}


function get_the_rows() {
    let tbody = document.getElementsByTagName('tbody')[0]
    // let properties = ["", "row_id", "", "crop_id", "", "crop_name", "", "mature_date"]
    let properties = []
    if (first_sort) properties = ["", "harvest_id", "", "crop_name", "", "quantity", "", "harvest_date", "", "expiration_date"]
    else properties = ["harvest_id", "crop_name", "quantity", "harvest_date", "expiration_date"]
    let rows = []
    for (t = 0; t < tbody.childNodes.length; t++) {
        if (!first_sort || t % 2 == 1) {
        console.log(tbody.childNodes[t]);
        // if (t % 2 == 1) {
        let row = {}
        for (i in properties) {
            if (!first_sort || i % 2 == 1) {
            // console.log(tbody.childNodes[t].childNodes[i]);
            // if (first_sort)
            row[properties[i]] = tbody.childNodes[t].childNodes[i].innerText
            // }
            }
        }
        rows.push(row)
        }
    }
    return rows
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function compare_rows_by_date_1(a, b) {
    a_date = new Date(a.harvest_date)
    b_date = new Date(b.harvest_date)
    if (a_date < b_date) {
        return -1
    }
    if (a_date > b_date) {
        return 1
    }
    // a must be equal to b
    return 0
}

function compare_rows_by_date_2(a, b) {
    a_date = new Date(a.expiration_date)
    b_date = new Date(b.expiration_date)
    if (a_date < b_date) {
        return -1
    }
    if (a_date > b_date) {
        return 1
    }
    // a must be equal to b
    return 0
}

function compare_rows_by_crop(a,b) {
    if (a.crop_name < b.crop_name) return -1
    if (a.crop_name > b.crop_name) return 1
    return 0
}
