var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "companyDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  createDepartment();
});


function createDepartment() {
  console.log("Inserting a new department...\n");
  var newName = `Marketing`;
  var query = connection.query(
    "INSERT INTO department SET ?",
    {
      name: `${newName}`,
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " department inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      updateDepartment();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function updateDepartment() {
  console.log("Updating department...\n");
  var newName = 'Accounting';
  var oldName = `Business`;
  var query = connection.query(
    "UPDATE department SET ? WHERE ?",
    [
      {
        name: `${newName}`
      },
      {
        name: `${oldName}`
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      deleteDepartment();
    }
  );

  function deleteDepartment() {
    var deleteName = `Marketing`;
    console.log("Deleting department...\n");
    connection.query(
      "DELETE FROM department WHERE ?",
      {
        name: `${deleteName}`
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " departments deleted!\n");
        // Call readProducts AFTER the DELETE completes
        readDepartments();
      }
    );
  }

  function readDepartments() {
    console.log("Selecting all departments...\n");
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  };
}