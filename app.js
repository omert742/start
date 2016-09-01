
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require('fs');

app.use(bodyParser.json());  // add the app the option to parse data that send to the app on json type
app.use(bodyParser.urlencoded({ extended: false })); // allways false (use only for real big amout of data)
app.use(express.static("./public"));  // make all the file on public static so the app will know them
app.use(cors()); // allow other web and pages to read from my app

var skierTerms = [

];



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response) {

  response.render('public/index');
    
});

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

app.get("/dictionary-api", function(req, res) { // router that open 
    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
//         var jsonContent = JSON.parse(data3);
        obj = JSON.parse(data);
        obj = obj.MyActivitys;
        obj.forEach(function(everyObject) { 
        skierTerms.push({nameActivity: everyObject.nameActivity, Activity: everyObject.Activity}); 

        });
        	res.json(skierTerms); 
        });

});



app.post("/dictionary-api", function(req, res) { // handle post for that page 
    skierTerms.push(req.body); // add the the array the req.push(data we got);

    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
//         var jsonContent = JSON.parse(data3);
                obj = JSON.parse(data);
        console.log("data "+obj)
        append_new_Object(req.body);
        });
        
        //obj.push(req.body);
        
        
        
    

    res.json(skierTerms);    // reload the data
});

app.delete("/dictionary-api/:nameActivity", function(req, res) { // on delete 
    var valueToDel = req.params.nameActivity;
    var posion = 0 ;
    var flag = -1 ;

    skierTerms = skierTerms.filter(function(definition) {
        return definition.nameActivity.toLowerCase() !== req.params.nameActivity.toLowerCase(); // if the request is data term so delete
    });
    
    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        obj = JSON.parse(data); // data 
        obj2 = obj.MyActivitys; // acitivitys
            obj2.forEach(function(everyObject) {  // every object
                flag++;
                if(req.params.nameActivity.toLowerCase() == everyObject.nameActivity.toLowerCase())
                  {
                   posion = flag ;
                   }
    });
        
       
    delete obj2[posion]
obj2.splice(posion,1);




    
  var configJSON = JSON.stringify(obj);
        
                console.log(configJSON)

  fs.writeFileSync('public/activity-data.json', configJSON);
    
    });
   
    

    res.json(skierTerms); // reload
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



function delete_object(num){
    
   fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        obj = JSON.parse(data); // data 
        obj = obj.MyActivitys; // acitivitys
   });
    
    
    obj.MyActivitys.delete[num];
  obj.MyActivitys.delete(num);
  var configJSON = JSON.stringify(obj);
  fs.writeFileSync('public/activity-data.json', configJSON);
    
    
    
}

function append_new_Object(obj){
  var configFile = fs.readFileSync('public/activity-data.json');
  var config = JSON.parse(configFile);
  config.MyActivitys.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('public/activity-data.json', configJSON);
}