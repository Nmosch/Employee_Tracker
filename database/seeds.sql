USE employee_db;
-- DROP TABLE department;
INSERT INTO department (id, dept_name)
values (1, "Sales"), (2, "Engineering"), (3, "Legal"), (4, "Finance");

SELECT * from department;
-- DROP TABLE role;
INSERT INTO role (id, title, salary, department_id)
VALUES (11, "Sales Person", 35000.00, 1), (12, "Sales Lead", 55000.00, 1), (13, "Sales Manager", 80000.00, 1),
(21, "Software Engineer", 45000.00, 2), (22, "Lead Engineer", 75000.00, 2), (23, "Engineering Manager", 95000.00, 2),
(31, "Lawyer", 60000.00, 3), (32, "Legal Lead", 75000, 3), (33, "Legal Manager", 95000.00, 3),
(41, "Accountant", 50000.00, 4), (42, "Accounting Manager", 65000.00, 4);

SELECT * from role;
-- DROP TABLE employees;
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Brett", "Gardner", 11, 3), ("Aaron","Judge", 12, 3), ("Aaron","Boone", 13, null),
("Giancarlo","Stanton", 21, 6), ("Luke","Voit", 22, 6), ("Gleyber","Torres", 23 ,null),
("Gerrit","Cole", 31, 9), ("Aroldis","Chapman", 31, 9), ("James","Paxton", 33, null),
("Masahiro","Tanaka", 41, 11), ("DJ","LeMahieu", 42, null);

SELECT * from employees
WHERE role_id IN (11, 12, 13);

SELECT role.id
from role
inner join department on department_id = department.id;

SELECT dept_name from department;