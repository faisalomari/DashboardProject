const { object } = require("webidl-conversions");

exports.numbersFunc = function (fileDetails,type,from,to,rules){
    let rulesSet=undefined;
  if(rules!==undefined)rulesSet=new Set(rules);
    switch(type){
      case "messages":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].length;
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+=(current["date"] >=from && current["date"]<=to && rulesSet.has(current["rule"])) ? 1 : 0 ),0);
        }
      }
      case  "Error":{
        if(from===undefined && to===undefined){
          return fileDetails["process"].reduce((total,current)=>(total+= ((current["rule"]==="Error") ? 1 : 0)),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+= ((current["rule"]==="Error" && current["date"]>=from && current["date"]<=to) ? 1 : 0)),0);
        }
      }
      case "high":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].reduce((total,current)=>(total+= (current["rank"]==3) ? 1 : 0),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+=(current["date"] >=from && current["date"]<=to && current["rank"]==3 && rulesSet.has(current["rule"])) ? 1 : 0),0);
        }
      }
    }
}
exports.messagesFilterBaseOnRule = function(fileDetails,from,to,rules){
  let rulesCounters = {};
  if (rules !== undefined) rulesSet = new Set(rules);
  if (rules == undefined) {
    fileDetails["process"].forEach((data) => {
      rulesCounters[`${data["rule"]}`] = rulesCounters[`${data["rule"]}`] == undefined ? 1 : rulesCounters[`${data["rule"]}`] + 1;
    });
  } else {
    for (let i = 0; i < fileDetails["process"].length; i++) {
      let data = fileDetails["process"][i];
      if (rulesSet.has(data["rule"]) && data["date"] >= from && data["date"] <= to) {
        rulesCounters[`${data["rule"]}`] = rulesCounters[`${data["rule"]}`] == undefined ? 1 : rulesCounters[`${data["rule"]}`] + 1;
      }
    }
  }

  const arr = Object.keys(rulesCounters).map((name) => ({
    "y": rulesCounters[name],
    "rule": name,
    "rate": ((rulesCounters[name] / fileDetails["process"].length) * 100).toFixed(2) // Calculate rate as a percentage
  }));

  arr.sort((a, b) => b.y - a.y);

  return arr;

}

exports.messagesFilterBaseOnRank = function(fileDetails,from,to,rules){
  let rankCounters=[0,0,0];
  let rulesSet;
  if(rules!=undefined)rulesSet=new Set(rules);
  if(rules==undefined){
    fileDetails["process"].map((data)=>( rankCounters[data["rank"]-1]++));
  }
  else{
    fileDetails["process"].map((data) => (rankCounters[data["rank"]-1] += rulesSet.has(data["rule"]) && data["date"]>=from && data["date"] <=to ? 1 : 0 ));
  }
  let sum=rankCounters[0]+rankCounters[1]+rankCounters[2];
  return [{"y":rankCounters[0],"rank":"Low","rate":((rankCounters[0]/sum)*100).toFixed(2)}
  ,{"y":rankCounters[1],"rank":"Medium","rate":((rankCounters[1]/sum)*100).toFixed(2)}
  ,{"y":rankCounters[2],"rank":"High","rate":((rankCounters[2]/sum)*100).toFixed(2)}];
}
exports.divideMessagesByXMin =function(fileDetails,minutes,from,to,rules){
  let rulesSet;
  if(rules!=undefined)rulesSet=new Set(rules);
  if (from === undefined && to === undefined) {
    let minDate = new Date(fileDetails["process"][0]["date"]);
    let maxDate = new Date(fileDetails["process"][0]["date"]);
  
    for (let i = 1; i < fileDetails["process"].length; i++) {
      let currDate = new Date(fileDetails["process"][i]["date"]);
      if (currDate > maxDate) {
        maxDate = currDate;
      }
      if (currDate < minDate) {
        minDate = currDate;
      }
    }
    from = new Date(Date.parse(minDate));
    to = new Date(Date.parse(maxDate));
  }
  else{
    from=new Date(Date.parse(from));
    to=new Date(Date.parse(to));
  }
  let minutesBetweenFromTo=Math.abs(to-from)/(1000* 60);
  minutesBetweenFromTo=minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  minutesBetweenFromTo=minutesBetweenFromTo/minutes;
  let size = minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  let arr=new Array(size);arr.fill(0);
  for(let i=0;i<fileDetails["process"].length;i++){
    let data=fileDetails["process"][i];
    let dateOfData=Date.parse(new Date(data["date"]));
    if(rules===undefined || (rulesSet.has(data["rule"]) && dateOfData>=from && dateOfData<=to)){
      arr[Math.trunc(((Date.parse(data["date"])-from)/(1000* 60))/minutes)]++;
    }
  }
  let start=new Date((from/minutes)*minutes);
  msgCounters=[];
  from=new Date(Date.parse(from));
  arr.map((ele) => {
    msgCounters.push({"x":start , "y":ele});
    start=new Date(start.getTime() + minutes*60000);
  })
  return msgCounters;
}

exports.divideRuleByXMin =function(fileDetails,minutes,rule,from,to){
  if (from === undefined && to === undefined) {
    let minDate = new Date(fileDetails["process"][0]["date"]);
    let maxDate = new Date(fileDetails["process"][0]["date"]);
  
    for (let i = 1; i < fileDetails["process"].length; i++) {
      let currDate = new Date(fileDetails["process"][i]["date"]);
      if (currDate > maxDate) {
        maxDate = currDate;
      }
      if (currDate < minDate) {
        minDate = currDate;
      }
    }
    from = new Date(Date.parse(minDate));
    to = new Date(Date.parse(maxDate));
  }
  else{
    from=new Date(Date.parse(from));
    to=new Date(Date.parse(to));
  }
  let minutesBetweenFromTo=Math.abs(to-from)/(1000* 60);
  minutesBetweenFromTo=minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  minutesBetweenFromTo=minutesBetweenFromTo/minutes;
  let size = minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  let arr=new Array(size);
  arr.fill(0);
  for(let i=0;i<fileDetails["process"].length;i++){
    let data=fileDetails["process"][i];
    let dateOfData=Date.parse(new Date(data["date"]));
    if(data["rule"]===rule && dateOfData>=from && dateOfData<=to){
      arr[Math.trunc(((Date.parse(data["date"])-from)/(1000* 60))/minutes)]++;
    }
  }

  let start=new Date((from/minutes)*minutes);
  msgCounters=[];
  from=new Date(Date.parse(from));
  arr.map((ele) => {
    msgCounters.push({"x":start , "y":ele});
    start=new Date(start.getTime() + minutes*60000);
  })
  return msgCounters;
}

exports.divideRankByXMin =function(fileDetails,minutes,rank,from,to,rules){
  let rulesSet;
  if(rules!=undefined)rulesSet=new Set(rules);
  if (from === undefined && to === undefined) {
    let minDate = new Date(fileDetails["process"][0]["date"]);
    let maxDate = new Date(fileDetails["process"][0]["date"]);
  
    for (let i = 1; i < fileDetails["process"].length; i++) {
      let currDate = new Date(fileDetails["process"][i]["date"]);
      if (currDate > maxDate) {
        maxDate = currDate;
      }
      if (currDate < minDate) {
        minDate = currDate;
      }
    }
    from = new Date(Date.parse(minDate));
    to = new Date(Date.parse(maxDate));
  }
  else{
    from=new Date(Date.parse(from));
    to=new Date(Date.parse(to));
  }
  let minutesBetweenFromTo=Math.abs(to-from)/(1000* 60);
  minutesBetweenFromTo=minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  minutesBetweenFromTo=minutesBetweenFromTo/minutes;
  let size = minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  let arr=new Array(size);arr.fill(0);
  for(let i=0;i<fileDetails["process"].length;i++){
    let data=fileDetails["process"][i];
    let dateOfData=new Date(Date.parse(data["date"])); 
    if( data["rank"]===rank && ((rules===undefined) || (rulesSet.has(data["rule"]) && dateOfData>=from && dateOfData<=to) )){
        arr[Math.trunc(((Date.parse(data["date"])-from)/(1000* 60))/minutes)]++; 
    }
  }
  let start=new Date((from/minutes)*minutes);
  msgCounters=[];
  from=new Date(Date.parse(from));
  arr.map((ele) => {
    msgCounters.push({"x":start , "y":ele});
    start=new Date(start.getTime() + minutes*60000);
  })
  return msgCounters;
}
exports.lastXMessages = function(fileDetails,x,from,to,rules){
  let rulesSet;
  if(rules!=undefined)rulesSet=new Set(rules);
  if (from === undefined && to === undefined) {
    let minDate = new Date(fileDetails["process"][0]["date"]);
    let maxDate = new Date(fileDetails["process"][0]["date"]);
  
    for (let i = 1; i < fileDetails["process"].length; i++) {
      let currDate = new Date(fileDetails["process"][i]["date"]);
      if (currDate > maxDate) {
        maxDate = currDate;
      }
      if (currDate < minDate) {
        minDate = currDate;
      }
    }
    from = new Date(Date.parse(minDate));
    to = new Date(Date.parse(maxDate));
  }
  else{
    from=new Date(Date.parse(from));
    to=new Date(Date.parse(to));
  }
  let arr=[];
  fileDetails["process"].map((msg)=>{
    let dateOfMsg=new Date(msg["date"]); 
    if(rules===undefined || (rulesSet.has(msg["rule"] && dateOfMsg>=from && dateOfMsg<=to))){
      arr.push({"message":msg["message"],"date":dateOfMsg});
    }
  });
   arr=arr.sort((a, b) => new Date(b.date) - new Date(a.date));
  return arr.slice(0,x);
}
