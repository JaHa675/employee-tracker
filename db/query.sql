SELECT roles.id, title, salary, department.name AS department_name
FROM roles 
INNER JOIN department
ON roles.department = department.id;
-- formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to



SELECT department.name 
FROM department


INSERT INTO roles (title, salary, department)
 VALUES ('?', '?', '?');









SELECT A.employee.id, CONCAT(A.first_name,' ', A.last_name) AS employee_name, roles.name, roles.salary, department.name, CONCAT(B.first_name,' ', B.last_name) AS manager_name
FROM employee A, employee B
WHERE A.manager_id = B.employee.id
INNER JOIN roles
ON A.employee.role_id = roles.id
INNER JOIN department
ON A.employee.role_id

