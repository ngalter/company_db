const Employee = require("./Employee");
var inquirer = require('inquirer');

class Engineer extends Employee {

  constructor(name, id, email, github)
  {
    super(name, id, email);
    this.github = github;
    this.role = "Engineer";
  }

  getGithub() {
    return this.github;
  }
  getRole() {   
    return this.role;
  }
  setGithub() {

  }
}

module.exports = Engineer;