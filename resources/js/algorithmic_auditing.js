// algorithmic_auditing.js

var mysql = require('./dbcon.js');
const pool = mysql.pool;

function get_next_box_helper(results) {
    var today = get_the_correct_today();
    var next_box;
    var next_box_date = 0;
    for (r in results) {
        var box_date = new Date(results[r].box_date);
        if (box_date.valueOf() > today.valueOf()) {
            if (box_date.valueOf() < next_box_date.valueOf() || next_box_date == 0) {
                next_box = results[r];
                next_box_date = box_date;
            }
        }
    }
    return next_box;
}


function get_next_box() {
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes",
            function(err, result){
                if (err) reject(err);
                else resolve(get_next_box_helper(result));
            }
        )
    });
}


function get_relevant_harvests(next_box) {
    return new Promise(function(resolve, reject) {
        var date = new Date(next_box.box_date);
        date = new Date(date.valueOf() + (14 * 24 * 60 * 60 * 1000));
        harvest_finalizer_date = `'` + date.toISOString().substring(0,10) + `'`;
        // console.log(`Distribution of Harvests expiring b4 ${harvest_finalizer_date} is finalized, don't update.`);
        pool.query(
            "SELECT * FROM Harvests WHERE expiration_date >= " + harvest_finalizer_date,
            function(err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
}


function get_customer_counts(relevant_boxes) {
    // console.log(relevant_boxes);
    customer_counts = relevant_boxes.map(box =>
        {return new Promise(function(resolve, reject) {
            pool.query(
                "SELECT Count(*) AS number_of_customers FROM Boxes_Customers WHERE box_id = " + box.box_id + ";",
                function(err, result) {
                    if (err) reject(err);
                    else {resolve(result[0].number_of_customers);}
                }
            );
        });}
    );
    return Promise.all(customer_counts).then(counts => {return counts})
}


function parse_boxes_for_dist(boxes, qty_left) {
    // console.log(`boxes in parse_boxes_for_dist`);
    // console.log(boxes);
    var today = get_the_correct_today();
    today = today.valueOf();
    let linked_box_ids = [];
    for (b in boxes) {
        var box_date = new Date(boxes[b].box_date);
        box_date = box_date.valueOf();
        if (box_date > today + (7 * 24 * 60 * 60 * 1000)) {
            // console.log('one box bigger than today + 7');
            linked_box_ids.push(boxes[b].box_id);
        }
        else if (box_date >= today) {
            // console.log('one box bigger than today but smaller than today + 7');
            let allocated = boxes[b].qty_per * (boxes[b].number_of_customers - boxes[b].number_packed);
            qty_left -= allocated;
        }
        // else console.log('one box smaller than today');
    }
    return [linked_box_ids, qty_left];
}


function get_boxes_in_window(expiration_date) {
    // console.log(`getting boxes in window for ${expiration_date.toISOString().substring(0,10)}`);
    let today = get_the_correct_today();
    let date0 = new Date(today.getTime() + (8 * 24 * 60 * 60 * 1000));
    date0 = `'` + date0.toISOString().substring(0,10) + `'`;
    // console.log(date0);
    expiration_date = new Date(expiration_date);
    let date1 = new Date(expiration_date.getTime() - (8 * 24 * 60 * 60 * 1000));
    date1 = `'` + date1.toISOString().substring(0,10) + `'`;
    // console.log(date1);
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes WHERE box_date BETWEEN " + date0 + " AND " + date1 + ";",
            function(err, result) {
                if (err) reject(err);
                else {
                    // console.log(`boxes for ${expiration_date.toISOString().substring(0,10)}`);
                    // console.log(result);
                    resolve(result);
                }
            }
        );
    });
}


function upd_B_H(box, harvest, qty_per) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "UPDATE Boxes_Harvests SET `qty_per` = ? WHERE `box_id` = ? AND `harvest_id` = ?",
            [qty_per, box, harvest],
            function (err, result) {
                if(err) reject(err);
                else resolve(result);
            }
        );
    });
}

function add_B_H(box, harvest, qty_per) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "INSERT INTO Boxes_Harvests (`box_id`, `harvest_id`, `qty_per`) VALUE (?,?,?)",
            [box, harvest, qty_per],
            function (err, result) {
                if(err) reject(err);
                else resolve(result);
            }
        );
    });
}

function rmv_B_H(box, harvest) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "DELETE FROM Boxes_Harvests WHERE `box_id` = ? AND `harvest_id` = ?;",
            [box, harvest],
            function (err, result) {
                if(err) reject(err);
                else resolve(result);
            }
        );
    });
}


function audit_B_H_for_harvest(harvest, box_ids_and_qty_left) {
    let qty_left = box_ids_and_qty_left[1];
    let linked_box_ids = box_ids_and_qty_left[0];
    let harvest_id = harvest.harvest_id;
    // console.log(`box_ids_and_qty_left in audit for harvest ${harvest_id}`);
    // console.log(box_ids_and_qty_left);
    // console.log(`qty_left in audit for harvest ${harvest_id}`);
    // console.log(qty_left);


    let got_boxes = get_boxes_in_window(harvest.expiration_date);
    got_boxes.then(boxes => {
        // console.log(`boxes`);
        // console.log(boxes);
        counted_boxes = get_customer_counts(boxes);
        counted_boxes.then( counts => {
            // console.log(`==-==-==-==-==`);
            // console.log(`for harvest ${harvest.harvest_id}`);
            // console.log(`--=--=--=--=--`);
            // console.log(`counts`);
            // console.log(counts);
            let boxes_to_serve = counts.reduce((a, b) => a + b, 0);
            // console.log(`boxes_to_serve`);
            // console.log(boxes_to_serve);
            if (boxes_to_serve == 0) return;
            let base_amount = Math.floor(qty_left/boxes_to_serve);
            // console.log(`base_amount`);
            // console.log(base_amount);
            // console.log(`qty_left before base_amount_served reduction`);
            // console.log(qty_left);
            qty_left -= base_amount * boxes_to_serve;
            // console.log(`after`);
            // console.log(qty_left);
            for (b in boxes) {
                if (linked_box_ids.includes(boxes[b].box_id)) {
                    removeItemOnce(linked_box_ids, boxes[b].box_id);
                    if (qty_left > counts[b]) {
                        upd_B_H(boxes[b].box_id, harvest_id, base_amount + 1);
                    } else {
                        upd_B_H(boxes[b].box_id, harvest_id, base_amount)
                    }
                } else {
                    if (qty_left > counts[b]) {
                        add_B_H(boxes[b].box_id, harvest_id, base_amount + 1);
                    } else {
                        add_B_H(boxes[b].box_id, harvest_id, base_amount)
                    }
                }
            }
            for (l in linked_box_ids) {
                rmv_B_H(linked_box_ids[l], harvest_id);
            }
        })
    })
}


function get_relevant_boxes_with_counts(harvest) {   //*** rename ***
    let qty_left = harvest.quantity_harvested - harvest.quantity_distributed;
    // console.log(`qty_left for harvest ${harvest.harvest_id}`);
    // console.log(qty_left);
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT Boxes_Harvests.box_id, box_date, number_packed, qty_per FROM Boxes_Harvests LEFT JOIN Boxes ON Boxes_Harvests.box_id = Boxes.box_id WHERE harvest_id = " + harvest.harvest_id + ";",
            function(err, result) {
                if (err) reject(err);
                else if (result.length == 0) {
                    audit_B_H_for_harvest(harvest, [[],qty_left]);
                    resolve([]);
                }
                else {
                    count = get_customer_counts(result);
                    count.then(value => {
                        for (r in result) {
                            result[r].number_of_customers = value[r];
                        }
                        // console.log(`results after customer counts for harvest ${harvest.harvest_id}`);
                        // console.log(result);
                        let box_ids_and_qty_left = parse_boxes_for_dist(result, qty_left);
                        // console.log(`res of parser for harvest ${harvest.harvest_id}`);
                        // console.log(box_ids_and_qty_left);
                        audit_B_H_for_harvest(harvest, box_ids_and_qty_left);
                        resolve();
                    });
                }
            }
        );
    });
}


const audit_Boxes_Harvests = () => {
    let next_box = get_next_box();
    let relevant_harvests = next_box.then(value => get_relevant_harvests(value));

    let update_return_code = relevant_harvests.then(harvests => {
        distribution_updates = harvests.map(harvest => {
            return get_relevant_boxes_with_counts(harvest);
        });
        return Promise.all(distribution_updates).then(statuses => {return statuses})
    });

    // update_return_code.then(value => console.log(value));
}

// audit_Boxes_Harvests();




function add_B_C(box, customer) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "INSERT INTO Boxes_Customers (box_id,customer_id) VALUES (?, ?);",
            [box, customer],
            function (err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        )
    });
}

function rmv_B_C(box, customer) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "DELETE FROM Boxes_Customers WHERE `box_id` = ? AND `customer_id` = ?;",
            [box, customer],
            function (err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        )
    });
}

function update_B_C_on_customer(customer, boxes) {
    var date_paid = new Date(customer.date_paid);
    date_paid = date_paid.valueOf();
    for (b in boxes) {
        var box_date = new Date(boxes[b].box_date);
        box_date = box_date.valueOf();
        if (date_paid > box_date) {
            if (boxes[b].linked_customers.includes(customer.customer_id)) {
                continue;
            } else {
                add_B_C(boxes[b].box_id, customer.customer_id);
                continue;
            }
        }
        else {
            if (boxes[b].linked_customers.includes(customer.customer_id)) {
                rmv_B_C(boxes[b].box_id, customer.customer_id);
                continue;
            } else {
                continue;
            }
        }
    }
}

function get_relevant_customers() {
    date = new Date();
    today = `'` + date.toISOString().substring(0,10) + `'`;
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Customers WHERE date_paid > " + today + ";",
            function(err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
}

function get_boxes_B_C_links(boxes) {
    customer_links = boxes.map(box =>
        {return new Promise(function(resolve, reject) {
            pool.query(
                "SELECT customer_id FROM Boxes_Customers WHERE box_id = " + box.box_id + ";",
                function(err, result) {
                    if (err) reject(err);
                    else {
                        linked_customers = [];
                        for (r in result) {
                            linked_customers.push(result[r].customer_id);
                        }
                        resolve(linked_customers);
                    }
                }
            );
        });}
    );
    return Promise.all(customer_links).then(customers => {return customers})
}

function get_relevant_boxes() {
    let date = get_the_correct_today();
    let today = `'` + date.toISOString().substring(0,10) + `'`;
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes WHERE box_date > " + today + ";",
            function(err, result) {
                if (err) reject(err);
                else {
                    links = get_boxes_B_C_links(result);
                    links.then(value => {
                        for (r in result) {
                            result[r].linked_customers = value[r];
                        }
                        resolve(result)
                    });
                }
            }
        );
    });
}

const audit_Boxes_Customers = () => {
    let data = [get_relevant_boxes(), get_relevant_customers()];
    Promise.all(data).then(data => {
        for (customer in data[1]) {
            update_B_C_on_customer(data[1][customer], data[0]);
        }
    });
}

// audit_Boxes_Customers();



const get_the_correct_today = () => {
    let date = new Date();
    let offset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offset);
}


function zzz(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep() {
    await zzz(2000);
}
async function slep() {
    await zzz(200);
}

// stackoverflow_5767325
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const gnb = () => {
    return get_next_box();
}

module.exports = {
    audit_Boxes_Harvests: audit_Boxes_Harvests,
    audit_Boxes_Customers: audit_Boxes_Customers,
    get_the_correct_today: get_the_correct_today,
    get_next_box: gnb,
    get_customer_counts: get_customer_counts
};
