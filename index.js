
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

app.post('/signup', (req, res) => {
    const checkEmail = "SELECT * FROM login WHERE `email` = ?";
    db.query(checkEmail, [req.body.email], (err, existingUser) => {
        if (err) {
            return res.json("error");
        }
        if (existingUser.length > 0) {
            return res.json({ status: "emailAlreadyUsed" });
        }

        const createUser = "INSERT INTO login (`name`, `email`, `password`) VALUES(?)";
        const values = [
            req.body.username,
            req.body.email,
            req.body.password
        ];

        db.query(createUser, [values], (err, result) => {
            if (err) {
                return res.json("error");
            }

            const insertedUser = {
                id: result.insertId,
                name: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            return res.json({ status: "success", user: insertedUser });
        });
    });
});


app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const sql = "SELECT * FROM login WHERE `email` = ? OR `name` = ?";
    db.query(sql, [identifier, identifier], (err, data) => {
        if (err) {
            return res.json("error");
        }
        if (data.length > 0) {
            const user = data[0];
            if (user.password === password) {
                return res.json("success");
            } else {
                return res.json("incorrectPassword");
            }
        } else {
            return res.json("incorrectIdentifier");
        }
    });
});


app.listen(8081, () => {
    console.log("listening");;
})