const inquirer = require("inquirer");

const viewRole = (connection, runSearch) => {
  const query = "SELECT role.id, role.title AS 'Title', role.salary AS 'Salary', department.name AS 'Department' FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.title ASC";
  connection.query(query, (err, res) => {
      console.table(res);
      runSearch();
  });
};

const addRole = (connection, runSearch) => {

const query = "SELECT name FROM department ORDER BY name ASC";
connection.query(query, (err, res) => {
  var depts = [];
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
  for (var i = 0; i < res.length; i++) {
    depts.push(res[i]);
  }
  inquirer
    .prompt(roleQuery)
    .then(({ title, salary, dept }) => { 
      if (!title || !salary || !dept) {
        console.log("Missing Information. Role not added.");
        runSearch();
      } else {
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
              console.log(`Role ${title} inserted.`);
              runSearch();
            });
        });
      }
    });
});
}

const delRole = (connection, runSearch) => {
  const query = `SELECT title FROM role
  LEFT JOIN employee ON employee.role_id = role.id
  WHERE employee.role_id IS NULL
  ORDER BY role.title`;
  connection.query(query, (err, res) => {
    if (res.length === 0) {
      console.log("No unreferenced roles available to delete.")
      runSearch();
    } else {
      const titles = [];
      for (var i = 0; i < res.length; i++) {
        titles.push(res[i].title);
      }
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "What role would you like to delete?",
          choices: titles
        })
        .then(({ role }) => {
          var query = "DELETE FROM role WHERE ?";
          connection.query(query,
            { title: role },
            (err, res) => {
              if (err) throw err;
              console.log(`${role} deleted.`);
              runSearch();
            });
        });
      }
    });
}
const updateRole = (connection, runSearch) => {
const query = "SELECT title FROM role ORDER BY title ASC";
connection.query(query, (err, res) => {
  const roles = [];
  for (var i = 0; i < res.length; i++) {
    roles.push(res[i].title);
  }
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "What role would you like to update?",
      choices: roles
    })
    .then(({ role }) => {
      inquirer
        .prompt([{
          name: "newSalary",
          type: "input",
          message: `Update the salary for ${role}: `
        },
        {
          name: "newRole",
          type: "input",
          message: `Update the title for ${role}: `
        }]).then(({ newSalary, newRole }) => {
          const query = "SELECT title, salary FROM role WHERE ?";
          connection.query(query, { title: role }, (err, res) => {
            if (!newSalary) {
              newSalary = res[0].salary;
            }
            if (!newRole) {
              newRole = res[0].title;
            }
            var query = "UPDATE role SET ? WHERE ?";
            connection.query(query,
              [{ title: newRole, salary: newSalary }, { title: role }],
              (err, res) => {
                if (err) throw err;
                console.log(`${role} title updated to ${newRole}.`);
                console.log(`${role} salary updated to ${newSalary}.`);
                runSearch();
              });
          });
        });
    });
});
}

module.exports = {
  viewRole, addRole, updateRole, delRole
}