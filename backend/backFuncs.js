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
      case  "fatal":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].reduce((total,current)=>(total+ (current["rule"]=="fatal") ? 1 : 0),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+ (current["date"] >=from && current["date"]<=to && current["rule"]=="fatal") ? 1 : 0),0);
        }
      }
      case "high":{
        if(from==undefined && to==undefined){
          return fileDetails["process"].reduce((total,current)=>(total+ (current["rank"]==2) ? 1 : 0),0);
        }
        else{
          return fileDetails["process"].reduce((total,current)=>(total+(current["date"] >=from && current["date"]<=to && current["rank"]==2) ? 1 : 0),0);
        }
      }
    }
  }