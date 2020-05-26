USE employee_db;
-- DROP TABLE department;
INSERT INTO department (dept_name)
values ("Sales"), ("Engineering"), ("Legal"), ("Finance");

SELECT * from department;
-- DROP TABLE role;
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 35000.00, 1), ("Sales Lead", 55000.00, 1), ("Sales Manager", 80000.00, 1),
("Software Engineer", 45000.00, 2), ("Lead Engineer", 75000.00, 2), ("Engineering Manager", 95000.00, 2),
("Lawyer", 60000.00, 3), ("Legal Lead", 75000, 3), ("Legal Manager", 95000.00, 3),
("Accountant", 50000.00, 4), ("Accounting Manager", 65000.00, 4);

SELECT * from role;
-- DROP TABLE employees;
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Brett", "Gardner", 1, 3), ("Aaron","Judge", 2, 3), ("Aaron","Boone", 3, null),
("Giancarlo","Stanton", 4, 6), ("Luke","Voit", 5, 6), ("Gleyber","Torres", 6 ,null),
("Gerrit","Cole", 7, 9), ("Aroldis","Chapman", 8, 9), ("James","Paxton", 9, null),
("Masahiro","Tanaka", 10, 11), ("DJ","LeMahieu", 11, null);

SELECT * from employees;

-- DELETE FROM department WHERE id = 4;
-- DELETE FROM role WHERE id = 2;

-- SELECT role.title AS Title, department.dept_name AS Department, role.salary AS Salary
-- FROM role
-- INNER JOIN department on department_id = department.id;

-- SELECT CONCAT(e.first_name," ", e.last_name) AS Name, role.title AS Title, role.salary AS Salary, department.dept_name AS Department
-- FROM employees e
-- LEFT JOIN employees m ON e.manager_id = m.id
-- INNER JOIN role
-- ON e.role_id = role.id
-- INNER JOIN department
-- ON department_id = department.id;

-- SELECT CONCAT(e.first_name, " ", e.last_name) AS Manager FROM employees m 
-- INNER JOIN employees e ON e.role_id = m.manager_id;

-- SELECT d.id, d.dept_name AS Department, r.title AS Role, r.salary AS Salary, CONCAT(e.first_name," ",e.last_name) AS Name
-- FROM department d
-- INNER JOIN role r
-- ON d.id = r.department_id
-- INNER JOIN employees e
-- ON e.role_id = r.id
-- WHERE d.id = 1;

-- SELECT r.id AS ID, r.title AS Role, CONCAT(e.first_name," ",e.last_name) AS Name, r.salary AS Salary, d.dept_name AS Department
-- FROM role r
-- INNER JOIN employees e
-- ON r.id = e.role_id
-- INNER JOIN department d
-- ON d.id = r.department_id
-- WHERE r.id = 1;

-- SELECT id, CONCAT(first_name," ", last_name) AS Name from employees;