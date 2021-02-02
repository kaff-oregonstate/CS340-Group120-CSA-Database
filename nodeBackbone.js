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

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use('/source', express.static('resources'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// const session = require('express-session');
// app.use(session({secret: 'verySecretPassword'}));

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit:    10,
    host:               'classmysql.engr.oregonstate.edu',
    user:               'cs340_kaffs',
    password:           'sP6ptfbWuXAU54w',
    database:           'cs340_kaffs'
});
module.exports.pool = pool;

//================================================================//

      //~~~//////////////////////////////////~~~//
     //    express backbone for node server    //
    //~~~//////////////////////////////////~~~//

const port = 28394;
app.set('port', port);

    /////////////
   // content //
  /////////////

// TODO: use sessions to detect login, direct to either '/login' or '/'

app.get('/', func1);

app.get('/farmer', funcFarmer);
app.get('/farmer-plantNewRow', funcFarmerNewPlanting);
app.get('/farmer-harvestNewRow', funcFarmerNewHarvest);
app.get('/farmer-viewPlantedRows', funcFarmerViewRows);
app.get('/farmer-viewProduceOnHand', funcFarmerViewProduce);
app.get('/farmer-addNewCropType', funcAddNewCropType)

app.get('/box-packer', funcBoxPacker);

//routes for csa-supporter page and sub-pages (amelia)
app.get('/csa-supporter', funcCsaSupporter);
app.get('/csa-supporter-next', func_next_box);
app.get('/csa-supporter-prev', func_prev_box);
app.get('/csa-supporter-subs', func_subs);
app.get('/csa-supporter-cust', func_cust);

//routes for admin page and sub-pages
app.get('/admin', funcAdmin);
app.get('/admin-add-cust',func_add_cust);
app.get('/admin-updt-cust',func_updt_cust);



function func1(req, res){
    content = {title: 'Rubyfruit Farm'};
    res.render('home', content);
}

          //////////////////
         // farmer pages //
        //////////////////

function funcFarmer(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – Farmer'};
    res.render('farmer', content);
}

function funcFarmerNewPlanting(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – Enter Row Planted'};
    res.render('farmer-plantNewRow', content);
}

function funcFarmerNewHarvest(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – Enter Row Harvested'};
    res.render('farmer-harvestNewRow', content);
}

function funcFarmerViewRows(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – View Rows'};
    res.render('farmer-viewPlantedRows', content);
}

function funcFarmerViewProduce(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – View Produce'};
    res.render('farmer-viewProduceOnHand', content);
}

function funcAddNewCropType(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – Add Crop Type'};
    res.render('farmer-addNewCropType', content);
}


function funcBoxPacker(req, res){
    // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
    content = {title: 'Rubyfruit Farm – Box Packer'};
    res.render('boxPacker', content);
}

// Amelia's Pages: include pages that manage CSA supporters & Admin

// ***CSA SUPPPORTER PAGES***

function funcCsaSupporter(req, res){
  // need check for permissions to load this page, else maybe display home page again with error message at bottom/top?
  content = {title: 'Rubyfruit Farm – CSA Supporter'};
  res.render('csaSupporter0', content);
}

// renders handlebars view to show the user the box items in the next week's CSA box
function func_next_box(req, res){
    content = {title: 'Rubyfruit Farm - Boxes'};
    res.render('csaSupporter1', content);
}

// renders handlebars view to show the user the box items in the previous week's CSA box
function func_prev_box(req,res){
  content = {title: 'Rubyfruit Farm - Boxes'};
  res.render('csaSupporter2', content);
}

// renders handlebars view to show the user their subscription information
function func_subs(req,res){
  content = {title: 'Rubyfruit Farm - Subscription'};
  res.render('csaSupporter3', content);
}

// renders handlebars view to allow the customer to contact customer service
function func_cust(req,res){
  content = {title: 'Rubyfruit Farm - Customer Service'};
  res.render('csaSupporter4', content);
}

// ***ADMIN PAGES***

function funcAdmin(req, res){
  content = {title: 'Rubyfruit Farm – Administrator'};
  res.render('admin', content);
}

function func_add_cust(req, res){
  content = {title: 'Rubyfruit Farm - Customer'};
  res.render('admin_add_cust', content);
}

function func_updt_cust(req, res){
  content = {title: 'Rubyfruit Farm - Customer'};
  res.render('admin_update_cust', content);
}



// ***BOX PACKER PAGES***



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