const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

const router = require('./router/router');

app.use('/', router);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 