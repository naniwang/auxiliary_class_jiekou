var express = require('express');
var cors = require('cors');
var app = express()
var mongodb = require('mongodb').MongoClient;
var db_str = "mongodb://localhost:27017/mydb"
app.use(cors())

//注册接口
app.get('/register', (req, res) => {
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
//学生登陆接口
app.get("/studentlogin", (req, res) => {
  var account = req.query.account;
  var password = req.query.password;
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.find({
        account: account,
        password: password
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 200,
            msg: "登陆成功"
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
//管理员登陆接口
app.get("/managelogin", (req, res) => {
  var account = req.query.account;
  var password = req.query.password;
  mongodb.connect(db_str, (err, db) => {
    db.collection("manage", (err, coll) => {
      coll.find({
        account: account,
        password: password
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 200,
            msg: "登陆成功"
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
//查询学生列表
app.get("/studentlist", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.find({}).toArray((err, data) => {
        res.send(data)
        db.close();
      })
    })
  })
})
//添加或编辑学生
app.get("/addstudent", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
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
//删除学生
app.get("/delstudent", (req, res) => {
  var id = parseInt(req.query.id);
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.remove({
        id: id
      }, () => {
        res.send('删除成功');
        db.close();
      })
    })
  })
})
//查询课程列表
app.get("/courselist", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.find({}).toArray((err, data) => {
        res.send(data)
        db.close();
      })
    })
  })
})
//添加或编辑课程
app.get("/addcourse", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
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
//删除课程
app.get("/deletecourse", (req, res) => {
  var id = parseInt(req.query.id);
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.remove({
        id: id
      }, () => {
        res.send('删除成功');
        db.close();
      })
    })
  })
})
//查询教师列表
app.get("/teacherlist", (req, res) => {
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
app.get("/addteacher", (req, res) => {
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
app.get("/deleteteacher", (req, res) => {
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
app.listen(3000)