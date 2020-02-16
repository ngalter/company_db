const inquirer = require("inquirer");

const viewEmp = (connection, runSearch) => {
  const query = `DROP TEMPORARY TABLE IF EXISTS etemp`; 
  connection.query(query, (err, res) => {
    const query = `CREATE TEMPORARY TABLE etemp SELECT IFNULL(CONCAT(m.last_name, ', ', m.first_name),'None') AS 'Manager', e.role_id, e.manager_id, CONCAT(e.last_name, ', ', e.first_name) AS 'Employee' FROM employee e LEFT JOIN employee m ON m.id = e.manager_id`;
    connection.query(query, (err, res) => {
      const query = `SELECT etemp.Employee, role.title, etemp.Manager FROM etemp INNER JOIN role ON role.id = etemp.role_id`;
      connection.query(query, (err, res) => {
        console.table(res);
        runSearch();
      });
    });
  });
};

const addEmp = (connection, runSearch) => {

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
    });
});
}

const delEmp = (connection, runSearch) => {
const query = "SELECT id, last_name, first_name FROM employee ORDER BY last_name ASC";
connection.query(query, (err, res) => {
  const employees = [];
  for (var i = 0; i < res.length; i++) {
    var str = res[i].id.toString() + ", " + res[i].last_name + ", " + res[i].first_name;
    employees.push(str);
  }
  inquirer
    .prompt({
      name: "employee",
      type: "list",
      message: "Which employee would you like to delete?",
      choices: employees
    })
    .then(({ employee }) => {
      var n = employee.indexOf(",");
      var empid = employee.slice(0, n);
      var query = "DELETE FROM employee WHERE ?";
        connection.query(query,
        { id: empid },
        (err, res) => {
        if (err) throw err;
        console.log(`${employee} deleted.`);
        runSearch();
      });
    });
});
}
const updateEmp = (connection, runSearch) => {
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
  viewEmp, addEmp, updateEmp, delEmp
}


