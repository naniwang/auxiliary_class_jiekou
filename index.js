var express=require('express');
var cors=require('cors');
var app=express()
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/mydb"
app.use(cors())

//注册接口
app.get('/register',(req,res)=>{
	// var username=req.query.username;
	var phoneNum=req.query.phoneNum;
  var password=req.query.password;
		
  mongodb.connect(db_str,(err,db)=>{
    db.collection('users',(err,coll)=>{
      // coll.find({username:username}).toArray((err,data)=>{
      //   if (data.length>0) {
      //     res.json({code:0,msg:'用户名已存在'})
      //     db.close()
      //   }else{
          coll.find({phoneNum:phoneNum}).toArray((err,data1)=>{
            if(data1.length>0){
              res.json({code:1,msg:'该手机号已被占用'})
              db.close()
            }else{
              coll.insert({username:username,phoneNum:phoneNum,password:password},()=>{
                res.json({code:2,msg:'注册成功'})
                db.close()
              })
            }
          // })
        // }
      })
    })
  })
})
//用户登陆接口
app.get("/userlogin",(req,res)=>{
	var phoneNum=req.query.phoneNum;
	var password=req.query.password;
	mongodb.connect(db_str,(err,db)=>{
		db.collection("users",(err,coll)=>{
			coll.find({phoneNum:phoneNum,password:password}).toArray((err,data)=>{
				if(data.length>0){
					res.json({code:1,msg:"登陆成功"})
					db.close();
				}else{
					res.json({code:0,msg:"用户名或密码错误"})
					db.close();
				}
			})
		})
	})
})