const express = require('express');
const cors = require('cors');//Cross-Origin Resource Sharing (CORS) for the Express application. CORS is a mechanism that allows a web application to make requests to another domain (origin) outside of its own domain.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
var nodemailer = require('nodemailer');
// const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs'); //To rename file on the server
// const mime = require('mime-types');
// require('dotenv').config();//we have require dotenv package and we are running config on it.
require('dotenv').config(); //we are require this dotenv and config on it

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
//const bucket = 'dawid-booking-app';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));//sending photo to http://localhost/4000/uploads

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',  //What kind of app should be able to communicate with our API 
  // http://localhost:5173   we van not use this ip->http://127.0.0.1:5173
}));

// async function uploadToS3(path, originalFilename, mimetype) {
//   const client = new S3Client({
//     region: 'us-east-1',
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY,
//       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     },
//   });
//   const parts = originalFilename.split('.');
//   const ext = parts[parts.length - 1];
//   const newFilename = Date.now() + '.' + ext;
//   await client.send(new PutObjectCommand({
//     Bucket: bucket,
//     Body: fs.readFileSync(path),
//     Key: newFilename,
//     ContentType: mimetype,
//     ACL: 'public-read',
//   }));
//   return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
// }

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);//mongodb+srv://booking:<password>@cluster0.aeckhlo.mongodb.net/?retryWrites=true&w=majority
                                        //mongodb+srv://booking:30112000@cluster0.aeckhlo.mongodb.net/?retryWrites=true&w=majority

app.get('/test', (req, res) =>{
//   res.send('Hello, world!');
//  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});
//Password->  30112000

//Endpoint for register
app.post('/register',async(req,res)=>{
//app.post('/api/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,userType,password}=req.body;
  try{
    //We want collection for our users
    const userDoc = await User.create({
      name,
      email,
      userType,
      password:bcrypt.hashSync(password, bcryptSalt), //we need encription for this password
    });

    //Send confirmation email

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.SENDER_GMAIL_PASSCODE,
  }
});

var mailOptions = {
  from: process.env.SENDER_GMAIL,
  to: req.body.email,
  subject: 'Registration successful',
  text: `Hi ${req.body.name},
          Welcome to Tripify, your one-stop point to book outing plans. You command us and we will take care of the rest.
          
Thanks & Regards,
Mr. Tanmay Samanta
Team Tripify`,   
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
//Send email code end
    // res.json(name,email,password); //start by responding json to the data we are sending
    res.json(userDoc); //respond with user document
  }
  catch(e){
    res.status(422).json(e);
  }
});

//Endpoint for login

app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;//let's takes email,password from request body
  const userDoc = await User.findOne({email});

  if (userDoc) {
    // res.json('found');
    //we will check whether the password ok after encrytion
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // res.json('password ok');
      //when the pass is ok, then we can able to login and create json web token and want to respond with a cookie
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id,
        // name:userDoc.name33
      }, jwtSecret, {}, (err,token) =>{
        if (err) throw err;
        //res.cookie('token', token).json('pass ok');//we will get token from the above sign() method
        res.cookie('token', token).json({success:true,userDoc});//we will get token from the above sign() method
      });
    }
    else{
      res.status(201).json({success:false, messege:`pass not ok`});
    }
  }
  else {
    // res.json('not found');333
    res.status(201).json({success:false, messege:`user not found`});
  }
});


//Endpoint for profile
app.get('/profile', (req,res) => {
  //mongoose.connect(process.env.MONGO_URL);
  
  const {token} = req.cookies;
  //res.json(token);
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,userType,email,_id} = await User.findById(userData.id);

      res.json({name,userType,email,_id});
    });
  } else {
    res.json(null);
  }
});




//Endpoint for logout
app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


//Endpoint for upload photoes by link
// console.log(__dirname);
//app.post('/api/upload-by-link', async (req,res) => {
app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';  //this will go to the filename
  await imageDownloader.image({                         //Download the image
    url: link, 
    // dest: '/tmp/' +newName,
    dest: __dirname+'/uploads/'+newName,
  });
  // const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  // res.json(url);
  res.json(newName);
});

//Cancel Booking Code
app.get('/account/bookings/cancel/:id', async () => { //'/api/places/:id'
  //   mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    console.log("Hi")
  });

//Endpoint for upload photoes by Upload button
const photosMiddleware = multer({dest:'uploads'});  // multer({dest:'/tmp'})
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  // console.log(req.files);
  //Let's rename the file uploaded image as this are uploaded with any extension 
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const{path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));//   uploadedFiles.push(url);
                                  //  ('uploads/','')
  //   const {path,originalname,mimetype} = req.files[i];
  //   const url = await uploadToS3(path, originalname, mimetype);
  
  }
  // res.json(req.files);
  res.json(uploadedFiles); 
});

app.post('/places', (req,res) => {
//   mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;

  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,   //userData.id decreapted token cookies
      title,address,photos:addedPhotos,description,  //photos:addedPhotos
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req,res) => {   // '/api/user-places'
//   mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies; //grap the token 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => { //decript the token
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

//Getting the user id
app.get('/places/:id', async (req,res) => { //'/api/places/:id'
//   mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

//Putting the updated info in places
app.put('/places', async (req,res) => {  //'/api/places'
//   mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;

  //Check for the same userid or not
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

 app.get('/places', async (req,res) => {
//   mongoose.connect(process.env.MONGO_URL);
  res.json( await Place.find() );
});


  app.get('/places/:id', async (req,res) => { //'/api/places/:id'
    //   mongoose.connect(process.env.MONGO_URL);
      const {id} = req.params;
      res.json(await Place.findById(id));
    });




// Putting booking info
app.post('/bookings', async (req, res) => { //'/api/bookings'
  // mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req,res) => {   //  '/api/bookings'
  // mongoose.connect(process.env.MONGO_URL);
  //Booking private so we will use cookes here
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );  //get the referencr of Place object
});


app.listen(4000);