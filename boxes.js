// boxes.js

var express = require('express');
var router = express.Router();

var mysql = require('./resources/js/dbcon.js');
const pool = mysql.pool;

const audits = require('./resources/js/algorithmic_auditing.js');
function get_the_correct_today() { return audits.get_the_correct_today(); }
function audit_Boxes_Harvests() { return audits.audit_Boxes_Harvests(); }
function audit_Boxes_Customers() { return audits.audit_Boxes_Customers(); }
function get_customer_counts(boxes) {return audits.get_customer_counts(boxes); }


// ~~~~~~~~ BOXES SQL QUERIES ~~~~~~~~~~~~

const get_box_contents_query = "SELECT box_id, Boxes_Harvests.harvest_id, qty_per, crop_name FROM Boxes_Harvests LEFT JOIN Harvests ON Boxes_Harvests.harvest_id = Harvests.harvest_id LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE `box_id` = ?;"
const pack_boxes_query = "UPDATE Boxes SET `number_packed` = ? WHERE `box_id` = ?;"


// ~~~~~~~~ ROUTES IN BOXES ~~~~~~~~~~~~

// route for box packer page
router.get('/box-packer', func_box_packer);


// -----BOX PACKING PAGE ROUTES-----

// GET BOX CONTENTS
function func_box_packer(req, res){
    content = {
        title: 'Rubyfruit Farm – Box Packer',
        page_name: 'box packer',
        breadcrumbs: [
            {link: '/', page_name: 'home'}
        ]
    };
    audit_Boxes_Customers();
    audit_Boxes_Harvests();
    get_closest_box(get_the_correct_today()).then(current_box => {
    // get_closest_box(new Date('2021-06-04')).then(current_box => {
        content.box_details = current_box;
        get_customer_counts([current_box])
        .then(counts => {
            content.number_of_boxes = counts[0] - current_box.number_packed;
            if (content.number_of_boxes == 1) content.singular = "yup";
            if (content.number_of_boxes < 1) {
                content.number_of_boxes = "No";
                content.no_boxes = "double no?"
            }
            pool.query(
                get_box_contents_query,
                [current_box.box_id],
                function(err, result){
                    if (err) {console.log(err); return;}
                    content.box_contents = result;
                    res.render('box-packer', content);
                }
            );
        })
    })
}

// UPDATE BOXES
router.post('/pack-boxes', func_pack_boxes);
function func_pack_boxes(req, res, next) {
    var box = req.body.box_id;
    var qty = req.body.quantity;
    pool.query(
        pack_boxes_query,
        [qty, box],
        function(err, result){
            if(err){
                res.type('text/plain');
                res.status(401);
                res.send('401 - bad INSERT');
                console.log(err);
                return;
            }
            // on return, send good response back
            res.type('text/plain');
            res.status(200);
            res.send('200 - good INSERT');
        }
    )
}

//======================================================================//

module.exports = router;

//======================================================================//


// EXTRA BACKEND FUNCTIONS FOR BOX PACKER

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

function get_closest_box_helper(results, date) {
    date = set_time_to_midnight(date);
    var next_box;
    var next_box_date = 0;
    for (r in results) {
        var box_date = new Date(results[r].box_date);
        offset = box_date.getTimezoneOffset() * 60 * 1000;
        box_date = new Date(box_date.getTime() - offset);
        if (box_date.valueOf() >= date.valueOf()) {
            if (box_date.valueOf() < next_box_date.valueOf() || next_box_date == 0) {
                next_box = results[r];
                next_box_date = box_date;
            }
        }
    }
    return next_box;
}

function get_closest_box(date) {
    return new Promise(function(resolve, reject) {
        pool.query(
            "SELECT * FROM Boxes",
            function(err, result){
                if (err) reject(err);
                else resolve(get_closest_box_helper(result, date));
            }
        )
    });
}
