
const fs = require('fs');
const dpts = JSON.parse(fs.readFileSync(__dirname+'/MockData/dptsNames.json', 'utf8'));
const medsNames = JSON.parse(fs.readFileSync(__dirname+'/MockData/medsNames.json', 'utf8'));
//const usersData = JSON.parse(fs.readFileSync(__dirname+'/MockData/usersData.json', 'utf8'))["usersData"];
//const medsData = JSON.parse(fs.readFileSync(__dirname+'/MockData/medsData.json', 'utf8'))["medsData"];
const functions = require('firebase-functions');
const express = require("express");
const router = express();
const admin = require('firebase-admin');
const app = express();
const serviceAccount = require('./secret/secretkey.json');
const config 	   = require('./secret/config');
const bcrypt = require('bcrypt-nodejs');
const jwt        = require("jsonwebtoken");
const storage = require('@google-cloud/storage');
const superSecret = config.secret;
const Multer = require('multer');
const imgUpload = require('./UploadImage');
const Busboy = require("busboy")
const fireBaseApp = admin.initializeApp({ //No lo mueva puto
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://carma-heartbit.firebaseio.com'
});
const db = admin.database();
const userDataRef = db.ref("usersData");//Todos los datos
const rootRef = db.ref();
const headUserRef = db.ref("HeadUsers");
const medsDataRef = db.ref("medsData");

const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024
});



app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Authorization,Accept');
  next();
});


// Seria bueno separar las rutas en otro archivo
router.post("/authenticate",function(req,res){
  headUserRef.once("value").then((snap)=>snap.val()).then((json)=>{
    let user = req.body;
    let stored = null;
    for(let head in json){
      if(json[head].username===user.username){
        stored = json[head];
        break;
      }
    }
    if(stored){
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(user.password, salt);
      if( bcrypt.compareSync(user.password,stored.password )){
        var token = jwt.sign({
          name: stored.name,
          user: stored.username
        }, superSecret);
        // return the information including token as JSON
        return res.json({
          success: true,
          message: "Enjoy your token!",
          token: token,
          user:{name: stored.name,username: stored.username}
        });
      }
      else{
        return res.json({success:false,message:"Wrong password"});
      }
    }
    else{
      return res.json({
        success: false,
        message: "User not found"
      });
    }

  });
});


router.get("/mapInfo", function(req, res, next) {
  userDataRef.once("value").then((snap)=>snap.val()).then((usersData)=>{
    medsDataRef.once("value").then((snap)=>snap.val()).then((medsData)=>{

      let dptsInfo = {};
      for(dpt of dpts){
        dptsInfo[dpt] = {pressure:{avgSysto:0, count:0,color:""},medication:[]}
        for(med of medsNames){
          dptsInfo[dpt].medication.push({name:med,count:0});
        }
      }
      //Create averages of systolic pressure by department
      for(user in usersData){
        for(record in usersData[user].records){
          let currentUserData = usersData[user].records[record];
          let currentDptPresure =dptsInfo[currentUserData.department].pressure;
          currentDptPresure.avgSysto = (currentDptPresure.avgSysto*currentDptPresure.count+currentUserData.systolicPressure)/(currentDptPresure.count+1);
          currentDptPresure.count+=1;
        }
      }
      //Create list of medication by department
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
      //Create top 10 medication by department and stablish color
      for(dpt in dptsInfo){
        dptsInfo[dpt].pressure.color = Math.floor((dptsInfo[dpt].pressure.avgSysto-118)*255/47>255?255:(dptsInfo[dpt].pressure.avgSysto-118)*255/47);
        dptsInfo[dpt].medication.sort(function(a,b){
          return b.count - a.count;
        })
        dptsInfo[dpt].medication = dptsInfo[dpt].medication.slice(0,10);
      }
      res.send({success:true,data:dptsInfo})

    }).catch((err)=>{
      console.error(err);
    });

  }).catch((err)=>{
    console.error(err);
  });
});

// Seria bueno separar los helpers de los routes o por lo menos ponerlo despues.
multipartToJson = (req, res) => {
    if (req.method === 'POST') {
        const busboy = new Busboy({ headers: req.headers });
        let formData = {};

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
            // We're just going to capture the form data in a JSON document.
            formData[fieldname] = val;
        });

        busboy.on('finish', () => {
          res.send(formData);
        });
        // The raw bytes of the upload will be in req.rawBody.
        busboy.end(req.rawBody);
    } else {
        // Only support POST.
        res.status(405).end();
    }
}
router.post('/uploadPicture', multer.single("image"), imgUpload.uploadToGcs, function(request, response, next) {
  const data = request.body;
  if (request.file && request.file.cloudStoragePublicUrl) {
    data.imageUrl = request.file.cloudStoragePublicUrl;
  }
  response.send(data);

});
app.use('/api', router);



exports.app = functions.https.onRequest(app);
