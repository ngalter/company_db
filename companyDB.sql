DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

INSERT INTO department (name)
VALUES ("Accounting"),("Legal"),("Engineering"),("Sales");

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
  ON DELETE CASCADE;
);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 60000,1), ("Lawyer",100000,2),("Engineer",75000,3),("Salesperson",80000,4),("Bookkeeper",45000,1),("Lead Counsel",200000,2),("Lead Engineer",175000,3),("Lead Sales",150000,4);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id)
  ON DELETE CASCADE;
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nancy", "Alter", 1,NULL),("Howard", "Alter", 2,NULL),("Sam", "Alter", 3, 2),("Dina", "Alter", 4, 1),("Ella", "Shelton", 5, 1),("Nick", "Shelton", 6, 2),("Mark", "Gussin", 7, 1),("Helene", "Gussin", 8, 1),("Aliza", "Gussin", 1, 2),("Ezra", "Gussin", 1, 8),("Elie", "Gussin", 4, 8);