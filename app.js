const mysql = require("mysql");
const inquirer = require("inquirer");
const { viewDept } = require('./lib/Department');
const { addDept } = require('./lib/Department');
const { updateDept } = require('./lib/Department');
const { delDept } = require('./lib/Department');
const { viewRole } = require('./lib/Role');
const { addRole } = require('./lib/Role');
const { updateRole } = require('./lib/Role');
const { delRole } = require('./lib/Role');

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
          "View Departments",
          "Add A Department",
          "Update A Department",
          "Delete A Department",
          "View Roles",
          "Add A Role",
          "Update A Role",
          "Delete A Role",
          "exit"
        ]
      })
      .then(({ action }) => {
        switch (action) {
          case "View Departments":
            viewDept(connection, runSearch);
            break;
          case "Add A Department":
            addDept(connection, runSearch);
            break;
          case "Update A Department":
            updateDept(connection, runSearch);
            break;
          case "Delete A Department":
            delDept(connection, runSearch);
            break;
          case "View Roles":
            viewRole(connection, runSearch);
             break;
          case "Add A Role":
            addRole(connection, runSearch);
            break;
          case "Update A Role":
            updateRole(connection, runSearch);
            break;
          case "Delete A Role":
            delRole(connection, runSearch);
            break;
          case "exit":
            connection.end();
            break;
        }
      });
};

// department funcs
// const viewDept = () => {
//     const query = "SELECT * FROM department ORDER BY name ASC";
//     connection.query(query, (err, res) => {
//         console.table(res);
//         runSearch();
//     });
// };

// const addDept = () => {
//   inquirer
//     .prompt({
//       name: "name",
//       type: "input",
//       message: "Enter Department Name: "
//       })
//       .then(({ name }) => {
//       const query = connection.query(
//         "INSERT INTO department SET ?",
//         {
//           name: name
//         },
//         function (err, res) {
//           if (err) throw err;
//           console.log(`${name} department added.`);
//           runSearch();
//         });
//     });
// }

// const updateDept = () => {
//   const query = "SELECT name FROM department ORDER BY name ASC";
//   connection.query(query, (err, res) => {
//     const depts = [];
//     for (var i = 0; i < res.length; i++) {
//       depts.push(res[i].name);
//           }
//           inquirer
//             .prompt({
//               name: "dept",
//               type: "list",
//               message: "What department would you like to update?",
//               choices: depts
//             })
//             .then(({ dept }) => {
//               inquirer
//                 .prompt({
//                   name: "newDept",
//                   type: "input",
//                   message: `Update name of ${dept} department: `
//                 }).then(({ newDept }) => {
//                   var query = "UPDATE department SET ? WHERE ?";
//                     connection.query(query,
//                     [{ name: newDept }, { name: dept }],
//                     (err, res) => {
//                     if (err) throw err;
//                     console.log(`${dept} department updated to ${newDept}.`);
//                     runSearch();
//                   });
//                 });
//             });
//         });
//       }
 
// const delDept = () => {
//   const query = `SELECT name FROM department left JOIN role ON role.department_id = department.id
//   WHERE role.department_id IS NULL`
//   connection.query(query, (err, res) => {
//     const depts = [];
//     for (var i = 0; i < res.length; i++) {
//       depts.push(res[i].name);
//     }
//     if (depts.length > 0) {
//       inquirer
//         .prompt({
//           name: "dept",
//           type: "list",
//           message: "What department would you like to delete?",
//           choices: depts
//         })
//         .then(({ dept }) => {
//           var query = "DELETE FROM department WHERE ?";
//           connection.query(query,
//             { name: dept },
//             (err, res) => {
//               if (err) throw err;
//               console.log(`${dept} deleted.`);
//               runSearch();
//             });
//         });
//     } else {
//       console.log("No unreferenced departments to delete.")
//       runSearch();
//     }
//   });
// }

// role funcs
// const viewRole = (connection, runSearch) => {
//     const query = "SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.title ASC";
//     connection.query(query, (err, res) => {
//         console.table(res);
//         runSearch();
//     });
// };

// const addRole = (connection, runSearch) => {

//   const query = "SELECT name FROM department ORDER BY name ASC";
//   connection.query(query, (err, res) => {
//     var depts = [];
//     const roleQuery = [
//       {
//         name: "title",
//         type: "input",
//         message: "Enter Role Title: "
//       },
//       {
//         name: "salary",
//         type: "input",
//         message: "Enter Salary: "
//       },
//       {
//         name: "dept",
//         type: "list",
//         message: "What department does this role belong to?",
//         choices: depts
//       }
//     ]
//     for (var i = 0; i < res.length; i++) {
//       depts.push(res[i]);
//     }
//     inquirer
//       .prompt(roleQuery)
//       .then(({ title, salary, dept }) => {        
//         const query = "SELECT id FROM department WHERE ?";
//         connection.query(query, { name: dept }, (err, res) => {
//           const query = "INSERT INTO role SET ?";
//           connection.query(query,
//             {
//               title: title,
//               salary: salary,
//               department_id: res[0].id
//             },
//             (err, res) => {
//               if (err) throw err;
//               console.log(`Role ${title} inserted.`);
//               runSearch();
//             });
//         });
//       });
//   });
// }

// const delRole = (connection, runSearch) => {
//   const query = "SELECT title FROM role ORDER BY title ASC";
//   connection.query(query, (err, res) => {
//     const titles = [];
//     for (var i = 0; i < res.length; i++) {
//       titles.push(res[i].title);
//     }
//     inquirer
//       .prompt({
//         name: "role",
//         type: "list",
//         message: "What role would you like to delete?",
//         choices: titles
//       })
//       .then(({ role }) => {
//         var query = "DELETE FROM role WHERE ?";
//           connection.query(query,
//           { title: role },
//           (err, res) => {
//           if (err) throw err;
//           console.log(`${role} deleted.`);
//           runSearch();
//         });
//       });
//   });
// }
// const updateRole = (connection, runSearch) => {
//   const query = "SELECT title FROM role ORDER BY title ASC";
//   connection.query(query, (err, res) => {
//     const roles = [];
//     for (var i = 0; i < res.length; i++) {
//       roles.push(res[i].title);
//     }
//     inquirer
//       .prompt({
//         name: "role",
//         type: "list",
//         message: "What role would you like to update?",
//         choices: roles
//       })
//       .then(({ role }) => {
//         inquirer
//           .prompt([{
//             name: "newSalary",
//             type: "input",
//             message: `Update the salary for ${role}: `
//           },
//           {
//             name: "newRole",
//             type: "input",
//             message: `Update the title for ${role}: `
//           }]).then(({ newSalary, newRole }) => {
//             const query = "SELECT title, salary FROM role WHERE ?";
//             connection.query(query, { title: role }, (err, res) => {
//               if (!newSalary) {
//                 newSalary = res[0].salary;
//               }
//               if (!newRole) {
//                 newRole = res[0].title;
//               }
//               var query = "UPDATE role SET ? WHERE ?";
//               connection.query(query,
//                 [{ title: newRole, salary: newSalary }, { title: role }],
//                 (err, res) => {
//                   if (err) throw err;
//                   console.log(`${role} title updated to ${newRole}.`);
//                   console.log(`${role} salary updated to ${newSalary}.`);
//                   runSearch();
//                 });
//             });
//           });
//       });
//   });
// }