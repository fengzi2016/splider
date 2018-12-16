var mysql = require('mysql');
var str = require('./toptens');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '201606006',
  database : 'search'
});
 
connection.connect();
str = str.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
str = str.replace(/[\u0000-\u0019]+/g,""); 
str = JSON.parse(str);
var jsonoj = eval(`(${str})`);
console.log(jsonoj[0]);
// jsonoj[0].forEach(element => {
//   const {goal,result,method} = element;
//   connection.query(`insert into search (goal,result,method) values(${goal},${result},${method})`, function (error, results, fields) {
//     if (error) throw error;
//   });
// });
