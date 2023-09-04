const { object } = require("webidl-conversions");

exports.numbersFunc = function (fileDetails,type,from,to){
    let count=0;
    switch(type){
      case "messages":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].length;
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+(current["date"] >=from && current["date"]<=to) ? 1 : 0 ),0);
        }
      }
      case  "error":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].reduce((total,current)=>(total+ (current["rule"].toLowerCase()=="error") ? 1 : 0),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+ (current["date"] >=from && current["date"]<=to && current["rule"]=="error") ? 1 : 0),0);
        }
      }
      case "high":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].reduce((total,current)=>(total+ (current["rank"]==3) ? 1 : 0),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+(current["date"] >=from && current["date"]<=to && current["rank"]==3) ? 1 : 0),0);
        }
      }
    }
}
exports.messagesFilterBaseOnRule = function(fileDetails,from,to,rules){
  let rulesCounters={};
  if(rules!=undefined)rulesSet=new Set(rules);
  if(rules==undefined){
    fileDetails["process"].map((data)=>( 
      rulesCounters[`${data["rule"]}`] = rulesCounters[`${data["rule"]}`]==undefined ? 1 : rulesCounters[`${data["rule"]}`]+1));
  }
  else{
    for(let i=0;i<fileDetails["process"].length;i++){
      let data=fileDetails["process"][i];
      if(rulesSet.has(data["rule"]) && data["date"]>=from && data["date"] <=to ){
        rulesCounters[`${data["rule"]}`] = rulesCounters[`${data["rule"]}`]==undefined ? 1 : rulesCounters[`${data["rule"]}`]+1;
      }
    }
  }
     rulesCounters = Object.keys(rulesCounters).map((name) => ({
      [name]: rulesCounters[name],
    }));

    rulesCounters.sort((a,b)=>(Object.values(b)[0]-Object.values(a)[0]));

    return rulesCounters;
}

exports.messagesFilterBaseOnRank = function(fileDetails,from,to,rules){
  let rankCounters=[0,0,0];
  if(rules!=undefined)rulesSet=new Set(rules);
  if(rules==undefined){
    fileDetails["process"].map((data)=>( 
      rankCounters[data["rank"]-1]++));
  }
  else{
    for(let i=0;i<fileDetails["process"].length;i++){
      let data=fileDetails["process"][i];
      if(rulesSet.has(data["rule"]) && data["date"]>=from && data["date"] <=to ){
        rankCounters[data["rank"]-1]++;
      }
    }
  }
  return [{"low":rankCounters[0]},{"medium":rankCounters[1]},{"high":rankCounters[2]}];
}

function getLevel(message){
  let i=0;
  while(message[i++]!=" ");
  return message.substring(0,i);
}

exports.topLevels= function(fileDetails,from,to,rules){
  levels={};

  if(rules!=undefined)rulesSet=new Set(rules);
  if(rules==undefined){
    fileDetails["process"].map((data)=>( 
      levels[`${getLevel(data["message"])}`] = levels[`${getLevel(data["message"])}`]==undefined ? 1 : levels[`${getLevel(data["message"])}`]+1));
  }
  else{
    for(let i=0;i<fileDetails["process"].length;i++){
      let data=fileDetails["process"][i];
      if(rulesSet.has(data["rule"]) && data["date"]>=from && data["date"] <=to ){
        levels[`${getLevel(data["message"])}`] = levels[`${getLevel(data["message"])}`]==undefined ? 1 : levels[`${getLevel(data["message"])}`]+1;
      }
    }
  }
  levels = Object.keys(levels).map((name) => ({
    [name]: levels[name],
  }));
  levels.sort((a,b)=>(Object.values(b)[0]-Object.values(a)[0]));

  return levels;
}
exports.divideMessagesByXMin =function(fileDetails,minutes,from,to,rules){
  let rulesSet;
  if(rules!=undefined)rulesSet=new Set(rules);
  if(from==undefined && to==undefined){
    let min = new Date(fileDetails["process"][0]["date"]);
    let max = new Date(fileDetails["process"][0]["date"]);

    for (let i = 1; i < fileDetails["process"].length; i++) {
      let currDate = new Date(fileDetails["process"][i]["date"]);
      if (currDate > max) {max = currDate;}
      if (currDate < min) { min = currDate; }
    }
    from=min;to=max;
  }
  from=Date.parse(from);to=Date.parse(to);
  let minutesBetweenFromTo=Math.abs(to-from)/(1000* 60);
  minutesBetweenFromTo=minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  minutesBetweenFromTo=minutesBetweenFromTo/minutes;
  let size = minutesBetweenFromTo/Math.trunc(minutesBetweenFromTo)-1 > 0 ? Math.trunc(minutesBetweenFromTo)+1 : Math.trunc(minutesBetweenFromTo);
  let arr=new Array(size);arr.fill(0);
  for(let i=0;i<fileDetails["process"].length;i++){
    let data=fileDetails["process"][i];
    if(rules===undefined || (rulesSet.has(data["rule"]) && data["date"]>=from && data["date"]<=to)){
      arr[Math.trunc(((Date.parse(data["date"])-from)/(1000* 60))/minutes)]++;
    }
  }
  return arr;
}

