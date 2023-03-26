const express = require("express");
const app = express()
const path = require("path")
const jwt = require("JsonWebToken")
const session = require("express-session")
const Joi = require("joi");
// Joi is a validator Schema which validates wether the input given by the user fulfills the
// given criteria.
// Joi can be used for front end middleware validator
// For mongoose..it already have in-built validator features in it
// For mongoose sanitization we can use mongoose-sanitizer npm
const authSchema = require("./models/authSchema");
const htmlSanitize = require("sanitize-html");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: 'sessionseckret', resave: false, saveUninitialized: false }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const auth = async(req, res, next) => {
    if (req.session.token) {
        next();
    } else {
        res.send("you have not logged in")
    }
}
app.get("/", (req, res) => {
    res.render("login.ejs");
})

app.post("/", async(req, res) => {
    try {
        // const { username, password } = req.body;
        // console.log(htmlSanitize(username));
        // console.log(password);
        const result = await authSchema.validateAsync(req.body);
        result.username = htmlSanitize(result.username)
        console.log(result.username);
        if (!result.username) {
            res.send("not valid username")
        } else if (result.password == "shivam" && result.username == "adminis") {
            const token = await jwt.sign(result.password, "secretkey");
            req.session.token = token;
            res.send(token);
        }
    } catch (error) {
        res.send(error);
    }
})

app.get("/logout", auth, (req, res) => {
    req.session.destroy();
    res.send("Session destroyed")
})
app.listen(5000, () => console.log("server started at port 5000"))