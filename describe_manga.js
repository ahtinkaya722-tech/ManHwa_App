import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ahtin09500!",
    database: "manga_app"
});

db.query("DESCRIBE manga", (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
    db.end();
});
