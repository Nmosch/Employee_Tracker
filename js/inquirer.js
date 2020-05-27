const inquirer = require("inquirer");
const cTable = require('console.table');
const mysql = require("mysql2/promise");
// let empIdToUpdate = 0;

const initialQuestion = (connection) => {
    return inquirer
        .prompt([{
            type: "list",
            message: "What would like to do?",
            name: "initial",
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add Employee", "Update role","Delete department","Delete role","Delete employee","I'm finished"]
        }]).then((answer) => {
            let choice = answer.initial;
            switch (choice) {
                case "View departments":
                    viewDepartments(connection)
                    break;
                case "View roles":
                    viewRoles2(connection)
                    break;
                case "View employees":
                    viewEmployees2(connection)
                    break;
                case "Add department":
                    addDepartment(connection)
                    break;
                case "Add role":
                    addRole(connection)
                    break;
                case "Add Employee":
                    addEmployee(connection)
                    break;
                case "Update role":
                    updateRole2(connection);
                    break;
                case "Delete department":
                    deleteDepartment(connection);
                    break;
                case "Delete role":
                    deleteRole(connection);
                    break;
                case "Delete employee":
                    deleteEmployee(connection);
                    break;
                case "I'm finished":
                    console.log("Thank you!")
                    connection.end();
                    break;
            }
        })
}

const viewDepartments = async (connection) => {
    const [rows] = await connection.query("SELECT id, dept_name AS Department from department");
    let allDepts = rows;
    return inquirer
    .prompt([{
        type: "list",
        message: "Which department will you view?",
        name: "dept",
        choices: allDepts.map(dept => dept.Department)
    }]).then((deptChoice)=>{
        const deptId = allDepts.find(idToView => idToView.Department === deptChoice.dept).id;
        const deptQuery = `SELECT d.id, d.dept_name AS Department, r.title AS Role, r.salary AS Salary, CONCAT(e.first_name," ",e.last_name) AS Name
        FROM department d
        INNER JOIN role r
        ON d.id = r.department_id
        INNER JOIN employees e
        ON e.role_id = r.id
        WHERE d.id = ${deptId};`;
        connection.query(deptQuery, (err, results)=> {
            if (err) {throw err};
            console.table (`\n`,"Departments",results);
            initialQuestion(connection);
        });
    });
};

const viewRoles2 = async (connection) => {
    const [rows] = await connection.query("SELECT title AS Role, id from role");
    let allRolesView = rows;
    return inquirer
    .prompt([{
        type: "list",
        message: "Which role will you view?",
        name: "roleView",
        choices: allRolesView.map(roles => roles.Role)
    }]).then((roleViewChoice)=>{
            const roleIdToView = allRolesView.find(idToView => idToView.Role === roleViewChoice.roleView).id;
            const roleQuery = `SELECT r.id AS ID, r.title AS Role, CONCAT(e.first_name," ",e.last_name) AS Name, r.salary AS Salary, d.dept_name AS Department
            FROM role r
            INNER JOIN employees e
            ON r.id = e.role_id
            INNER JOIN department d
            ON d.id = r.department_id
            WHERE r.id = ${roleIdToView}`;
            connection.query(roleQuery, (err, results)=>{if (err) {throw err};
            console.table(`\n`,"Roles",results);
            initialQuestion(connection);
            })
        });
};

const viewEmployees2 = async (connection)=> {
    const viewEmployeeQuery = `SELECT e.id, CONCAT(e.first_name," ", e.last_name) AS Name, role.title AS Role, role.salary AS Salary, department.dept_name AS Department
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
    INNER JOIN role
    ON e.role_id = role.id
    INNER JOIN department
    ON department_id = department.id;`;
    connection.query(viewEmployeeQuery, (err, results)=>{ if (err) {throw err};
        console.table(`\n`,"Employees",results);
        initialQuestion(connection);
    })
}

const addDepartment = async (connection) => {
    return inquirer
        .prompt([{
            type: "input",
            message: "What department will you add?",
            name: "newDepartment",
        }]).then((answer) => {
            let newDepartment = answer.newDepartment;
            const params = { dept_name: `${newDepartment}` };
            connection.query("INSERT INTO department SET ?", params, (err, res) => {
                if (err) { throw err };
                console.log("New department added");
            });initialQuestion(connection);
        })
}

const addRole = async (connection) => {
    let [rows] = await connection.query("Select id, dept_name AS Department FROM department");
    return inquirer
        .prompt([{
            type: "input",
            message: "What role will you add?",
            name: "newRole",
        }, {
            type: "input",
            message: "What is the annual salary for this role?",
            name: "roleSalary"
        },{
            type: "list",
            message: "To which department will this role belong?",
            name: "dept",
            choices: rows.map(dept => dept.Department)
        }]).then((answer) => {
            let newRole = answer.newRole;
            let newSalary = answer.roleSalary;
            let newDept = rows.find(dept => dept.Department === answer.dept).id;
            const params = { title: `${newRole}`, salary: `${newSalary}`, department_id: `${newDept}`};
            connection.query("INSERT INTO role SET ?", params, (err, res) => {
                if (err) { throw err };
                console.log("New role added");
            });initialQuestion(connection);
        })
}

const addEmployee = async (connection) => {
    let [rows] = await connection.query("SELECT id, title AS Role FROM role");
    return inquirer
        .prompt([{
            type: "input",
            message: "What is the employees first name?",
            name: "firstName",
        }, {
            type: "input",
            message: "What is the employees last name?",
            name: "lastName"
        }, {
            type: "list",
            message: "Please assign this employee a role",
            name: "roleName",
            choices: rows.map(role => role.Role)
        }]).then((answer) => {
            let firstName = answer.firstName;
            let lastName = answer.lastName;
            let newRole = rows.find(role => role.Role === answer.roleName).id;
            const params = { first_name: `${firstName}`, last_name: `${lastName}`, role_id: `${newRole}` };
            connection.query("INSERT INTO employees SET ?", params, (err, res) => {
                if (err) { throw err };
                console.log("New Employee Added");
            });initialQuestion(connection);
        });
}

const updateRole2 = async(connection)=>{
    const selectEmpQuery = `SELECT id, CONCAT(first_name," ", last_name) AS Name from employees`;
    const selectRoleQuery = `SELECT title AS Role, id from role` ;
    let [rows] = await connection.query(selectEmpQuery);
    let [rows2] = await connection.query(selectRoleQuery);
    let roleToUpdate = rows2;
    let empToUpdate = rows;
    console.log(empToUpdate);
    console.log(roleToUpdate);
    return inquirer
    .prompt([{
        type: "list",
        message: "Which employee's role will you update?",
        name: "empToUpdate",
        choices: empToUpdate.map(emp => emp.Name)
    },{
        type: "list",
        message: "What is the updated role for this employee?",
        name:"updatedRoleForEmp",
        choices: roleToUpdate.map(roles => roles.Role)
    }]).then((updateInfo)=>{
        console.log(updateInfo);
            let roleIdtoUpdate = roleToUpdate.find(role => role.Role === updateInfo.updatedRoleForEmp).id;
            let employeeIdToUpdate = empToUpdate.find(employee => employee.Name === updateInfo.empToUpdate).id;
            console.log(employeeIdToUpdate);
            const updateQuery = `UPDATE employees SET ? WHERE ?`;
            const params = [{role_id: roleIdtoUpdate}, {id:employeeIdToUpdate}];
            connection.query(updateQuery, params, (err, results)=>{
                if (err){throw err};
                console.log("Employee's Role Updated");
            });initialQuestion(connection);
    });
}

const deleteDepartment = async(connection)=>{
    const [rows] = await connection.query("SELECT id, dept_name AS Department from department");
    let allDepts = rows;
    return inquirer
    .prompt([{
        type: "list",
        message: "Which department will you delete?",
        name: "dept",
        choices: allDepts.map(dept => dept.Department)
    }]).then((deptChoice)=>{
        const deptId = allDepts.find(idToDelete => idToDelete.Department === deptChoice.dept).id;
        const delDeptQuery = `DELETE FROM department WHERE id =${deptId}`;
        connection.query(delDeptQuery, (err, results)=>{if (err){throw err};
        });
        console.log("Department deleted");
        initialQuestion(connection);
    })
}

const deleteRole = async(connection)=>{
    const [rows] = await connection.query("SELECT title AS Role, id from role");
    let allRolesView = rows;
    return inquirer
    .prompt([{
        type: "list",
        message: "Which role will you delete?",
        name: "roleView",
        choices: allRolesView.map(roles => roles.Role)
    }]).then((roleDeleteChoice)=>{
        const roleToDelete = allRolesView.find(idToDel=> idToDel.Role === roleDeleteChoice.roleView).id;
        const roleDelQuery = `DELETE FROM role WHERE id = ${roleToDelete}`;
        connection.query(roleDelQuery, (err, reults)=>{if(err){throw err};
        })
        console.log("Role deleted");
        initialQuestion(connection);
    })
}

const deleteEmployee = async(connection)=>{
    const [rows] = await connection.query(`SELECT id, CONCAT(first_name," ",last_name) AS Name FROM employees`);
    let AllEmployees = rows;
    return inquirer
    .prompt([{
        type: "list",
        message: "Which employee will be deleted?",
        name: "delEmployee",
        choices: AllEmployees.map(name => name.Name)
    }]).then((answer)=>{
        let employeeToDelete = rows.find(employee=>
            employee.Name === answer.delEmployee).id;
        const deleteEmployeeQuery = `DELETE FROM employees WHERE id =${employeeToDelete}`;
        connection.query(deleteEmployeeQuery, (err,results)=>{if (err){throw err};
    });
        console.log("Employee deleted");
        initialQuestion(connection);
    })
}

module.exports = initialQuestion;