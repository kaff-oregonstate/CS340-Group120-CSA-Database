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
    const path = require('path')
    app.use('/source', express.static(path.join(__dirname, 'resources')));

    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // magic from Millie
    const CORS = require('cors');
    app.use(CORS());

    var mysql = require('./resources/js/dbcon.js');
    const pool = mysql.pool;

    const port = 28394;
    app.set('port', port);


//======================================================================//


      /////////////////////////////////////
     //              ROUTES              //
    ///////////////////////////////////////

//  ~~~~~~~ HOME ROUTE ~~~~~~~~~
app.get('/', funcHome);

function funcHome(req, res) {
    content = {
    title: "Rubyfruit Farm",
    page_name: "home",
    };

    res.render("home", content);
}

// ~~~~~~~~~PAGES ROUTES~~~~~~~~~~~~

    app.use(require('./farmer'));
    app.use(require('./boxes'));
    app.use(require('./admin'));


// ~~~~~~~~~ ERROR ROUTES ~~~~~~~~~
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


