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
    // app.set('views', path.join(__dirname,"views")); //TESTING to fix issue
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