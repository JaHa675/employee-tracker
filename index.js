const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const PORT = process.env.PORT || 6900;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "workplace_db",
});

function ask() {
  inquirer
    .prompt([
      {
        name: "question",
        type: "list",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.question) {
        case "view all departments":
          viewDepartments();
          break;

        case "view all roles":
          viewRoles();
          break;

        case "view all employees":
          viewEmployees();
          break;

        case "add a department":
          addDepartment();
          break;

        case "add a role":
          addRole();
          break;

        case "add an employee":
          addEmployee();
          break;

        case "update an employee role":
          updateEmployee();
          break;

        default:
          console.log("exiting");
          break;
      }
    });
}

function viewDepartments() {
  const sql = "SELECT * FROM department";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(res);
    console.log(`\n${table}`);
  });
  ask();
}

function viewRoles() {
  const sql =
    "SELECT roles.id, title, salary, department.name AS department_name FROM roles INNER JOIN department ON roles.department = department.id";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(res);
    console.log(`\n${table}`);
  });
  ask();
}

function viewEmployees() {
  const sql = "";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(res);
    console.log(`\n${table}`);
  });
  ask();
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "Name of department?",
    })
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES ('${answer.deptName}');`;
      db.query(sql, (err, res) => {
        if (err) {
          throw err;
        }
        console.log(`${answer.deptName} added to department list`);
        ask();
      });
    });
}

function addRole() {
  const sql = "";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const departments = res;
    inquirer
      .prompt(
        {
          type: "input",
          name: "roleTitle",
          message: "Title of role?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Salary of role?",
        },
        {
          type: "choice",
          name: "roleDept",
          message: [departments],
        }
      )
      .then((answer) => {
        const sql = ``;
        const params = [answer.roleTitle, answer.roleSalary, ]
        db.query(sql, (err, res) => {
          if (err) {
            throw err;
          }
          console.log(`${answer.deptName} added to department list`);
          ask();
        });
      });
  });
}

function addEmployee() {}

function updateEmployee() {}

ask();
