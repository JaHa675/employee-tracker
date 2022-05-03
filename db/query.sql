SELECT roles.id, title, salary, department.name AS department_name
FROM roles 
INNER JOIN department
ON roles.department = department.id;



SELECT * 
FROM department 
WHERE department.name = ;





-- formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to



SELECT department.name 
FROM department


INSERT INTO roles (title, salary, department)
 VALUES ('?', '?', '?');



SELECT e.id, e.first_name, e.last_name,e.manager_id, salary, title, roles.department, name AS department FROM employee e LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN department ON roles.department = department.id


SELECT CONCAT('first_name',' ', 'last_name') AS employee_name FROM employee;