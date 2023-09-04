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
          return fileDetails["process"].reduce((total,current)=>(total+ (current["rule"]=="error") ? 1 : 0),0);
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

  return rulesCounters;
}
