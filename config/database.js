const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_mysql_database_name',
  port: 25565
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});
