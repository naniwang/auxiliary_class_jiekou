var express = require('express');
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
//学生登陆接口
app.get("/api/student/login", (req, res) => {
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
            response: 'students'
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
app.get("/api/manage/login", (req, res) => {
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
          // let callbackData = {}
          res.json({
            code: 200,
            response: data[0]
          })
          // res.send(data[0])
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
//查询学生列表
app.get("/api/student/list", (req, res, next) => {
  alert('33333333333333')
  var obj = {
    name: req.query.name || '',
    stu_no: req.query.stu_no || '',
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        // res.send(data)
        db.close();
      })
    })
  })
})
//添加或编辑学生
app.get("/api/add/student", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  var obj = req.query
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      if (id > 0) {
        coll.update({
          id: id
        }, {
          $set: obj
        }, () => {
          res.json({
            code: 200,
            response: true
          })
          // res.send('编辑成功');
          db.close();
        })
      } else {
        coll.insert(obj, () => {
          res.json({
            code: 200,
            response: true
          })
          // res.send('添加成功');
          db.close();
        })
      }
    })
  })
})
//删除学生
app.get("/api/del/student", (req, res) => {
  var stu_no = parseInt(req.query.stu_no);
  mongodb.connect(db_str, (err, db) => {
    db.collection("student", (err, coll) => {
      coll.remove({
        stu_no: stu_no
      }, () => {
        res.json({
          code: 200,
          response: true
        })
        // res.send('删除成功');
        db.close();
      })
    })
  })
})
//修改学生密码
app.get("/api/update/student/pwd", (req, res) => {
  var stu_no = parseInt(req.query.stu_no);
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
          // res.send(data[0])
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
  var obj = {
    name: req.query.name || '',
    course_no: req.query.course_no || null
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        // res.send(data)
        db.close();
      })
    })
  })
})
//添加或编辑课程
app.get("/api/add/course", (req, res) => {
  var id = 0;
  id = req.query.id ? req.query.id : 0
  var obj = req.query
  mongodb.connect(db_str, (err, db) => {
    db.collection("course", (err, coll) => {
      if (id > 0) {
        coll.update({
          id: id
        }, {
          $set: obj
        }, () => {
          res.json({
            code: 200,
            response: true
          })
          // res.send('编辑成功');
          db.close();
        })
      } else {
        coll.insert(obj, () => {
          res.json({
            code: 200,
            response: true
          })
          // res.send('添加成功');
          db.close();
        })
      }
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
        // res.send('删除成功');
        db.close();
      })
    })
  })
})
//获取课程信息详情(根据id查询)
app.get("/api/student/info", (req, res) => {
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
        // res.send(data)
        db.close();
      })
    })
  })
})
//查询管理员列表
app.get("/api/admin/list", (req, res) => {
  var obj = {
    name: req.query.name || '',
  }
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      coll.find(obj).toArray((err, data) => {
        res.json({
          code: 200,
          response: data
        })
        // res.send(data)
        db.close();
      })
    })
  })
})
//添加管理员
app.get("/api/add/admin", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      coll.find({
        account: req.query.account
      }).toArray((err, data) => {
        if (data.length > 0) {
          res.json({
            code: 201,
            msg: "该账户已存在"
          })
        } else {
          var id = 0
          var data = coll.find().sort({
            id: -1
          })
          if (data.length > 0) {
            id = data[0].id++
          }
          // var obj = req.query
          obj.id = id
          var obj = {
            id: id,
            status: 1,
            name: req.query.name,
            mobile: req.query.mobile,
            account: req.query.account,
            password: req.query.password
          }
          coll.insert(obj, () => {
            res.json({
              code: 200,
              response: true
            })
            // res.send('添加成功');
            db.close();
          })

        }
      })
    })
  })
})
//禁用或启用管理员
app.get("/api/update/admin/status", (req, res) => {
  mongodb.connect(db_str, (err, db) => {
    db.collection("admin", (err, coll) => {
      var id = req.query.id
      var status = req.query.status
      coll.update({
        id: id
      }, {
        $set: {
          status: status
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