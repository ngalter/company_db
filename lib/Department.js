const inquirer = require("inquirer");

const viewDept = (connection, runSearch) => {
  const query = "SELECT department.id AS 'Id', department.name AS 'Department' FROM department ORDER BY name ASC";
  connection.query(query, (err, res) => {
    console.table(res);
    runSearch();
  });
};

const addDept = (connection , runSearch) => {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Enter Department Name: "
    })
    .then(({ name }) => {
      const query = "INSERT INTO department SET ?";
        connection.query(query,
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

const updateDept = (connection, runSearch) => {
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
            message: `Update name of ${dept} department: `
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

const delDept = (connection, runSearch) => {
  const query = `SELECT name FROM department left JOIN role ON role.department_id = department.id
WHERE role.department_id IS NULL`
  connection.query(query, (err, res) => {
    const depts = [];
    for (var i = 0; i < res.length; i++) {
      depts.push(res[i].name);
    }
    if (depts.length > 0) {
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
              console.log(`${dept} deleted.`);
              runSearch();
            });
        });
    } else {
      console.log("No unreferenced departments to delete.")
      runSearch();
    }
  });
}

const deptBudget = (connection, runSearch) => {
  const query = `DROP TEMPORARY TABLE IF EXISTS etemp;`
  connection.query(query, (err, res) => {
      const query = `CREATE TEMPORARY TABLE etemp
      SELECT employee.role_id, role.department_id, role.salary
      FROM employee
      LEFT JOIN role 
      ON employee.role_id = role.id;`
      connection.query(query, (err, res) => {
          const query = `SELECT department.name AS 'Department', sum(etemp.salary) AS 'Total Budget'
          FROM etemp 
          INNER JOIN department
          ON department.id = etemp.department_id
          GROUP BY department.id 
          ORDER BY department.name`;
          connection.query(query, (err, res) => {
              console.table(res);
              runSearch();
          });
      });
  });
}

module.exports = {
  viewDept, addDept, updateDept, delDept, deptBudget
}