const inquirer = require("inquirer");
const cTable = require('console.table'); 
const mysql = require("mysql2/promise");
const initialQuestion = (connection) => {
    return inquirer
    .prompt([{
        type: "list",
        message :"What would like to do?",
        name: "initial",
        choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add Employee", "I'm finished"]
    }]).then((answer) => {
        let choice = answer.initial;
        switch (choice) {
            case "View departments":
                viewDepartments(connection).then((res)=>{
                //  const table = cTable.getTable(res);
                console.table(res);
                initialQuestion(connection);
                })
                break;
            case "View roles":
                viewRoles(connection).then((res)=>{
                console.table(res);
                initialQuestion(connection);
                })
                break;
            case "View employees":
                viewEmployees(connection).then((res)=>{
                console.table(res);
                initialQuestion(connection);
                })
                break;
            case "Add department":
                addDepartment(connection).then((res)=>{
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
            case "I'm finished":
                connection.end();
                break;
        }
    })
}

const viewDepartments = async (connection) => {
    const [rows, fields] = await connection.query("SELECT dept_name from department");
    console.table(rows);
};

const viewRoles = async (connection) => {
    const [rows, fields] = await connection.query("SELECT title from role");
    console.table(rows);
};

const viewEmployees = async (connection) => {
    const [rows, fields] = await connection.query("SELECT first_name, last_name from employees");
    console.table(rows);
};

const addDepartment = async (connection) => {
    return inquirer
    .prompt([{
        type: "input",
        message: "What department will you add?",
        name:"newDepartment",
    }]).then((answer)=>{
        let newDepartment = answer.newDepartment;
        const params = {dept_name: `${newDepartment}`};
        connection.query("INSERT INTO department SET ?", params, (err, res) => {
            if (err) {throw err};
            console.log(res);
            });
        })
}

const addRole = async (connection) => {
    return inquirer
    .prompt([{
        type: "input",
        message: "What role will you add?",
        name:"newRole",
    },{
        type: "input",
        message: "What is the annual salary for this role?",
        name: "roleSalary"
    }]).then((answer)=>{
        let newRole = answer.newRole;
        let newSalary = answer.roleSalary;
        const params = {title: `${newRole}`, salary: `${newSalary}`};
        connection.query("INSERT INTO role SET ?", params, (err, res) => {
            if (err) {throw err};
            console.log(res);
        });
    })
}

const addEmployee = async (connection) => {
    return inquirer
    .prompt([{
        type: "input",
        message: "What is the employees first name?",
        name:"firstName",
    },{
        type: "input",
        message: "What is the employees last name?",
        name: "lastName"
    },{
        type: "input",
        message: "Please assign this employee a role id",
        name: "roleId"
    }]).then((answer)=>{
        let firstName = answer.firstName;
        let lastName = answer.lastName;
        let roleId = answer.roleId;
        const params = {first_name: `${firstName}`, last_name: `${lastName}`, role_id:`${roleId}`};
        connection.query("INSERT INTO employees SET ?", params, (err, res) => {
            if (err) {throw err};
            console.log(res);
        });
    })
}
// const viewDepartments = () => {
//     return inquirer
//     .prompt([{
//         type: "list",
//         message: "View which department",
//         name: "department",
//         choices: ["Sales", "Legal", "Finance", "Engineering"]
//     }]).then((answer)=>{
//         let choice = answer.department;
//         switch (choice){
//             case "Sales":

//         }
//     })
// }



module.exports = initialQuestion;