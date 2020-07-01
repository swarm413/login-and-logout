var express=require('express');
var User=require('./models/user.js')
var md5=require('md5')
var router=express.Router();
router.get('/',function(req,res){
  res.render('index.html',{
    user:req.session.user
  })
})
/*这是异步的登陆页面请求
router.get('/login',function(req,res){
  res.render('login.html')
})
*/
//这是同步的登陆页面请求
router.get('/login1',function(req,res){
  res.render('login1.html')
})

router.post('/login1',function(req,res){
  body=req.body;
  User.findOne({
    email:body.email,
    password:md5(md5(body.password)+"se")
  },function(err,user){
    if(err){
      return res.status(500).json(
        {
          err_code:500,
          message:err.message
        }
      )
    }
    if(!user){
      return res.render('login1.html',{
        err_message:"用户名或者密码错误，请重试"
      })
    }
    req.session.user=user;
    return res.status(200).json(
      {
        err_code:0,
        message:"ok"
      }
    )
  })
})
/*这是异步的
router.post('/login',function(req,res){
  body=req.body;
  User.findOne({
    email:body.email,
    password:md5(md5(body.password)+"se")
  },function(err,user){
    if(err){
      return res.status(500).json(
        {
          err_code:500,
          message:err.message
        }
      )
    }
    if(!user){
      return res.status(200).json(
        {
          err_code:1,
          message:"用户名或者密码不存在"
        }
      )
    }
    req.session.user=user;
    return res.status(200).json(
      {
        err_code:0,
        message:"ok"
      }
    )
  })
})
*/
router.get('/regist',function(req,res){
  res.render('register.html')
})
router.post('/regist',function(req,res){
var body=req.body;
//这个User.findOne错哪了？错写成User.findOne=({})了。这个方法直接调用传参就行了，加等于号怪怪的

User.findOne(
    {$or:[{
    eamil:body.email
  },
{
  nickname:body.nickname
}
  ]
    }
    ,function(err,data){
    if(err){
      return res.status(500).json({
        err_code:500,
        message:'服务端错误'
      });
    }
    //express提供了一个相应方法：json。该方法自动帮你吧对象转为字符串再发给浏览器，效果等于JSON.strlingfy
if(data){
  //邮箱或者昵称已存在 那data当然是1了不然是0
  return res.status(200).json(
    {//实际工作中我们用的是自定义的状态码表示状态，因此一般的项目都有文档
      //另外肯定不能if(message='用户已存在')else if(message='ok'),因为多个空格都不对，这就是要用状态码的原因
      err_code:1,
      message:'邮箱或昵称已存在'
    }
  )
}
body.password=md5(md5(body.password)+'se');//密码加密
new User(body).save(
  function(err,user){
if(err){
  return res.status(500).json({
    err_code:500,
    message:'服务端错误'
  })
}
req.session.user=user;//为什么在这里设置session?//这点不太懂
res.status(200).json({
  err_code:0,
  message:'ok'
})
}
)
 }
)
})
router.get('/logout',function(req,res){
  //混合状态，a链接是同步请求。直接重定向就好了
  req.session.user=null;
  res.redirect('/');
})
module.exports=router;
