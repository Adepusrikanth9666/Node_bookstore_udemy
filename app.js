const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error');
const User = require('./models/user')


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const { where } = require('sequelize');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  User.findById('663355a6061bc1a37b707188').then(user=>{
    req.user= user
    next()
  }).catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://srikanthadepu17:vHu9RyeGGSH5H9iy@nodepracice.as39e6j.mongodb.net/shop?retryWrites=true&w=majority&appName=NodePracice').then((result)=>{

User.findOne().then(user=>{
  if(!user){

    const user = new User({
      name:'srikanth',
      email:'sri@gmail.com',
      cart:{
        items:[]
      }
    });
    user.save()
  }
})
  app.listen(3000)
}).catch(err=>console.log(err))