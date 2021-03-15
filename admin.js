
var express = require('express');
var router = express.Router();

var mysql = require('./resources/js/dbcon.js');
const pool = mysql.pool;

//middleware fore express.Router()
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

// ~~~~~~~~ ADMIN SQL QUERIES ~~~~~~~~~~~~

// update customer page
const search_customers = "SELECT * FROM Customers WHERE first_name=? AND last_name=?;"
const update_customers = "UPDATE Customers SET first_name=?, last_name=?, date_paid=? WHERE customer_id=?;"
const delete_customers = "DELETE FROM Customers WHERE customer_id=?;"
// add customer page
const get_all_customers = "SELECT * FROM Customers;"
const insert_customers = "INSERT INTO Customers (first_name, last_name, date_paid) VALUES(?,?,?);"
//view boxes page
const get_boxes = "SELECT * FROM Boxes;"
const insert_box = "INSERT INTO Boxes (box_date) VALUES (?);"

// ~~~~~~~~ ROUTES IN ADMIN ~~~~~~~~~~~~

//routes for admin page and sub-pages
router.get('/admin', funcAdmin);
router.get('/admin-add-customer',func_add_customer);
router.get('/admin-update-customer',func_update_customer);
router.get('/admin-boxes-view',func_boxes_view);


// -----ADMIN MENU PAGE ROUTE-----
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

// -----ADMIN ADD CUSTOMER PAGE ROUTES----- 

//GET CUSTOMERS
function func_add_customer(req, res, next){
    // console.log("ADD customer ROUTE....")
  
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
      // console.log("ADD customer ROUTE.... (1)")
      if(err){
        console.log("In ERROR in add customer!");
        res.type('text/plain');
        res.status(401);
        res.send('401 - failed to load customers');
        console.log(err);
        return;
      }
      // console.log("ADD customer ROUTE.... (2)");
      //add the return to the content of the page
      content.customers = rows;
      // console.log(rows.length)
  
      for (i in content.customers) {
        var date1 = new Date(content.customers[i].date_paid);
        content.customers[i].date_paid = Intl.DateTimeFormat('en-US').format(date1);
    }
  
      //render the page with the content from the server
      res.render('admin-add-customer', content);
      // console.log("ADD customer ROUTE.... (3)");
  
    });
  
  }

  //INSERT CUSTOMER
  router.post('/INSERT-customer', function(req, res, next){

    // console.log("in INSERT CUSTOMER route ...");
  
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
      audit_Boxes_Customers();
      audit_Boxes_Harvests();
      res.type('text/plain');
      res.status(200);
      res.send('200 - good INSERT');
    });
    
  });
  

// ----- ADMIN UPDATE/DELETE CUSTOMER PAGE ROUTES ----- 

//SEARCH CUSTOMERS
router.post('/SEARCH-customer', function(req, res, next){

    console.log(req.body)
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
              
            var search_results = JSON.stringify(result)
            res.send(search_results)

        });

});

//UPDATE CUSTOMER
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
    res.render('admin-update-customer', content);
  
    });
  }

//DELETE CUSTOMER
router.post('/DELETE-customer:id', func_DELETE_customer);
function func_DELETE_customer(req, res, next){
      // console.log("inside delete customer route")
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
            audit_Boxes_Customers();
            audit_Boxes_Harvests();
            // console.log("good delete")
            res.type('text/plain');
            res.status(200);
            res.send('200 - good delete');
        });
  }

// ----- ADMIN VIEW BOXES PAGE ROUTES ----- 

//GET BOXES
function func_boxes_view(req, res){
  
      // console.log('In boxes view route')
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
          // console.log(rows.length)
          // console.log(content)
  
      res.render('admin-boxes-view', content);
      });
}

//INSERT BOX
router.post('/INSERT-box', function(req, res, next){

    // console.log("in INSERT box route ...");

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
      audit_Boxes_Customers();
      audit_Boxes_Harvests();
      res.type('text/plain');
      res.status(200);
      res.send('200 - good INSERT');

    });

  });

router.use('/admin-boxes-view/details', require('./view-box-details.js'))
  
module.exports = router;

//======================================================================//

      ///////////////////////////
     // David's scratch work. //
    ///////////////////////////

const audits = require('./resources/js/algorithmic_auditing.js');
function audit_Boxes_Harvests() { return audits.audit_Boxes_Harvests(); }
function audit_Boxes_Customers() { return audits.audit_Boxes_Customers(); }