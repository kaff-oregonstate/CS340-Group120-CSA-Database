// nodeBackbone.js

// This javascript file, along with the other documents that make up this website and database, were generated by David Kaff and Amelia Walsh in CS 340 at Oregon State in the Winter of 2021.

// The following resources were referenced in the creation of this database driven website:

    // expressjs.com
    // CS 290 Coursework
    // CS 340 Coursework
    // bootstrap.com
    // stackoverflow.com
    // eloquentjavascript.net
    // udemy.com
    //amelia is awesome!

         ///////////////////////////////////////////////////////////////
        // in order for this website to run, node must be installed, //
       //     along with the following packages:                    //
      //        express, express-handlebars, express-session,      //
     //         body-parser, and mysql                            //
    ///////////////////////////////////////////////////////////////

//================================================================//

      ///////////////////////////////////////////
     // set up express and other dependencies //
    ///////////////////////////////////////////

const express = require('express');
const app = express();

const handlebars = require('express-handlebars').create({defaultLayout:'main'});
var helpers = require('handlebars-helpers')();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use('/source', express.static('resources'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// magic from Millie
const CORS = require('cors');
app.use(CORS());


// const session = require('express-session');
// app.use(session({secret: 'verySecretPassword'}));

var mysql = require('./resources/js/dbcon.js');
const pool = mysql.pool;

//================================================================//

      //~~~//////////////////////////////////~~~//
     //    express backbone for node server    //
    //~~~//////////////////////////////////~~~//

const port = 28394;
app.set('port', port);

    /////////////
   // content //
  /////////////

app.get('/', funcHome);

//routes for farmer and planting pages
app.get('/farmer', funcFarmer);
app.get('/farmer-plant-new-row', func_farmer_new_crop_rows);
app.get('/farmer-harvest-new-row', func_farmer_new_harvest);
app.get('/farmer-view-planted-rows', func_farmer_view_rows);
app.get('/farmer-view-produce-on-hand', func_farmer_view_produce);
app.get('/farmer-add-new-crop-type', func_add_new_crop_type)

//routes for box packer
app.get('/box-packer', func_box_packer);

//routes for admin page and sub-pages
app.get('/admin', funcAdmin);
app.get('/admin-add-customer',func_add_customer);
app.get('/admin-update-customer',func_update_customer);
app.get('/admin-boxes-view',func_boxes_view);

function funcHome(req, res){
    content = {
        title: 'Rubyfruit Farm',
        page_name: 'home'
    };
    res.render('home', content);
}

          //////////////////
//=======// farmer pages //================================//
        //////////////////

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
            }
            res.render('farmer-view-produce-on-hand', content);
        }
    )
}

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

          /////////////////////
//=======// box packer page //================================//
        /////////////////////

function func_box_packer(req, res){
    content = {
        title: 'Rubyfruit Farm – Box Packer',
        page_name: 'box packer',
        breadcrumbs: [
            {link: '/', page_name: 'home'}
        ]
    };
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
            console.log(current_box.box_id);
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

// Amelia's Pages: include pages that manage box packer & Admin

// ***ADMIN PAGES***

function funcAdmin(req, res){
  content = {
    title: 'Rubyfruit Farm – Administrator',
    page_name: 'admin',
    breadcrumbs: [
        {link: '/', page_name: 'home'}
    ]
  };
  res.render('admin', content);
}

function func_add_customer(req, res, next){
  console.log("ADD customer ROUTE....")

  //add title to page content
  content = {
    title: 'Rubyfruit Farm - Customer',
    page_name: 'add new customer',
    breadcrumbs: [
        {link: '/', page_name: 'home'},
        {link: '/admin', page_name: 'admin'}
    ]
  };
 
  //query the server for the data in customers table, store in rows
  pool.query(get_all_customers, (err, rows) =>{
    console.log("ADD customer ROUTE.... (1)")
    if(err){
      console.log("In ERROR in add customer!");
      res.type('text/plain');
      res.status(401);
      res.send('401 - failed to load customers');
      console.log(err);
      return;
    }
    console.log("ADD customer ROUTE.... (2)");
    //add the return to the content of the page
    content.customers = rows;
    console.log(rows.length)

    for (i in content.customers) {
      var date1 = new Date(content.customers[i].date_paid);
      content.customers[i].date_paid = Intl.DateTimeFormat('en-US').format(date1);
  }

    //render the page with the content from the server
    res.render('admin-add-customer', content);
    console.log("ADD customer ROUTE.... (3)");

  });

}

function func_update_customer(req,res){
  
  content = {
    title: "Rubyfruit Farm - Update Customer",
    page_name: "update customer",
    breadcrumbs:[
      {link: '/', page_name: 'home'},
      {link: '/admin', page_name: 'admin'}
    ]
  };

  pool.query(get_all_customers, (err, rows) =>{
    if(err){
      console.log("In ERROR in update customer!");
      res.type('text/plain');
      res.status(401);
      res.send('401 - failed to load customers');
      console.log(err);
      return;
    }
    
    //add the return to the content of the page
    content.customers = rows;
    console.log(rows.length)


  console.log("in update customer");
  res.render('admin-update-customer', content);

  });
}

function func_boxes_view(req, res){

    console.log('In boxes view route')
    content = {
        title: 'Rubyfruit Farm - Boxes',
        page_name: 'view and add boxes',
        breadcrumbs: [
            {link: '/', page_name: 'home'},
            {link: '/admin', page_name: 'admin'}
        ]
    };

    pool.query(get_boxes, (err, rows) =>{
        if(err){
        console.log("In ERROR in view boxes!");
        res.type('text/plain');
        res.status(401);
        res.send('401 - failed to load boxes');
        console.log(err);
        return;
        }
        
        //add the return to the content of the page
        content.boxes = rows;
        console.log(rows.length)
        console.log(content)
    
    res.render('admin-boxes-view', content);
    });
}



          /////////////////
//=======// SQL Queries //================================//
        /////////////////

const get_crop_types_query = 'SELECT crop_name, crop_id FROM Crop_Types;';
const add_crop_row_query = "INSERT INTO Crop_Rows (`crop_id`, `mature_date`) VALUES (?, ?);";
const get_crop_rows_query = 'SELECT row_id, Crop_Rows.crop_id, mature_date, crop_name FROM Crop_Rows LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;';
const add_harvest_query = "INSERT INTO Harvests (`row_id`, `quantity_harvested`, `harvest_date`, `expiration_date`) VALUES (?, ?, ?, ?);";
const get_harvests_query = 'SELECT harvest_id, crop_name, quantity_harvested, harvest_date, expiration_date FROM Harvests LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;';
const add_crop_type_query = "INSERT INTO Crop_Types (`crop_name`) VALUES (?);"

const get_box_contents_query = "SELECT box_id, Boxes_Harvests.harvest_id, qty_per, crop_name FROM Boxes_Harvests LEFT JOIN Harvests ON Boxes_Harvests.harvest_id = Harvests.harvest_id LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE `box_id` = ?;"


const pack_boxes_query = "UPDATE Boxes SET `number_packed` = ? WHERE `box_id` = ?;"

// ***** admin *****

// update customer page
const search_customers = "SELECT customer_id, first_name, last_name, date_paid FROM Customers WHERE first_name=?, last_name=?;"
const update_customers = "UPDATE Customers SET first_name=?, last_name=?, date_paid=? WHERE customer_id=?;"
const delete_customers = "DELETE FROM Customers WHERE customer_id=?;"
// add customer page
const get_all_customers = "SELECT * FROM Customers;"
const insert_customers = "INSERT INTO Customers (first_name, last_name, date_paid) VALUES(?,?,?);"
//view boxes page
const get_boxes = "SELECT * FROM Boxes;"
const insert_box = "INSERT INTO Boxes (box_date) VALUES (?);"


          /////////////////////////////
//=======// Database AJAX Functions //================================//
        /////////////////////////////

app.post('/INSERT-crop-rows', func_INSERT_crop_rows);
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


app.post('/INSERT-harvests', func_INSERT_harvests);
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


app.post('/INSERT-crop-types', func_INSERT_crop_types);
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


app.post('/pack-boxes', func_pack_boxes);
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


// ******** ADMIN ROUTES ********

app.post('/INSERT-customer', function(req, res, next){

  console.log("in INSERT CUSTOMER route ...");

  var {first_name, last_name, date_paid} = req.body;
  pool.query(insert_customers, [first_name, last_name, date_paid], (err,result) => {
    if(err){
      console.log("In ERROR insert customer!");
      res.type('text/plain');
      res.status(401);
      res.send('401 - bad INSERT');
      console.log(err);
      return;
    }
    res.type('text/plain');
    res.status(200);
    res.send('200 - good INSERT');
  });
  console.log("outside query in insert customer");
});

app.post('/INSERT-box', function(req, res, next){

    console.log("in INSERT box route ...");
  
    var {box_date} = req.body;

    pool.query(insert_box, [box_date], (err,result) => {
      if(err){
        console.log("In ERROR insert box!");
        res.type('text/plain');
        res.status(401);
        res.send('401 - bad INSERT');
        console.log(err);
        return;
      }
      res.type('text/plain');
      res.status(200);
      res.send('200 - good INSERT');

    });
    
  });



//CHANGE TO GET REQUEST
app.post('/SEARCH-customer', func_SEARCH_customer);

content = {
    title: 'Rubyfruit Farm - Boxes',
    page_name: 'view and add boxes',
    breadcrumbs: [
        {link: '/', page_name: 'home'},
        {link: '/admin', page_name: 'admin'}
    ]
};

function func_SEARCH_customer(req, res, next){
    var {first_name, last_name} = req.body
    pool.query(
        search_customers,
        [first_name, last_name],
        function(err,result){
            if(err){
                console.log("In ERROR search customer!");
                res.type('text/plain');
                res.status(401);
                res.send('401 - bad search');
                console.log(err);
                return;
              }
              console.log("successful search")
              res.type('text/plain');
              res.status(200);
              res.send('200 - good search');
        });

}


app.put('/UPDATE-customer', func_UPDATE_customer);
function func_UPDATE_customer(req, res, next){
    console.log("inside update route")
    
    console.log(req.body)
    var {customer_id, first_name, last_name, date_paid} = req.body
    pool.query(
        update_customers,
        [first_name, last_name, date_paid, customer_id],
        function(err,result){
            if(err){
                console.log("In ERROR update customer!");
                res.type('text/plain');
                res.status(401);
                res.send('401 - bad update');
                console.log(err);
                return;
              }
              console.log("successful update")
              res.type('text/plain');
              res.status(200);
              res.send('200 - good update');
        });
}

app.post('/DELETE-customer:id', func_DELETE_customer);
function func_DELETE_customer(req, res, next){
    console.log("inside delete customer route")
    var customer_id = req.params.id
    
    pool.query(delete_customers, [customer_id], (err, result)=>{
        if(err){
            console.log("In ERROR delete customer!");
            res.type('text/plain');
            res.status(401);
            res.send('401 - bad delete');
            console.log(err);
            return;
          }
          console.log("good delete")
          res.type('text/plain');
          res.status(200);
          res.send('200 - good delete');
      });
}
    ////////////
   // errors //
  ////////////

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

//======================================================================//

      //////////////////////////////////////////////////////////////
     // Start listening to port, readout to log what's going on. //
    //////////////////////////////////////////////////////////////

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press CMD-. to terminate.')
});

// check one two

// extra comment


//======================================================================//

      ///////////////////////////
     // David's scratch work. //
    ///////////////////////////


const audits = require('./resources/js/algorithmic_auditing.js');
function get_the_correct_today() { return audits.get_the_correct_today(); }
function audit_Boxes_Harvests() { return audits.audit_Boxes_Harvests(); }
function audit_Boxes_Customers() { return audits.audit_Boxes_Customers(); }
function get_next_box() { return audits.get_next_box(); }
function get_customer_counts(boxes) {return audits.get_customer_counts(boxes); }


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

audit_Boxes_Harvests();

function zzz(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep() {
    await zzz(2000);
}
async function slep() {
    await zzz(200);
}

