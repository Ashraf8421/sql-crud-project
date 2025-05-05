//routing code 

const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Ashraf19'
});


 let  getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), 
    faker.internet.email(),
    faker.internet.password(),
  ];
  
};

app.get("/",(req,res)=>{
  let q = `SELECT count(*) FROM user`;
  try{
    connection.query(q,(err, result)=>{
    if(err) throw  err;
    let count = result[0]["count(*)"];
    res.render("home.ejs",{count});
  });
} catch(err){
  console.log(err);
  res.send("some error in DB");
}
});

//show route
app.get("/user",(req,res)=>{
  let q = `SELECT * FROM user`;
    try{
      connection.query(q,(err, users)=>{
      if(err) throw  err;
      res.render("showusers.ejs",{users});
    });
  } catch(err){
    console.log(err);
    res.send("some error in DB");
  }
});

//edit route
app.get("/user/:id/edit",(req,res)=>{
   let {id} =req.params;
   let q =`SELECT * FROM user WHERE id='${id}'`;

    try{
      connection.query(q,(err, result)=>{
        if(err) throw  err;
        let user = result[0];
        res.render("edit.ejs",{user});
      });
    } catch(err){
      console.log(err);
    }
});

//update(db) route
app.patch("/user/:id",(req,res)=>{
  let {id} =req.params;
   let {password : formPass , username : newUsername} = req.body;
   let q =`SELECT * FROM user WHERE id='${id}'`;
   try{
      connection.query(q,(err, result)=>{
        if(err) throw  err;
        let user = result[0];
        if(formPass != user.password){
          res.send("WRONG PASSWORD");
        }else{
          let q2 = `UPDATE user SET username = '${newUsername}' WHERE id='${id}'`;
          connection.query(q2 , (err,result)=>{
            if(err) throw err;
            //res.send(result);
            res.redirect("/user");
          })
        }
        
      });
    } catch(err){
      console.log(err);
      req.send("some error in DB");
    }
})

app.get("/newuser",(req,res)=>{
  res.render("user.ejs");
});

app.post("/user",(req,res)=>{
  
  let {username,email,password} = req.body;
  let q = `INSERT INTO user (id,username,email,password) VALUES(?,?,?,?)`;
  let id = uuidv4();
  let user= [id,username,email,password];

  try{
    connection.query(q,user,(err,result) => {
      if(err) throw err;
      res.redirect("/user");
    });
  } catch(err){
    console.log(err);
    res.send("error in DB");
  }
});

app.get("/delete/:id",(req,res) => {
  let {id} = req.params;
  res.render("delete.ejs",{id});
})

app.delete("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {email , password} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result) =>{
      if(err) throw err;
      let user = result[0];
      if(user.email !== email && user.password !== password){
        res.send("WRONG EMAIL OR PASSWORD");
      } else{
        q2 = `DELETE FROM user WHERE id ='${id}'`;
        try{
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
          })
        } catch(err){
          res.send("some error in DB");
        }
      }

    })
  } catch (err){
    req.send("some error in DB");
  }
});

app.listen(port,()=>{
  console.log("listening on port 8080");
});

// try{
//     connection.query(q,[data],(err, result)=>{
//     if(err) throw  err;
//     console.log(result);
//   });
// } catch(err){
//   console.log(err);
// }
// connection.end();


