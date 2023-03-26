// Read documentation of security related extentions used in this website:
// - express-mongo-sanitizer
// - sanitize-html


const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const Contact = require('./models/contacts')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mongoSanitize = require('express-mongo-sanitize');
const session = require("express-session")
const sanitizeHtml = require("sanitize-html");
const authSchema = require("./models/authSchema")

mongoose.connect('mongodb://0.0.0.0:27017/address-book')
    .then(() => console.log("Database connected"))
    .catch(error => console.log(error));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(mongoSanitize());
app.use(session({ secret: 'sessionseckret', resave: false, saveUninitialized: false }))

const auth = async(req, res, next) => {
    try {
        const { token } = req.body;
        const verify = jwt.verify(token, "th15154r4nd0msecretkey");
        if (verify) {
            next();
        } else {
            res.send({ "error": "invalid detials" })
        }
    } catch (error) {
        res.status(401).send(error);
    }
}

const sessVerify = (req, res, next) => {
    if (req.session.token) {
        next();
    } else {
        res.redirect("/")
    }
}

app.post("/", async(req, res) => {

    // Pagination - Starts
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const startIndex = page - 1;
    const endIndex = page * limit;
    const schemaSize = await Contact.countDocuments().exec();
    const result = {};
    const contacts = await Contact.find().skip(startIndex * limit).limit(limit).exec();

    if (startIndex >= 0) {
        if (startIndex == 0)
            result.previousPage = "Already on first page"
        else
            result.previousPage = page - 1;
    }

    if (endIndex >= schemaSize) {
        result.nextPage = "Already on last page"
    } else if (endIndex < schemaSize) {
        result.nextPage = page + 1;
    }
    result.details = contacts;
    // Pagination  - Ends

    res.status(200).json(result)
})


app.post("/login", async(req, res) => {
    try {
        const password = sanitizeHtml(req.body.password);
        const verified = await bcrypt.compare(password, "$2b$12$TEi0sTWuqtGAxXevcU.LIuN1/lJtW6WW3vMky4ZQRE06Oz64vNPpC");
        if (verified) {
            const token = await jwt.sign(password, "th15154r4nd0msecretkey");
            // res.cookie('jwt', token, { httpOnly: true });
            req.session.token = token;
            res.send({
                "token": token
            })
        } else {
            res.status(401).send({
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        res.send(error)
    }
})

app.post("/add-contact", auth, async(req, res) => {
    try {
        const { name, mobile, address } = req.body;
        const user = new Contact({
            name: name,
            mobile: mobile,
            address: address
        })
        await user.save();
        console.log("contact saved");
    } catch (error) {
        res.status(401).send(error);
    }
})

app.post("/add-bulk-contacts", auth, (req, res) => {
    try {
        const { name, mobile, address } = req.body;
        for (let i = 0; i < name.length; i++) {
            Contact.insertMany({
                name: name[i],
                mobile: mobile[i],
                address: address[i]
            })
        }
    } catch (error) {
        res.send(error)
    }
})

app.get("/find-contact", sessVerify, auth, async(req, res) => {
    try {
        const { mobile } = req.body;
        const user = await Contact.findOne({ mobile: mobile })
        if (user) {
            res.send(user)
        } else {
            res.send({
                message: "data not found in the address-book"
            })
        }
    } catch (error) {
        res.send(error)
    }
})

app.post("/update-contact", auth, async(req, res) => {
    const { mobileToUpdate, mobileUpdated, nameToUpdate, nameUpdated, addressToUpdate, addressUpdated } = req.body;
    const user = await Contact.findOne({ mobile: mobileToUpdate });
    if (user) {
        user.update({
            mobile: mobileUpdated,
            name: nameUpdated,
            address: addressUpdated
        });
        res.send("updated")
    } else {
        res.send({
            message: "contact not found in the address-book"
        })
    }
})

app.delete("/delete-contact", auth, async(req, res) => {
    const { mobile } = req.body;
    // const user = Contact.findOne({ mobile: mobile });
    await Contact.deleteOne({ mobile: mobile });
    res.send("contact deleted")
})

app.post("/search", (req, res) => {
    const part = req.body.name;
    Contact.find({ name: { $regex: `${part}`, $options: "i" } }).then(names => res.send(names));
    //this is regex which is used to find all those words which contains that specific string in it
})

app.post("/logout", sessVerify, async(req, res) => {
    const { token } = req.body;
    const userVer = await jwt.verify(token, "th15154r4nd0msecretkey");
    if (userVer) {
        // console.log(userVer);
        // res.send(`password : ${userVer}`)
        res.json({ message: "logged out" })
    } else {
        res.status(400).send({ message: "Invalid Signature" })
    }
})

app.listen(5000, () => console.log("server started at 5000"));
// "token": "eyJhbGciOiJIUzI1NiJ9.YWRtaW4.a96cXZhjqz6Fhwg9bDMdbh3zkf3j6EvtPUWEvtI0BAE",
// password - admin