const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('./dptos.json', 'utf8'));
const meds = JSON.parse(fs.readFileSync('./medsNames.json', 'utf8'));
const userCount = 20;
const recordCount = 50;
let dptos = [];
for(let feat of obj.features){
  dptos.push(feat.properties.NOMBRE_DPT);
}
let usersData = {};
let medsData = {};
for(let i = 1; i<=userCount;i++){
  let records = {};
  let recordsMeds = {};
  for(let j = 1; j<=recordCount;j++){
    recordsMeds[j]={added:epoch(),name:medication(),location:"44.64194324397017,-105.03319879961875",department:place()}
    records[j]={added:epoch(),diastolicPressure:diastolicPressure(),systolicPressure:systolicPressure(),location:"44.64194324397017,-105.03319879961875",department:place()}
  }
  usersData[i] ={records};
  medsData[i] = {records:recordsMeds};

}
fs.writeFile("./dptsNames.json", JSON.stringify(dptos), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("The file 1 was saved!");
});
fs.writeFile("./usersData.json", JSON.stringify(usersData), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("The file 2 was saved!");
});
fs.writeFile("./medsData.json", JSON.stringify(medsData), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("The file 3 was saved!");
});


//================================================================================
function epoch(){
  return Math.floor(Math.random()*(1526499017-1495968799))+1495968799;
}
function place(){
  return dptos[Math.floor(Math.random()*dptos.length)]
}
function medication(){
  return meds[Math.floor(Math.random()*meds.length)]
}
function systolicPressure(){
  return Math.floor(Math.random()*(165-99))+99;
}

function diastolicPressure(){
  return Math.floor(Math.random()*(108-50))+50;
}
