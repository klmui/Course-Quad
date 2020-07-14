// connect to DB
var connection = mysql.createConnection({
  host: 'course-quad-db.czncdgwxrcel.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'sample'
});
connection.connect(function(error) {
  if (error) {
    console.log("Could not connect to DB: " + error);
  } else {
    console.log("Connected to DB");
  }
}); 
// // Local DB Connection:
// var connection = mysql.createConnection({
//   host: '127.0.0.1', 
//   user: 'root', 
//   password: '',
//   database: 'coursequad'
// });
// connection.connect(function(error) {
//   if (error) {
//     console.log("Could not connect to DB: " + error);
//   } else {
//     console.log("Connected to DB");
//   }
// }); 
global.connection = connection;