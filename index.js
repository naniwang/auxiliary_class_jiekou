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
app.get("/student/login", (req, res) => {
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
app.get("/manage/login", (req, res) => {
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
app.get("/student/list", (req, res) => {
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
app.get("/add/student", (req, res) => {
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
app.get("/del/student", (req, res) => {
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
//修改学生密码
app.get("/update/student/pwd", (req, res) => {
  var id = parseInt(req.query.id);
  var pwd = req.query.password
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.update({
        id: id
      }, {
        $set: {
          password: pwd
        }
      }, () => {
        res.send({
          code: 200
        });
        db.close();
      })
    })
  })
})
//查询课程列表
app.get("/course/list", (req, res) => {
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
app.get("/add/course", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  var obj = {}
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
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
app.get("/delete/course", (req, res) => {
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
//添加管理员
app.get("/add/admin", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      var id = 0
      var data = coll.find().sort({
        id: -1
      })
      if (data.length > 0) {
        id = data[0].id++
      }
      var obj = req.query
      obj.id = id
      // var obj = {
      //   id: id,
      //   name: req.query.name,
      //   mobile: req.query.mobile,
      //   account: req.query.account,
      //   password: req.query.password
      // }
      coll.insert(obj, () => {
        res.send('添加成功');
        db.close();
      })
    })
  })
})

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
app.listen(3000)