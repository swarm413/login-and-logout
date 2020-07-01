var express=require('express');
var router=require('./router.js')
var path=require('path')
var session=require('express-session')
var bodyParser=require('body-parser')
var app=express();
app.use('/public/',express.static(path.join(__dirname,'./public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules')));
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views/'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
  secret:'keyboar582',
  resave:false,
  saveUninitialized:true
}))
app.use(router)
app.listen(3000,function(){
  console.log('running!')
})
