const inquirer = require("inquirer");

const viewEmp = (connection, runSearch) => {
  const query = `DROP TEMPORARY TABLE IF EXISTS etemp`; 
  connection.query(query, (err, res) => {
    const query = `CREATE TEMPORARY TABLE etemp SELECT IFNULL(CONCAT(m.last_name, ', ', m.first_name),'None') AS 'Manager', e.role_id, e.manager_id, CONCAT(e.last_name, ', ', e.first_name) AS 'Employee' FROM employee e LEFT JOIN employee m ON m.id = e.manager_id`;
    connection.query(query, (err, res) => {
      const query = `SELECT etemp.Employee, role.title as 'Title', etemp.Manager FROM etemp INNER JOIN role ON role.id = etemp.role_id
      ORDER BY Employee ASC`;
      connection.query(query, (err, res) => {
        console.table(res);
        runSearch();
      });
    });
  });
};

const viewEmpByManager = (connection, runSearch) => {
  const query = `SELECT IFNULL(CONCAT(m.last_name, ', ', m.first_name),'None') 
  AS 'Manager', CONCAT(e.last_name, ', ', e.first_name) AS 'Employee' 
  FROM employee e 
  INNER JOIN employee m ON m.id = e.manager_id
  ORDER BY Manager ASC`;
  connection.query(query, (err, res) => {
    console.table(res)
    runSearch();
  });
}

const addEmp = (connection, runSearch) => {

  const query = "SELECT CONCAT(id, ', ', title) AS 'role' FROM role ORDER BY title ASC";
  connection.query(query, (err, res) => {
    var roles = [];
    for (var i = 0; i < res.length; i++) {
      var str = res[i].role ;
      roles.push(str);
    }
    const query = "SELECT CONCAT(id, ', ', last_name, ', ', first_name) AS 'manager' FROM employee ORDER BY last_name ASC";
    connection.query(query, (err, res) => {
      var managers = [];
      for (var i = 0; i < res.length; i++) {
        var str = res[i].manager ;
        managers.push(str);
      }
      managers.push("none");
      const roleQuery = [
        {
          name: "last",
          type: "input",
          message: "Enter the employee's last name: "
        },
        {
          name: "first",
          type: "input",
          message: "Enter the employee's first name: "
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's title? ",
          choices: roles
        },
        {
          name: "manager",
          type: "list",
          message: "Who is the employee's manager? ",
          choices: managers
        }
      ]

      inquirer
        .prompt(roleQuery)
        .then(({ last, first, role, manager }) => {
            if (manager === "none") {
              manager = "";
              var mgr_id ;
            }
            else {
              var n = manager.indexOf(",");
              var mgr_id = manager.slice(0, n);
            }
            var n = role.indexOf(",");
            var rl_id = role.slice(0, n);
          if (!first || !last || !role) {
            console.log("Information is missing. Employee not added.")
            runSearch();
          } else {
            const query = "INSERT INTO employee SET ?";
            connection.query(query,
              {
                first_name: first,
                last_name: last,
                role_id: rl_id,
                manager_id: mgr_id
              },
              (err, res) => {
                if (err) throw err;
                console.log(`Employee ${first}  ${last} inserted.`);
                runSearch();
              });
          }
        });
    });
  });
};

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
  const query = "SELECT CONCAT(id, ', ', last_name, ', ', first_name) AS employee FROM employee ORDER BY last_name ASC";
  connection.query(query, (err, res) => {
    var employees = [];
    for (var i = 0; i < res.length; i++) {
      employees.push(res[i].employee);
    }
    const roleQuery = [
      {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update? ",
        choices: employees
      }
    ]

    inquirer
      .prompt(roleQuery)
      .then(({ employee }) => {
        var n = employee.indexOf(",");
        var empid = employee.slice(0, n);
        console.log("id: "+ empid);
        const query = "SELECT id, first_name, last_name, role_id FROM employee WHERE ?";
        connection.query(query,
          {
            id: empid
          },
          (err, res) => {
            if (err) throw err;
            var empid = res[0].id;
            var first = res[0].first_name;
            var last = res[0].last_name;
            var roleid = res[0].role_id;
            const query = "SELECT CONCAT(id, ', ', title) AS 'title' FROM role ORDER BY title ASC";
            connection.query(query, (err, res) => {
              const roles = [];
              if (err) throw err;
              for (var i = 0; i < res.length; i++) {
                roles.push(res[i].title);
              }
              roles.push("keep same role");
              const query =
                `SELECT CONCAT(id, ', ', last_name, ', ', first_name) AS 'manager' 
              FROM employee 
              WHERE  id <> ${empid}
              ORDER BY last_name ASC`;
              connection.query(query, (err, res) => {
                if (err) throw err;
                const managers = [];
                for (var i = 0; i < res.length; i++) {
                  managers.push(res[i].manager);
                }
                managers.push("none");
                inquirer
                  .prompt([{
                    name: "newLast",
                    type: "input",
                    message: `Update the Last Name for  ${first} ${last}: `
                  },
                  {
                    name: "newFirst",
                    type: "input",
                    message: `Update the First Name for  ${first} ${last}: `
                  },
                  {
                    name: "newRole",
                    type: "list",
                    message: `Update the Title for  ${first} ${last}: `,
                    choices: roles
                  },
                  {
                    name: "newManager",
                    type: "list",
                    message: `Update the Manager for  ${first} ${last}: `,
                    choices: managers
                  }
                  ]).then(({ newLast, newFirst, newRole, newManager }) => {
                    if (newRole === "keep same role") {
                      newRole = roleid;
                      r_id = roleid;
                    } else {
                      var r = newRole.indexOf(",");
                      var r_id =newRole.slice(0, r);
                    }
                    if (!newFirst) {
                      newFirst = first;
                    }
                    if (!newLast) {
                      newLast = last;
                    }
                    if (!newRole) {
                      r_id = roleid;
                    }
                    if (newManager === "none") {
                      newManager = "";
                      var m_id ;
                    } else {
                      var m = newManager.indexOf(",");
                      var m_id = newManager.slice(0, m);
                    }
                    const query = "UPDATE employee SET ? WHERE ?"    
                    connection.query(query,
                      [{
                        first_name: newFirst,
                        last_name: newLast,
                        role_id: r_id,
                        manager_id: m_id
                      },
                      { id : empid }],
                      (err, res) => {
                      if (err) throw err;
                      console.log(`Employee ${first}  ${last} updated.`);
                      runSearch();
                    });
                  });
              });
            });
          });
      });
  });
}



module.exports = {
  viewEmp, addEmp, updateEmp, delEmp, viewEmpByManager
}


