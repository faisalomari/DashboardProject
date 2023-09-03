var express = require('express');
var router = express.Router();
var logdb = require('../models/logdb');
const { log } = require('util');
const backFuncs=require('../backFuncs');

router.post('/', function(req, res){
    logdb.insertMany([
        {file_name: 1 ,  user_name: '1', file_date:'2023-09-02T18:16:07.093Z' ,process : [
            {
              rule: 'Application Events',
              rank: 2,
              message: 'INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '1/9/2023'
            },{
              rule: 'fatal',
              rank: 1,
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
    let result =await logdb.find({}).exec(); /*retrieving all the files details fron the database*/
    /*retrieving all files names from the result*/ 
    fileNames=result.map((data) => data["file_name"]);
    res.json(fileNames);
    console.log(fileNames);
});

router.get('/init', async function(req,res){
    let result= await logdb.find().sort({ file_date: -1 }) .exec();
    let dataToFront={};
    dataToFront["numberOfMessages"]=backFuncs.numbersFunc(result[0],"messages");
    dataToFront["numberOfFatal"]=backFuncs.numbersFunc(result[0],"fatal");
    dataToFront["numberOfHigh"]=backFuncs.numbersFunc(result[0],"high");
    res.json(dataToFront);
});
 module.exports = router;