const fs = require('fs');
const usersData = JSON.parse(fs.readFileSync('./usersData.json', 'utf8'));
const dpts = JSON.parse(fs.readFileSync('./dptsNames.json', 'utf8'));
const medsData = JSON.parse(fs.readFileSync('./medsData.json', 'utf8'));
const medsNames = JSON.parse(fs.readFileSync('./medsNames.json', 'utf8'));


let dptsInfo = {};
for(dpt of dpts){
  dptsInfo[dpt] = {pressure:{avgSysto:0, count:0},medication:[]}
  for(med of medsNames){
    dptsInfo[dpt].medication.push({name:med,count:0});
  }
}

for(user in usersData){
  for(record in usersData[user].records){
    let currentUserData = usersData[user].records[record];
    let currentDptPresure =dptsInfo[currentUserData.department].pressure;
    currentDptPresure.avgSysto = (currentDptPresure.avgSysto*currentDptPresure.count+currentUserData.systolicPressure)/(currentDptPresure.count+1);
    currentDptPresure.count+=1;
  }
}
for(userData in medsData){
  for(record in medsData[userData].records){
    let currentMedData =  medsData[userData].records[record];
    let currentDptMedication =dptsInfo[currentMedData.department].medication;
    for(med of currentDptMedication){
      if(med.name === currentMedData.name){
        med.count++;
      }
    }
  }
}
for(dpt in dptsInfo){
  dptsInfo[dpt].medication.sort(function(a,b){
    return b.count - a.count;
  })
}

fs.writeFile("./testResults.json", JSON.stringify(dptsInfo), function(err) {
    if(err) {
        return console.error(err);
    }
    console.log("The file 1 was saved!");
});
