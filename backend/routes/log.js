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

router.get('/' , async function(req,res){
    let result =await logdb.find({}).exec();
    let fileNames=[],dataToFront={},filesRules = new Set();

    result.map((data) => (data["process"].map((data1)=>(filesRules.add(data1["rule"])))));
    filesRules=Array.from(filesRules);

    result.map((file) => {
      let rulesIdx="";
      file["process"].map((msg) => {
        const ind=filesRules.indexOf(msg["rule"]);
        if(!rulesIdx.includes(ind)){
          rulesIdx+=ind;
        }
      })
      fileNames.push({"fileName":file["file_name"],"rules":rulesIdx});
    });

    dataToFront["files"]=fileNames;
    dataToFront["rules"]=filesRules;
    res.json(dataToFront);
});

router.get('/init', async function(req,res){
    let result= await logdb.find().sort({ file_date: -1 }) .exec();
    let dataToFront={};
    dataToFront["numberOfMessages"]=backFuncs.numbersFunc(result[0],"messages");
    dataToFront["numberOfErrors"]=backFuncs.numbersFunc(result[0],"Error");
    dataToFront["numberOfHigh"]=backFuncs.numbersFunc(result[0],"high");
    dataToFront["rulesCounters"]=backFuncs.messagesFilterBaseOnRule(result[0]);
    dataToFront["rankCounters"]=backFuncs.messagesFilterBaseOnRank(result[0]);
    dataToFront["divideMessagesBy15Min"]=backFuncs.divideMessagesByXMin(result[0],15);
    dataToFront["divideErrorsBy15Min"]=backFuncs.divideRuleByXMin(result[0],15,"Error");
    dataToFront["divideRankBy15Min"]=backFuncs.divideRankByXMin(result[0],15,3);
    res.json(dataToFront);
});
router.get('/filter', async function(req,res){
  let dataFromFront=req.body;
  let result= await logdb.find({ file_name: dataFromFront.file_name}).exec();
    let dataToFront={};
    dataToFront["numberOfMessages"]=backFuncs.numbersFunc(result[0],"messages",dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    dataToFront["numberOfErrors"]=backFuncs.numbersFunc(result[0],"Error",dataFromFront.from,dataFromFront.to);
    dataToFront["numberOfHigh"]=backFuncs.numbersFunc(result[0],"high",dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    dataToFront["rulesCounters"]=backFuncs.messagesFilterBaseOnRule(result[0],dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    dataToFront["rankCounters"]=backFuncs.messagesFilterBaseOnRank(result[0],dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    dataToFront["divideMessagesBy15Min"]=backFuncs.divideMessagesByXMin(result[0],15,dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    dataToFront["divideErrorsBy15Min"]=backFuncs.divideRuleByXMin(result[0],15,"Error");
    dataToFront["divideRankBy15Min"]=backFuncs.divideRankByXMin(result[0],15,3,dataFromFront.from,dataFromFront.to,dataFromFront.rules);
    res.json(dataToFront);
});

 module.exports = router;