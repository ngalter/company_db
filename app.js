const mysql = require("mysql");
const inquirer = require("inquirer");
const { viewDept } = require('./lib/Department');
const { addDept } = require('./lib/Department');
const { updateDept } = require('./lib/Department');
const { delDept } = require('./lib/Department');
const { deptBudget } = require('./lib/Management');
const { viewRole } = require('./lib/Role');
const { addRole } = require('./lib/Role');
const { updateRole } = require('./lib/Role');
const { delRole } = require('./lib/Role');
const { viewEmp } = require('./lib/Employee');
const { addEmp } = require('./lib/Employee');
const { updateEmp } = require('./lib/Employee');
const { delEmp } = require('./lib/Employee');

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "companyDB"
});
connection.connect(err => {
  if (err) throw err;
  runSearch();
});

// run the cli
const runSearch = () => {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Departments: View",
          "Departments: Add",
          "Departments: Update",
          "Departments: Delete",
          "Departments: View Budgets By Department",
          "Roles: View",
          "Roles: Add",
          "Roles: Update",
          "Roles: Delete",
          "Employees: View",
          "Employees: Add",
          "Employees: Update",
          "Employees: Delete",
          "exit"
        ]
      })
      .then(({ action }) => {
        switch (action) {
          case "Departments: View":
            viewDept(connection, runSearch);
            break;
          case "Departments: Add":
            addDept(connection, runSearch);
            break;
          case "Departments: Update":
            updateDept(connection, runSearch);
            break;
          case "Departments: Delete":
            delDept(connection, runSearch);
            break;
          case "Departments: View Budgets By Department":
            deptBudget(connection, runSearch);
            break;
          case "Roles: View":
            viewRole(connection, runSearch);
             break;
          case "Roles: Add":
            addRole(connection, runSearch);
            break;
          case "Roles: Update":
            updateRole(connection, runSearch);
            break;
          case "Roles: Delete":
            delRole(connection, runSearch);
            break;
          case "Employees: View":
            viewEmp(connection, runSearch);
             break;
          case "Employees: Add":
            addEmp(connection, runSearch);
            break;
          case "Employees: Update":
            updateEmp(connection, runSearch);
            break;
          case "Employees: Delete":
            delEmp(connection, runSearch);
            break;
          case "exit":
            connection.end();
            break;
        }
      });
};
