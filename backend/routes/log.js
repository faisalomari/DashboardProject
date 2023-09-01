var express = require('express');
var router = express.Router();
var logdb = require('../models/logdb');
const { log } = require('util');

router.post('/', function(req, res){
    logdb.insertMany([
        {file_name: 1 ,  user_name: '1', file_date:'2023-09-02T18:16:07.093Z' ,process : [
            {
              rule: 'Application Events',
              rank: 'low',
              message: 'INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '1/9/2023'
            }
          ]},{file_name: 2 ,  user_name: '2', file_date:'2023-09-01T18:16:07.093Z' ,process : [
            {
              rule: 'Application Events',
              rank: 'low',
              message: 'INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '30/8/2023'
            }
          ]}
    ]).then(function(){
        console.log("Data inserted")  // Success
        res.send("hi");
    }).catch(function(error){
        console.log(error)      // Failure
    });
});

router.get('/start' , async function(req,res){
    let start=[];
    let result =await logdb.find({}).exec(); /*retrieving all the files details fron the database*/

    /*retrieving all files names from the result*/ 
    fileNames=result.map((data) => data["file_name"]);
    /*********************************************/

    /*retrieving all the rules*/
    let rulesNames=new Set();
    for(let i=0;i<result.length;i++){
        for(let j=0;j<result[i]["process"].length;j++){
            rulesNames.add(result[i]["process"][j]["rule"]);
        }
    }
    /*************************/

    start[0]=fileNames;
    start[1]=Array.from(rulesNames);
    start=JSON.parse(JSON.stringify(start));
    res.json(start);
    console.log(start);
});

router.get('/init',  function(req,res){
    logdb.find()
  .sort({ file_date: -1 }) 
  .exec((err, documents) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(documents[0]);
    res.send(documents[0]["process"][0]);
  });

});
 module.exports = router;