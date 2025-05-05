//this code is the practice code of linking sql or using sql from cli
//cli starting code mysql -u root -p
//running this file is index.js

const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Ashraf19'
});

//inserting new data
//let q = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
//let users = ["123b" , "123_newuserb","abc@gmail.comb","abcb"],

//inserting multiple user through user array instead of doing user1 user 2
// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let users = [
//   ["123b" , "123_newuserb","abc@gmail.comb","abcb"],
//   ["123c" , "123_newuserc","abc@gmail.comc","abcc"],
// ];

 let  getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), 
    faker.internet.email(),
    faker.internet.password(),
  ];
    
}


//insert in bulk
let q = "INSERT INTO user (id,username,email,password) VALUES ?";
let data = [];
for(let i=1;i<=100;i++){
  data.push(getRandomUser());//100 fake users data
}


try{
    connection.query(q,[data],(err, result)=>{
    if(err) throw  err;
    console.log(result);
  });
} catch(err){
  console.log(err);
}
connection.end();


