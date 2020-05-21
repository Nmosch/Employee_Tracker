const mysql = require("mysql2/promise");
const initialQuestion = require("./js/inquirer");


const main = async () => {
    try {
       let connection = await mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "password",
            database: "employee_db"
        });
        console.log(`Connected to database with id ${connection.threadId}`);
        //run function here
        await initialQuestion(connection)
        
    } catch (err) {
        console.log(err)
    }
};

main();
// connection.end();