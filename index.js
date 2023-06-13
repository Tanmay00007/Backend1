const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const User=require('./models/user')
const Form=require('./models/form')
const nodemailer = require('nodemailer');


dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "packermovers07@gmail.com",
    pass: "hsuhskolgwpttxyy",
  },
});

app.post('/api/signup', async (req, res) => {
  const username ="Tanmay";
  const password = "tanmay123"
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ username: user.username }, 'secret');
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error signing up user');
  }
});

app.post('/api/submit',async(req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const from = req.body.from;
  const to = req.body.to;
  const date = req.body.date;
  const mail = {
    from: "packers@gmail.com",
    to: email,
    subject: "Booking Details",
    html: `<p>You Have successfully booked the ride</p>
           <p>From: ${from}</p>
           <p>To: ${to}</p>
           <p>Date: ${date}</p>
           <p>You Will Recieve an email after we confirm your Order</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });

  
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
 
  try {
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }
    const token = jwt.sign({ username: user.username }, 'secret');
    console.log(user)
    res.json({ 
      token,
      username});
   
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging in user');
  }
});

app.post('/api/contact',(req,res)=>{
  const subject = req.body.subject;
  const email = req.body.email;
  const message = req.body.message; 
  const mail = {
    from: "packers@gmail.com",
    to: email,
    subject: "Contact Form Submission",
    html: `<p>Name: ${subject}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
})

/* MONGOOSE SETUP */
const PORT =process.env.PORT || 6001;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=> console.log(`server port : ${PORT}`));

}).catch((error)=> console.log(`${error} did not connect`));