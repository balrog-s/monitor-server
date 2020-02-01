var express = require('express');
var bodyParser = require('body-parser');

var userController = require('./controllers/users');

const app = express();
const port = process.env.PORT || 3000;

app.get("/", function(req, res) {
    res.send("Welcome to my Platform API: Version 1.0.0");
});

app.use(bodyParser.json());

app.post("/register", userController.registerUser);

app.listen(port, () => {
    console.log(`LISTENING ON ${port}`);
});