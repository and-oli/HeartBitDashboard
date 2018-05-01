const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const express = require("express");
const router = express();
const admin = require('firebase-admin');
var app = express();

const serviceAccount = require('./secret/secretkey.json');
const fireBaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://carma-heartbit.firebaseio.com'
});
var db = admin.database();
var ref = db.ref("usersData");

function getUserData(){
  return ref.once("value").then( (snap) => snap.val());
}
// Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });
/* GET home page. */
router.get("/", function(req, res, next) {
  getUserData().then((data) =>{
      res.send({success:true,data:data})
  })
  //res.render("index", { title: "Express" });
});
app.use('/api', router);

exports.app = functions.https.onRequest(app);
