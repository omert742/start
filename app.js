var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());  // add the app the option to parse data that send to the app on json type
app.use(bodyParser.urlencoded({ extended: false })); // allways false (use only for real big amout of data)
app.use(express.static("./public"));  // make all the file on public static so the app will know them
app.use(cors()); // allow other web and pages to read from my app


var skierTerms = [
    {
        termx: "Rip",
        defined: "To move at a high rate of speed"
    },
    {
        termx: "Huck",
        defined: "To throw your body off of something, usually a natural feature like a cliff"
    },
    {
        termx: "Chowder",
        defined: "Powder after it has been sufficiently skied"
    }
];




app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});



app.get("/dictionary-api", function(req, res) { // router that open 
	res.json(skierTerms); // json the skierTerms
});

app.post("/dictionary-api", function(req, res) { // handle post for that page 
    skierTerms.push(req.body); // add the the array the req.push(data we got);
    res.json(skierTerms);    // reload the data
});

app.delete("/dictionary-api/:termx", function(req, res) { // on delete 
    skierTerms = skierTerms.filter(function(definition) { 
        return definition.termx.toLowerCase() !== req.params.termx.toLowerCase(); // if the request is data term so delete
    });
    res.json(skierTerms); // reload
});

app.listen(3000);

console.log("Express app running on port 3000");

module.exports = app;