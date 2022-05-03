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
  const sql =
    "SELECT e.id, e.first_name, e.last_name,e.manager_id, salary, title, roles.department, name AS department FROM employee e LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN department ON roles.department = department.id";
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
  const sql = "SELECT department.name FROM department";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const departments = res;
    inquirer
      .prompt([
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
          type: "list",
          name: "roleDept",
          choices: [...departments],
        },
      ])
      .then((answer) => {
        let departmentId;
        db.query(`SELECT * FROM department`, (err, res) => {
          if (err) {
            throw err;
          }
          const departmentIdArray = res.filter(
            (word) => word.name === answer.roleDept
          );
          departmentId = departmentIdArray[0].id;
        });
        const insertRoleSql = `INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)`;
        const params = [answer.roleTitle, answer.roleSalary, departmentId];
        db.query(insertRoleSql, params, (err, res) => {
          if (err) {
            throw err;
          }
          console.log(`${answer}added to role list`);
          ask();
        });
      });
  });
}

function addEmployee() {
  const sql = "SELECT roles.title FROM roles";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const roles = res.map((role) => role.title);

    const managersql =
      "SELECT CONCAT(first_name,' ', last_name) AS name FROM employee";
    db.query(managersql, (err, res) => {
      if (err) {
        throw err;
      }
      const employees = res.map((name) => name.name);
      console.log(employees);
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "First Name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "Last name?",
          },
          {
            type: "list",
            name: "newRole",
            message: "What role?",
            choices: [...roles],
          },
          {
            type: "list",
            name: "managerName",
            message: "Managers name?",
            choices: [...employees],
          },
        ])
        .then((answer) => {
          db.query(
            `SELECT CONCAT(first_name,' ', last_name) AS name, id FROM employee`,
            (err, res) => {
              if (err) {
                throw err;
              }
              const selectManagerArray = res.filter(
                (word) => word.name === answer.managerName
              );
              const managerId = selectManagerArray[0].id;
              db.query(`SELECT * FROM roles`, (err, res) => {
                if (err) {
                  throw err;
                }
                const selectRoleArray = res.filter(
                  (word) => word.title === answer.newRole
                );
                console.log(selectRoleArray)
                const selectRoleId = selectRoleArray[0].id;
                const insertEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                const params = [
                  answer.firstName,
                  answer.lastName,
                  selectRoleId,
                  managerId,
                ];
                db.query(insertEmployeeSql, params, (err, res) => {
                  if (err) {
                    throw err;
                  }
                  ask();
                });
              });
            }
          );
        });
    });
  });
}

function updateEmployee() {
  const sql =
    "SELECT title, roles.id FROM roles INNER JOIN department ON roles.department = department.id";
  db.query(sql, (err, res) => {
    if (err) {
      throw err;
    }
    const rolesList = res.map((role) => role.title);
    db.query(
      `SELECT CONCAT(first_name,' ', last_name) AS employee_name FROM employee;`,
      (err, res) => {
        if (err) {
          throw err;
        }
        const namesList = res.map((empName) => empName.employee_name);
        console.log(namesList);
        inquirer
          .prompt([
            {
              type: "list",
              name: "chosenEmployee",
              message: "Which employee would you like to update?",
              choices: namesList,
            },
            {
              type: "list",
              name: "chosenRole",
              message: "What role do they have now?",
              choices: rolesList,
            },
          ])
          .then((answer) => {
            console.log(answer);
            let roleId;
            let employeeId;
            db.query(
              "SELECT CONCAT(first_name,' ', last_name) AS employee_name, employee.id FROM employee",
              (err, res) => {
                if (err) {
                  throw err;
                }
                const employeeIdArray = res.filter(
                  (word) => word.employee_name === answer.chosenEmployee
                );
                employeeId = employeeIdArray[0].id;

                db.query("SELECT * FROM roles", (err, res) => {
                  if (err) {
                    throw err;
                  }
                  const roleIdArray = res.filter(
                    (word) => word.name === answer.chosenrole
                  );
                  roleId = roleIdArray[0].id;
                  db.query(
                    `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`,
                    (err, res) => {
                      if (err) {
                        throw err;
                      }
                      console.log("update successful");
                      ask();
                    }
                  );
                });
              }
            );
          });
      }
    );
  });
}

ask();
