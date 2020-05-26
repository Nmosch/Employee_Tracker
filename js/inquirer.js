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
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add Employee", "Update role", "I'm finished"]
        }]).then((answer) => {
            let choice = answer.initial;
            switch (choice) {
                case "View departments":
                    viewDepartments(connection)
                    // .then((res) => {
                    //     console.table(res);
                    //     initialQuestion(connection);
                    // })
                    break;
                case "View roles":
                    viewRoles2(connection)
                    // .then((res) => {
                    //     console.table(res);
                    //     initialQuestion(connection);
                    // })
                    break;
                case "View employees":
                    viewEmployees2(connection)
                    // .then((res) => {
                    //     console.table(res);
                    //     initialQuestion(connection);
                    // })
                    break;
                case "Add department":
                    addDepartment(connection).then((res) => {
                        console.log(res);
                        console.log("New department added");
                        initialQuestion(connection);
                    })
                    break;
                case "Add role":
                    addRole(connection).then((res) => {
                        console.log(res);
                        console.log("New role added");
                        initialQuestion(connection);
                    })
                    break;
                case "Add Employee":
                    addEmployee(connection).then((res) => {
                        console.log(res);
                        console.log("New Employee added");
                        initialQuestion(connection);
                    })
                    break;
                case "Update role":
                    updateRole2(connection);
                    break;
                case "I'm finished":
                    connection.end();
                    break;
            }
        })
}

const viewDepartments = async (connection) => {
    const [rows] = await connection.query("SELECT id, dept_name AS Department from department");
    let allDepts = rows;
    // console.log(allDepts);
    // console.table(allDepts);
    return inquirer
    .prompt([{
        type: "list",
        message: "Which department will you view?",
        name: "dept",
        choices: allDepts.map(dept => dept.Department)
    }]).then((deptChoice)=>{
        // let deptChoice = deptChoice.allDepts;
        // console.log(deptChoice);
        const deptId = allDepts.find(idToView => idToView.Department === deptChoice.dept).id;
        // console.log(deptId);
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
    // console.log(allRolesView);
    return inquirer
    .prompt([{
        type: "list",
        message: "Which roles will you view?",
        name: "roleView",
        choices: allRolesView.map(roles => roles.Role)
    }]).then((roleViewChoice)=>{
            // console.log(roleViewChoice);
            const roleIdToView = allRolesView.find(idToView => idToView.Role === roleViewChoice.roleView).id;
            // console.log(roleIdToView);
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

const viewRoles = async (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT title AS Role, id from role", function (err, allRoles){
            console.table(allRoles);
            allRoles = allRoles.map(role => {
                // let roleInfo = `${}${}`
                return {title: role.Role, id:role.id};
            });
            console.log(allRoles);
            resolve (allRoles);
        });       
    })
};

const viewEmployees = (connection) => {
    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT e.id, CONCAT(e.first_name," ", e.last_name) AS Name, role.title AS Role, role.salary AS Salary, department.dept_name AS Department
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        INNER JOIN role
        ON e.role_id = role.id
        INNER JOIN department
        ON department_id = department.id;`;
        connection.query(sqlQuery, function (err, results) {
            // console.table(results);
            results = results.map(employee => {
                let employeeInfo = `${employee.id} ${employee.Name}`;
                return employeeInfo;
            });
            // console.log(results);

            resolve(results);
        });
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
                console.log(res);
            });
        })
}

const addRole = async (connection) => {
    return inquirer
        .prompt([{
            type: "input",
            message: "What role will you add?",
            name: "newRole",
        }, {
            type: "input",
            message: "What is the annual salary for this role?",
            name: "roleSalary"
        }]).then((answer) => {
            let newRole = answer.newRole;
            let newSalary = answer.roleSalary;
            const params = { title: `${newRole}`, salary: `${newSalary}` };
            connection.query("INSERT INTO role SET ?", params, (err, res) => {
                if (err) { throw err };
                console.log(res);
            });
        })
}

const addEmployee = async (connection) => {
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
            type: "input",
            message: "Please assign this employee a role id",
            name: "roleId"
        }]).then((answer) => {
            let firstName = answer.firstName;
            let lastName = answer.lastName;
            let roleId = answer.roleId;
            const params = { first_name: `${firstName}`, last_name: `${lastName}`, role_id: `${roleId}` };
            connection.query("INSERT INTO employees SET ?", params, (err, res) => {
                if (err) { throw err };
                console.log(res);
            });
        })
}

// const updateRole = (connection) => {
//     viewEmployees(connection).then((employeeInfo) => {
//             // console.log(employeeInfo)
//             inquirer.prompt([{
//             type: "list",
//             message: "Who's role would you like to update?",
//             name: "updateEmployee",
//             choices: employeeInfo
//         }]).then((results) => {
//             // console.log(results);
//             let employeeToUpdate = results.updateEmployee.split(" ");
//             // console.log(employeeToUpdate);
//             let employeeIdToUpdate = parseInt(employeeToUpdate[0]);
//             // console.log(employeeIdToUpdate);
//             viewRoles(connection).then((allRoles) => {
//                 inquirer.prompt([{
//                 type: "list",
//                 message: "What is the updated role?",
//                 name: "updatedEmployeeRole",
//                 choices: allRoles.map(newRole => newRole.title)
//                 }]).then((role)=>{
//                     // console.log(role);
//                     const roleId = allRoles.find(proposedRole => proposedRole.title === role.updatedEmployeeRole).id;
//                     // console.log(employeeIdToUpdate);
//                     // console.log(roleId);
//                     const updateQuery = `UPDATE employees SET ? WHERE ?`;
//                     const params = [{role_id: roleId}, {id:employeeIdToUpdate}];
//                     connection.query(updateQuery, params, (err, results) => {
//                         if (err) throw err;
//                         // console.log("Role updated");
//                     });
//                 });               
//             });
//             initialQuestion(connection);
//             // connection.end();
//         });
//     });

// }

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
            // console.log(roleToUpdate);
            let roleIdtoUpdate = roleToUpdate.find(role => role.Role === updateInfo.updatedRoleForEmp).id;
            // console.log(roleIdtoUpdate);
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
            
//             const selectRoleQuery = `SELECT title AS Role, id from role` ;
//             connection.query(selectRoleQuery, (err, roleToUpdate)=>{
//                 if(err){throw err};
//                 // return roleToUpdate;
//                 console.log(roleToUpdate);
//             })
        
//     })
// }
// .then((roleToUpdate)=>{
//                 return inquirer
//                 .prompt([{
//                         type: "list",
//                         message: "What is the updated role for this employee?",
//                         name:"updatedRoleForEmp",
//                         choices: roleToUpdate.map(roles => roles.Role)
//                 }]).then((selectedRoleToUpdate)=>{
//                     console.log(selectedRoleToUpdate);
//                 })
//             })
module.exports = initialQuestion;