// sort_rows.js

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
const sort_selector = document.querySelector('#sort-by')

let first_sort = true

sort_selector.addEventListener('change', (event)=> {
    type_of_sort = event.target.value;
    if (type_of_sort == "Date to Harvest") {
        sort_by('date')
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
    let properties = ["row_id", "crop_id", "crop_name", "mature_date"]
    table = document.getElementsByTagName('table')[0]
    let tbody = table.appendChild(document.createElement('tbody'))
    for (r in rows) {
        row = tbody.appendChild(document.createElement('tr'))
        for (p in properties) {
            data = row.appendChild(document.createElement('td'))
            if (p < 2) data.setAttribute('hidden', '')
            data.setAttribute('name', properties[p])
            data.innerText = rows[r][properties[p]]
        }
    }
}


function wipe_the_rows() {
    document.getElementsByTagName('tbody')[0].remove()
}


function sort_the_rows(rows, type) {
    if (type == 'date') {
        return rows.sort(compare_rows_by_date)
    }
    return rows.sort(compare_rows_by_crop)
}


function get_the_rows() {
    let tbody = document.getElementsByTagName('tbody')[0]
    // let properties = ["", "row_id", "", "crop_id", "", "crop_name", "", "mature_date"]
    let properties = []
    if (first_sort) properties = ["", "row_id", "", "crop_id", "", "crop_name", "", "mature_date"]
    else properties = ["row_id", "crop_id", "crop_name", "mature_date"]
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
function compare_rows_by_date(a, b) {
    a_date = new Date(a.mature_date)
    b_date = new Date(b.mature_date)
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
