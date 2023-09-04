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
              rank: 3,
              message: 'INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T18:00:00.093+00:00'
            },{
              rule: 'Error',
              rank: 3,
              message: 'FATAL [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T18:15:01.093+00:00'
            },{
              rule: 'Error',
              rank: 2,
              message: 'EXECPTION [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T18:30:01.093+00:00'
            },{
              rule: 'Application Events',
              rank: 3,
              message: 'INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T18:45:01.093+00:00'
            },{
              rule: 'Warning',
              rank: 3,
              message: 'warn [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T18:55:01.093+00:00'
            },{
              rule: 'All',
              rank: 3,
              message: 'TRACE [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T19:00:01.093+00:00'
            }
          ]},{file_name: 2 ,  user_name: '2', file_date:'2023-09-01T18:16:07.093Z' ,process : [
            {
              rule: 'ALL',
              rank: 3,
              message: 'TRACE [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp',
              date: '2023-09-02T19:10:01.093+00:00'
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
    let filesRules = new Set();
    result.map((data) => (data["process"].map((data1)=>(filesRules.add(data1["rule"])))));
    let dataToFront={};
    dataToFront["filesNames"]=fileNames;dataToFront["filesRules"]=Array.from(filesRules);
    res.json(dataToFront);
});

router.get('/init', async function(req,res){
    let result= await logdb.find().sort({ file_date: -1 }) .exec();
    let dataToFront={};
    dataToFront["numberOfMessages"]=backFuncs.numbersFunc(result[0],"messages");
    dataToFront["numberOfErrors"]=backFuncs.numbersFunc(result[0],"error");
    dataToFront["numberOfHigh"]=backFuncs.numbersFunc(result[0],"high");
    dataToFront["rulesCounters"]=backFuncs.messagesFilterBaseOnRule(result[0]);
    dataToFront["rankCounters"]=backFuncs.messagesFilterBaseOnRank(result[0]);
    dataToFront["LevelsCounters"]=backFuncs.topLevels(result[0]);
    dataToFront["divideMessagesBy15Min"]=backFuncs.divideMessagesByXMin(result[0],15);
    res.json(dataToFront);
});
 module.exports = router;