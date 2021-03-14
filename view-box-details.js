// view-box-details.js

const get_box_contents_query = "SELECT box_id, Boxes_Harvests.harvest_id, qty_per, crop_name FROM Boxes_Harvests LEFT JOIN Harvests ON Boxes_Harvests.harvest_id = Harvests.harvest_id LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE `box_id` = ?;"

const get_box_customers_query = "SELECT first_name, last_name, Customers.customer_id FROM Boxes_Customers LEFT JOIN Customers ON Boxes_Customers.customer_id = Customers.customer_id WHERE `box_id` = ?;"

module.exports = function(){

var express = require('express');
express().use('/source', express.static('resources'));
var router = express.Router();
var mysql = require('./resources/js/dbcon.js');
const pool = mysql.pool;


router.post('/date', function(req, res, next){
    let results = {}
    best_box = get_box_by_date(req.body.box_date)
    details = best_box.then(box => {
        results.box = box
        return get_box_details(box)
    })
    details.then(result => {
        var date = new Date(results.box.box_date);
        results.box.box_date = Intl.DateTimeFormat('en-US').format(date);
        results.contents = result[0]
        results.customers = result[1]
        res.send(results)
    })
});

router.post('/id', function(req, res, next){
    let results = {}
    best_box = get_box_by_id(req.body.box_id)
    details = best_box.then(box => {
        results.box = box
        return get_box_details(box)
    })
    details.then(result => {
        var date = new Date(results.box.box_date);
        results.box.box_date = Intl.DateTimeFormat('en-US').format(date);
        results.contents = result[0]
        results.customers = result[1]
        res.send(results)
    })
});

function get_box_details(box) {
    return new Promise(function(resolve, reject) {
        let data = [get_box_contents(box), get_box_customers(box)];
        Promise.all(data).then(data => {resolve(data)});
    })
}

function get_box_contents(box) {
    return new Promise(function(resolve, reject) {
        pool.query(
            get_box_contents_query,
            [box.box_id],
            function(err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
}

function get_box_customers(box) {
    return new Promise(function(resolve, reject) {
        pool.query(
            get_box_customers_query,
            [box.box_id],
            function(err, result) {
                if (err) reject(err);
                else resolve(result);
            }
        );
    })
}

function set_time_to_midnight(date) {
    var date_string = date.getFullYear() + '-';
    if ((date.getUTCMonth()+1) < 10) date_string += '0' + (date.getUTCMonth()+1) + '-';
    else date_string += (date.getUTCMonth()+1) + '-';
    if (date.getUTCDate() < 10) date_string += '0' + (date.getUTCDate());
    else date_string += (date.getUTCDate());
    date_string += 'T00:00:00.000';
    let offset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date(date_string);
    return new Date(date.getTime() - offset);
}

function get_box_by_date_helper(search_date, results) {
    var the_day = new Date(search_date);
    the_day = set_time_to_midnight(the_day);
    var best_box;
    var next_date_diff = 0;
    for (r=0; r<results.length-1; r++) {
        var box_date_1 = new Date(results[r].box_date);
        var diff_1 = Math.abs(box_date_1.valueOf() - the_day.valueOf())
        var box_date_2 = new Date(results[r+1].box_date);
        var diff_2 = Math.abs(box_date_2.valueOf() - the_day.valueOf())
        if (diff_1 < diff_2) {
            if (diff_1 < next_date_diff || next_date_diff == 0) {
                best_box = results[r];
                next_date_diff = diff_1;
            }
        } else {
            if (diff_2 < next_date_diff || next_date_diff == 0) {
                best_box = results[r+1];
                next_date_diff = diff_2;
            }
        }
    }
    return best_box;
}

function get_box_by_date(box_date) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes;",
            function(err, result){
                if (err) reject(err);
                else resolve(get_box_by_date_helper(box_date, result));
            }
        )
    });
}

function get_box_by_id(box_id) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes WHERE `box_id` = ?;",
            box_id,
            function(err, result){
                if (err) reject(err);
                else resolve(result[0]);
            }
        )
    });
}



return router;

}();
