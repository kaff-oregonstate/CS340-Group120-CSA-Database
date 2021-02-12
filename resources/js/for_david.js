var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 3891);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

const getAllQuery = 'SELECT * FROM workout';
const insertQuery = "INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)";
const updateQuery = "UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=? ";
const deleteQuery = "DELETE FROM workout WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS workout";
const makeTableQuery = `CREATE TABLE IF NOT EXISTS workout(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        reps INT,
                        weight INT,
                        unit BOOLEAN,
                        date DATE);`;

//returns static files to to browser
const makeTable = () => {
  mysql.pool.query(makeTableQuery, (err) => {
    if(err){
      console.log(err);
      return;
    }

  });

};

const getAllData = (res) => {
  var context = {};
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      return;
    }
    res.json({"rows": rows});
  });
};

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, (err, rows, fields)=>{
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context.results);
  });
});

app.post('/',function(req,res,next){
  // var context = {};
  var {name, reps, weight, unit, date} = req.body;
  mysql.pool.query(insertQuery, [name, reps, weight, unit, date], (err, result)=>{
    if(err){
      next(err);
      return;
    }
    
    getAllData(res);

  });
});

app.delete('/:id',function(req,res,next){
  // var context = {};
  //object destructuring, pulling properties off of an object and storing them
  var id = req.params.id;
  mysql.pool.query(deleteQuery, [id], (err, result)=>{
    if(err){
      next(err);
      return;
    }
    getAllData(res);
  });
});

///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.put('/:id',(req,res,next)=>{
  var context = {};
  var id = req.params.id;
  var {name, reps, weight, unit, date} = req.body;
  mysql.pool.query(
    updateQuery,
    [name, reps, weight, unit, date, id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    getAllData(res);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  makeTable();
});
