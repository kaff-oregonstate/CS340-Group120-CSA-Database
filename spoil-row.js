// spoil-row.js

const get_crop_rows_query = 'SELECT row_id, Crop_Rows.crop_id, mature_date, crop_name FROM Crop_Rows LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;';

module.exports = function(){

var express = require('express');
express().use('/source', express.static('resources')); // !!!
var router = express.Router();
var mysql = require('./resources/js/dbcon.js'); // !!!
const pool = mysql.pool;

const audits = require('./resources/js/algorithmic_auditing.js');
function audit_Boxes_Harvests() { return audits.audit_Boxes_Harvests(); }
function audit_Boxes_Customers() { return audits.audit_Boxes_Customers(); }

router.get('/', function(req, res){
    content = {
        title: 'Rubyfruit Farm – Spoil Row + Recall Harvests',
        page_name: 'spoil row + recall harvests',
        breadcrumbs: [
            {link: '/', page_name: 'home'},
            {link: '/farmer', page_name: 'farmer'}
        ]
    };
    // get the crop rows before rendering
    pool.query(
        get_crop_rows_query,
        function(err, result){
            content.crop_rows = result;
            for (i in content.crop_rows) {
                var date = new Date(content.crop_rows[i].mature_date);
                content.crop_rows[i].mature_date = Intl.DateTimeFormat('en-US').format(date);
            }
            res.render('farmer-spoil-row', content);
        }
    )
});

router.post('/try', function(req, res, next){
    var row_id = req.body.row_id;
    pool.query(
        'SELECT harvest_id, crop_name, quantity_harvested, harvest_date, expiration_date, Harvests.row_id FROM Harvests LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE Harvests.row_id = ?;',
        [row_id],
        function(err, result) {
            if (err) console.log(err);
            else {
                for (i in result) {
                    var date1 = new Date(result[i].harvest_date);
                    result[i].harvest_date = Intl.DateTimeFormat('en-US').format(date1);
                    var date2 = new Date(result[i].expiration_date);
                    result[i].expiration_date = Intl.DateTimeFormat('en-US').format(date2);
                }
                res.send(result);
            }
        }
    );
});

router.post('/do', function(req, res, next){
    var row_id = req.body.row_id;
    pool.query(
        "DELETE FROM Crop_Rows WHERE `row_id` = ?;",
        [row_id],
        function(err, result) {
            if (err) console.log(err);
            else {
                audit_Boxes_Harvests()
                res.send("good delete");
            }
        }
    );
});

return router;

}();
