var express = require('express');
var router = express.Router();

var mysql = require('./resources/js/dbcon.js');
const pool = mysql.pool;

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  // ~~~~~~~~ ADMIN SQL QUERIES ~~~~~~~~~~~~
  const get_crop_types_query = 'SELECT crop_name, crop_id FROM Crop_Types;';
  const add_crop_row_query = "INSERT INTO Crop_Rows (`crop_id`, `mature_date`) VALUES (?, ?);";
  const get_crop_rows_query = 'SELECT row_id, Crop_Rows.crop_id, mature_date, crop_name FROM Crop_Rows LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;';
  const add_harvest_query = "INSERT INTO Harvests (`row_id`, `quantity_harvested`, `harvest_date`, `expiration_date`) VALUES (?, ?, ?, ?);";
  const get_harvests_query = 'SELECT harvest_id, crop_name, quantity_harvested, harvest_date, expiration_date, Harvests.row_id FROM Harvests LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;';
  const add_crop_type_query = "INSERT INTO Crop_Types (`crop_name`) VALUES (?);"

// ~~~~~~~~ ROUTES IN FARMER ~~~~~~~~~~~~

//routes for farmer and planting pages
router.get('/farmer', funcFarmer);
router.get('/farmer/plant-new-row', func_farmer_new_crop_rows);
router.get('/farmer/harvest-new-row', func_farmer_new_harvest);
router.get('/farmer/view-planted-rows', func_farmer_view_rows);
router.get('/farmer/view-produce-on-hand', func_farmer_view_produce);
router.get('/farmer/add-new-crop-type', func_add_new_crop_type)

// -----FARMING MENU PAGE ROUTE-----
function funcFarmer(req, res){
    content = {
        title: 'Rubyfruit Farm – Farmer',
        page_name: 'farmer',
        breadcrumbs: [
            {link: '/', page_name: 'home'}
        ]
    };
    res.render('farmer', content);
}

// -----FARMER PLANT ROW PAGE ROUTES-----

//GET CROP TYPES
function func_farmer_new_crop_rows(req, res){
    content = {
        title: 'Rubyfruit Farm – Track Newly Planted Row',
        page_name: 'plant new row',
        breadcrumbs: [
            {link: '/', page_name: 'home'},
            {link: '/farmer', page_name: 'farmer'}
        ]
    };
    // get the crop type names before rendering
    pool.query(
        get_crop_types_query,
        function(err, result){
            content.crop_types = result;
            res.render('farmer-plant-new-row', content);
        }
    )
}

//INSET CROP ROW
router.post('/INSERT-crop-rows', func_INSERT_crop_rows);
function func_INSERT_crop_rows(req, res, next) {
    var {crop_id, mature_date} = req.body;
    pool.query(
        add_crop_row_query,
        [crop_id, mature_date],
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


// -----FARMER HARVEST ROW PAGE ROUTE-----

//GET CROP ROWS
function func_farmer_new_harvest(req, res){
    content = {
        title: 'Rubyfruit Farm – Enter Row Harvested',
        page_name: 'harvest new row',
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
            res.render('farmer-harvest-new-row', content);
        }
    )
}

//INSERT HARVEST
router.post('/INSERT-harvests', func_INSERT_harvests);
function func_INSERT_harvests(req, res, next) {
    var {row_id, quantity, harvest_date, expiration_date} = req.body;
    pool.query(
        add_harvest_query,
        [row_id, quantity, harvest_date, expiration_date],
        function(err, result){
            if(err){
                res.type('text/plain');
                res.status(401);
                res.send('401 - bad INSERT');
                console.log(err);
                return;
            }
            audit_Boxes_Harvests();
            // on return, send good response back
            res.type('text/plain');
            res.status(200);
            res.send('200 - good INSERT');
        }
    )
}


// -----FARMER VIEW PLANTED ROW PAGE ROUTE-----

//GET CROP ROWS
function func_farmer_view_rows(req, res){
    content = {
        title: 'Rubyfruit Farm – View Rows',
        page_name: 'view planted rows',
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
            res.render('farmer-view-planted-rows', content);
        }
    )
}


// -----FARMER VIEW PRODUCE ON HAND PAGE ROUTE-----

//GET HARVESTS
function func_farmer_view_produce(req, res){
    content = {
        title: 'Rubyfruit Farm – View Produce',
        page_name: 'view produce on hand',
        breadcrumbs: [
            {link: '/', page_name: 'home'},
            {link: '/farmer', page_name: 'farmer'}
        ]
    };
    // get the harvests before rendering
    pool.query(
        get_harvests_query,
        function(err, result){
            content.harvests = result;
            for (i in content.harvests) {
                var date1 = new Date(content.harvests[i].harvest_date);
                content.harvests[i].harvest_date = Intl.DateTimeFormat('en-US').format(date1);
                var date2 = new Date(content.harvests[i].expiration_date);
                content.harvests[i].expiration_date = Intl.DateTimeFormat('en-US').format(date2);
                if (content.harvests[i].row_id == null) content.harvests[i].nulled = 'true';
            }
            res.render('farmer-view-produce-on-hand', content);
        }
    )
}


// -----FARMER ADD NEW CROP TYPE PAGE ROUTE-----

function func_add_new_crop_type(req, res){
    content = {
        title: 'Rubyfruit Farm – Add Crop Type',
        page_name: 'add new crop type',
        breadcrumbs: [
            {link: '/', page_name: 'home'},
            {link: '/farmer', page_name: 'farmer'}
        ]
    };
    res.render('farmer-add-new-crop-type', content);
}

//INSERT CROP TYPES
router.post('/INSERT-crop-types', func_INSERT_crop_types);
function func_INSERT_crop_types(req, res, next) {
    var {crop_name} = req.body;
    pool.query(
        add_crop_type_query,
        [crop_name],
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

// -----FARMER SPOIL AND RECALL HARVESTS-----
router.use('/farmer/spoil-row', require('./resources/js/spoil-row.js'));

module.exports = router;
//======================================================================//

      ///////////////////////////
     // David's scratch work. //
    ///////////////////////////

    const audits = require('./resources/js/algorithmic_auditing.js');
    function audit_Boxes_Harvests() { return audits.audit_Boxes_Harvests(); }
    function audit_Boxes_Customers() { return audits.audit_Boxes_Customers(); }

