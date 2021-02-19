var express = require('express');
var qs=require('qs')
var cors = require('cors');
var app = express()
var mongodb = require('mongodb').MongoClient;
var db_str = "mongodb://localhost:27017/mydb"
app.use(cors())

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=UTF-8");
  next();
});

//注册接口
app.get('/api/register', (req, res) => {
  // var username=req.query.username;
  var mobile = req.query.mobile;
  var password = req.query.password;

  mongodb.connect(db_str, (err, db) => {
    db.collection('users', (err, coll) => {
      // coll.find({username:username}).toArray((err,data)=>{
      //   if (data.length>0) {
      //     res.json({code:0,msg:'用户名已存在'})
      //     db.close()
      //   }else{
      coll.find({
        mobile: mobile
      }).toArray((err, data1) => {
        if (data1.length > 0) {
          res.json({
            code: 1,
            msg: '该手机号已被占用'
          })
          db.close()
        } else {
          coll.insert({
            username: username,
            mobile: mobile,
            password: password
          }, () => {
            res.json({
              code: 2,
              msg: '注册成功'
            })
            db.close()
          })
        }
        // })
        // }
      })
    })
  })
})
/**
 * 以下为学生操作内容
 */
//学生登陆接口
app.post("/api/student/login", (req, res) => {
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    // var obj=qs.parse(pData)
    var objData=JSON.parse(pData)
    mongodb.connect(db_str, (err, db) => {
      db.collection("student", (err, coll) => {
        coll.find(objData).toArray((err, data) => {
          if (data.length > 0) {
            res.json({
              code: 200,
              response: 'students'
            })
          } else {
            res.json({
              code: 201,
              msg: "用户名或密码错误"
            })
          }
          db.close();
        })
      })
    })
  })
})
// 查询个人信息
app.get('/api/get/personal/info',(req,res)=>{
  var stu_no=req.query.stu_no
  mongodb.connect(db_str,(err,db)=>{
    db.collection('student',(err,coll)=>{
      coll.find({stu_no:stu_no}).toArray((err,data)=>{
        if(data.length>0){
          res.json({
            code:200,
            response:true
          })
        }else{
          res.json({
            code:201,
            msg:'信息获取失败'
          })
        }
        db.close()
      })
    })
  })
})
// 修改密码
app.post('/api/update/personal/pwd',(req,res)=>{
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    var objData=JSON.parse(pData)
    mongodb.connect(db_str,(err,db)=>{
      db.collection('student',(err,coll)=>{
        coll.find({stu_no:objData.stu_no}).toArray((err,data)=>{
          if(data.length>0){
            if(data[0].password==objData.oldPwd){
              coll.update({stu_no:objData.stu_no},{$set:{passwrod:objData.newPwd}},(err1)=>{
                if(err1){
                  res.json({
                    code:201,
                    msg:'修改失败'
                  })
                }else{
                  res.json({
                    code:200,
                    response:true
                  })
                }
              })
            }else{
              res.json({
                code:201,
                msg:'原密码不正确'
              })
            }
          }else{
            res.json({
              code:201,
              msg:'该用户不存在'
            })
          }
        })
      })
    })
  })
})
// 成绩查询
app.get('/api/inquire/corse',(req,res)=>{
  mongodb.connect(db_str,(err,db)=>{
    db.collection('corse',(err,coll)=>{
      coll.find({stu_no:stu_no}).toArray((err,data)=>{
        if(data.length>0){
          res.json({
            code:200,
            response:true
          })
        }else{
          res.json({
            code:201,
            msg:'查询失败'
          })
        }
      })
    })
  })
})

/**
 * 以下为管理员操作内容
 */
//管理员登陆接口
app.post("/api/admin/login", (req, res) => {
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    // var obj=qs.parse(pData)
    var objData=JSON.parse(pData)
    mongodb.connect(db_str, (err, db) => {
      db.collection("admin", (err, coll) => {
        coll.find(objData).toArray((err, data) => {
          if (data.length > 0) {
            res.json({
              code: 200,
              response: 'admins'
            })
            db.close();
          } else {
            res.json({
              code: 201,
              msg: "用户名或密码错误"
            })
            db.close();
          }
        })
      })
    })
  })
})
//获取用户信息
app.get("/api/user/info", (req, res) => {
  var type = req.query.type
  var account = req.query.account
  mongodb.connect(db_str, (err, db) => {
    let collect = type == 'students' ? 'student' : 'admin'
    db.collection(collect, (err, coll) => {
      coll.find({
        account: account
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 200,
            response: data[0]
          })
        } else {
          res.json({
            code: 201,
            msg: '用户信息获取失败'
          })
        }
        db.close();
      })
    })
  })
})
//查询学生列表
app.get("/api/student/list", (req, res, next) => {
  var obj={}
  if(req.query.name){
    obj.name = req.query.name
  }
  if(req.query.stu_no){
    obj.stu_no = req.query.stu_no
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        db.close();
      })
    })
  })
})
//添加或编辑学生
app.post("/api/add/student", (req, res) => {
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    var obj=JSON.parse(pData)
    var stu_no = obj.stu_no || ''
    delete obj._id
    console.log(obj,'obj')
    mongodb.connect(db_str, (err, db) => {
      db.collection("student", (err, coll) => {
        if (stu_no) {
          coll.update({
            stu_no: stu_no
          }, {
            $set: obj
          }, (err1,rest2) => {
            if(err1){
              res.json({
                code: 201,
                msg: err1.errmsg
              })
            }else if(rest2){
              res.json({
                code: 200,
                response: true
              })
            }
            db.close();
          })
        } else {
          var now=new Date();
          var month=now.getMonth()+1
          var day=now.getDate()
          var hours=now.getHours()
          var minutes=now.getMinutes()
          var seconds=now.getSeconds()
          let stus_no=now.getFullYear()+(month<10?'0'+month:month)+(day<10?'0'+day:day)+(hours<10?'0'+hours:hours)+(minutes<10?'0'+minutes:minutes)+(seconds<10?'0'+seconds:seconds)
          obj.stu_no=stus_no
          obj.password=stus_no.substring(stus_no.length-6);
          obj.gender=parseInt(obj.gender)
          coll.insert(obj, (err1,rest2) => {
            if(err1){
              res.json({
                code: 201,
                msg: err1.errmsg
              })
            }else if(rest2){
              res.json({
                code: 200,
                response: true
              })
            }
            db.close();
          })
        }
      })
    })
  })
})
//删除学生
app.get("/api/del/student", (req, res) => {
  var stu_no =req.query.stu_no;
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.remove({
        stu_no: stu_no
      }, () => {
        res.json({
          code: 200,
          response: true
        })
        db.close();
      })
    })
  })
})
//修改学生密码
app.get("/api/update/student/pwd", (req, res) => {
  var stu_no = req.query.stu_no;
  var pwd = req.query.password
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.update({
        stu_no: stu_no
      }, {
        $set: {
          password: pwd
        }
      }, () => {
        res.json({
          code: 200,
          response: true
        });
        db.close();
      })
    })
  })
})
//获取学生信息详情(根据学号查询)
app.get("/api/student/info", (req, res) => {
  var stu_no = req.query.stu_no
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.find({
        stu_no: stu_no
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 200,
            response: data[0]
          })
        } else {
          res.json({
            code: 201,
            msg: '信息获取失败'
          })
        }
        db.close();
      })
    })
  })
})
//查询课程列表
app.get("/api/course/list", (req, res) => {
  var obj = {}
  if(req.query.name){
    obj.name=req.query.name
  }
  if(req.query.course_no){
    obj.course_no=req.query.course_no
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        db.close();
      })
    })
  })
})
//添加或编辑课程
app.post("/api/add/course", (req, res) => {
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    var obj=JSON.parse(pData)
    var id = obj._id || 0
    delete obj._id
    mongodb.connect(db_str, (err, db) => {
      db.collection("course", (err, coll) => {
        if (id != 0) {
          coll.update({
            _id: id
          }, {
            $set: obj
          }, (err1,rest2) => {
            if(err1){
              res.json({
                code: 201,
                msg: err1.errmsg
              })
            }else if(rest2){
              res.json({
                code: 200,
                response: true
              })
            }
            db.close();
          })
        } else {
          coll.insert(obj, (err1,rest2) => {
            if(err1){
              res.json({
                code: 201,
                msg: err1.errmsg
              })
            }else if(rest2){
              res.json({
                code: 200,
                response: true
              })
            }
            db.close();
          })
        }
      })
    })
  })
})
//删除课程
app.get("/api/delete/course", (req, res) => {
  var id = parseInt(req.query.id);
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.remove({
        id: id
      }, () => {
        res.json({
          code: 200,
          response: true
        })
        db.close();
      })
    })
  })
})
//获取课程信息详情(根据id查询)
app.get("/api/course/info", (req, res) => {
  var id = req.query.id
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.find({
        id: id
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 200,
            response: data[0]
          })
        } else {
          res.json({
            code: 201,
            msg: "信息获取失败"
          })
        }
        db.close();
      })
    })
  })
})
//查询管理员列表
app.get("/api/admin/list", (req, res) => {
  var obj = {}
  if(req.query.name){
    obj.name=req.query.name
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        db.close();
      })
    })
  })
})
//添加管理员
app.post("/api/add/admin", (req, res) => {
  var pData=''
  req.on('data',function(postData){
    pData+=postData
  })
  req.on('end',function(){
    var obj=JSON.parse(pData)
    mongodb.connect(db_str, (err, db) => {
      db.collection("admin", (err, coll) => {
        coll.find({
          account: obj.account
        }).toArray((err, data) => {
          if (data.length > 0) {
            res.json({
              code: 201,
              msg: "该账户已存在"
            })
          } else {
            obj.status=1
            coll.insert(obj, (err1) => {
              if(err1){
                res.json({
                  code: 201,
                  msg: err1.errmsg
                })
              }else{
                res.json({
                  code: 200,
                  response: true
                })
              }
              db.close();
            })
          }
        })
      })
    })
  })
})
//禁用或启用管理员
app.get("/api/update/admin/status", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      var _id = req.query.id
      var status = req.query.status
      coll.update({
        _id: _id
      }, {
        $set: {
          status: status
        }
      }, (err1) => {
        if(err1){
          res.json({
            code: 201,
            msg: err1.errmsg
          })
        }else{
          res.json({
            code: 200,
            response: true
          })
        }
        db.close();
      })
    })
  })
})

/**
 * 以下内容暂不使用
 */

//查询教师列表
app.get("/teacher/list", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("teacher", (err, coll) => {
      coll.find({}).toArray((err, data) => {
        res.send(data)
        db.close();
      })
    })
  })
})
//添加或编辑教师
app.get("/add/teacher", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  mongodb.connect(db_str, (err, db) => {
    db.collection("teacher", (err, coll) => {
      var obj = {}
      if (id > 0) {
        coll.update({
          id: id
        }, {
          $set: obj
        }, () => {
          res.send('编辑成功');
          db.close();
        })
      } else {
        coll.insert(obj, () => {
          res.send('添加成功');
          db.close();
        })
      }
    })
  })
})
//删除教师
app.get("/delete/teacher", (req, res) => {
  var id = parseInt(req.query.id);
  mongodb.connect(db_str, (err, db) => {
    db.collection("teacher", (err, coll) => {
      coll.remove({
        id: id
      }, () => {
        res.send('删除成功');
        db.close();
      })
    })
  })
})
app.listen(3333)