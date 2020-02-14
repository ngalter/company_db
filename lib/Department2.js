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
});


  createDepartment() {
    var newName = this.name;
    var query = connection.query(
      "INSERT INTO department SET ?",
      {
        name: `${newName}`,
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " department inserted!\n");
        console.table(query);
      }
    )
    return query;
  }
  updateDepartment() {
    console.log("Updating department...\n");
    var newName = this.name;
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
        console.table(query);
      }
    )
    return query;
  }
  deleteDepartment(name) {
    name = `Marketing`;
    console.log("Deleting department...\n");
    connection.query(
      "DELETE FROM department WHERE ?",
      {
        name: `${name}`
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " departments deleted!\n");
        console.table(query);
      }
    )
    return query;
  }
  readDepartments() {
    console.log("Selecting all departments...\n");
    this.connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      console.table(query);
    })
    return query;
  }
}

// Department.createDepartment(`Marketing`);
// Department.updateDepartment();
// Department.deleteDepartment(`Marketing`);
// Department.readDepartments();


module.exports = Department;