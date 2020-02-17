const inquirer = require("inquirer");

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
    deptBudget
  }