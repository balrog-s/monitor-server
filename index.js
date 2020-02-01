var express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get("/", function(req, res) {
    res.send("Welcome to my Platform API: Version 1.0.0");
});

app.listen(port, () => {
    console.log(`LISTENING ON ${port}`);
});