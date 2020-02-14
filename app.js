const mysql = require("mysql");
const inquirer = require("inquirer");
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
            viewDept();
            break;
          case "Add A Department":
            addDept();
            break;
          case "Update A Department":
            updateDept();
            break;
          case "Delete A Department":
            delDept();
            break;
          case "View Roles":
            viewRole();
             break;
          case "Add A Role":
            addRole();
            break;
          case "Update A Role":
            updateRole();
            break;
          case "Delete A Role":
            delRole();
            break;
          case "exit":
            connection.end();
            break;
        }
      });
};
  
const viewDept = () => {
    const query = "SELECT * FROM department ORDER BY name ASC";
    connection.query(query, (err, res) => {
        console.table(res);
        runSearch();
    });
};

const addDept = () => {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Enter Department Name: "
      })
      .then(({ name }) => {
      const query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: name
        },
        function (err, res) {
          if (err) throw err;
          console.log(`${name} department added.`);
          runSearch();
        });
    });
}

const updateDept = () => {
  const query = "SELECT name FROM department ORDER BY name ASC";
  connection.query(query, (err, res) => {
    const depts = [];
    for (var i = 0; i < res.length; i++) {
      depts.push(res[i].name);
    }
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "What department would you like to update?",
        choices: depts
      })
      .then(({ dept }) => {
        inquirer
          .prompt({
            name: "newDept",
            type: "input",
            message: `Make your change to ${dept}: `
          }).then(({ newDept }) => {
            var query = "UPDATE department SET ? WHERE ?";
              connection.query(query,
              [{ name: newDept }, { name: dept }],
              (err, res) => {
              if (err) throw err;
              console.log(`${dept} department updated to ${newDept}.`);
              runSearch();
            });
          });
      });
  });
}
 
const delDept = () => {
  const query = "SELECT name FROM department ORDER BY name ASC";
  connection.query(query, (err, res) => {
    const depts = [];
    for (var i = 0; i < res.length; i++) {
      depts.push(res[i].name);
    }
    inquirer
      .prompt({
        name: "dept",
        type: "list",
        message: "What department would you like to delete?",
        choices: depts
      })
      .then(({ dept }) => {
            var query = "DELETE FROM department WHERE ?";
              connection.query(query,
              { name: dept },
              (err, res) => {
              if (err) throw err;
              console.log(`${dept} department deleted.`);
              runSearch();
            });
          });
      });
  }

//-------------------------------------------------------------------------------------------

  const viewRole = () => {
    const query = "SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.title ASC";
    connection.query(query, (err, res) => {
        console.table(res);
        runSearch();
    });
};

const addRole = () => {

  const query = "SELECT id, name FROM department ORDER BY name ASC";
  connection.query(query, (err, res) => {
    var depts = [
      {
        id: 0,
        name: " "
      }];
    for (var i = 0; i < res.length; i++) {
      depts.push(res[i]);
    }

    const roleQuery = [
      {
        name: "title",
        type: "input",
        message: "Enter Role Title: "
      },
      {
        name: "salary",
        type: "input",
        message: "Enter Salary: "
      },
      {
        name: "dept",
        type: "list",
        message: "What department does this role belong to?",
        choices: depts
      }
    ]

    inquirer
      .prompt(roleQuery)
      .then(({ title, salary, dept }) => {        
        const query = "SELECT id FROM department WHERE ?";
        connection.query(query, { name: dept }, (err, res) => {
          const query = "INSERT INTO role SET ?";
          connection.query(query,
            {
              title: title,
              salary: salary,
              department_id: res[0].id
            },
            (err, res) => {
              if (err) throw err;
              console.log(`Title inserted.`);
              runSearch();
            });
        });
      });
  });
}
// const updateRole = () => {
//   const query = "SELECT name FROM department ORDER BY name ASC";
//   connection.query(query, (err, res) => {
//     const depts = [];
//     for (var i = 0; i < res.length; i++) {
//       depts.push(res[i].name);
//     }
//     inquirer
//       .prompt({
//         name: "dept",
//         type: "list",
//         message: "What department would you like to update?",
//         choices: depts
//       })
//       .then(({ dept }) => {
//         inquirer
//           .prompt({
//             name: "newDept",
//             type: "input",
//             message: `Make your change to ${dept}: `
//           }).then(({ newDept }) => {
//             var query = "UPDATE department SET ? WHERE ?";
//               connection.query(query,
//               [{ name: newDept }, { name: dept }],
//               (err, res) => {
//               if (err) throw err;
//               console.log(`${dept} department updated to ${newDept}.`);
//               runSearch();
//             });
//           });
//       });
//   });
// }
 
// const delRole = () => {
//   const query = "SELECT name FROM department ORDER BY name ASC";
//   connection.query(query, (err, res) => {
//     const depts = [];
//     for (var i = 0; i < res.length; i++) {
//       depts.push(res[i].name);
//     }
//     inquirer
//       .prompt({
//         name: "dept",
//         type: "list",
//         message: "What department would you like to delete?",
//         choices: depts
//       })
//       .then(({ dept }) => {
//             var query = "DELETE FROM department WHERE ?";
//               connection.query(query,
//               { name: dept },
//               (err, res) => {
//               if (err) throw err;
//               console.log(`${dept} department deleted.`);
//               runSearch();
//             });
//           });
//       });
//   }