
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
 
]; // my activitys
var flagChecker = [2] ; // check if user exists




app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
    response.render('public/index');
});

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

app.post("/dictionary-api", function(req, res) { // router that open 
    append_new_Object(req.body);
});

app.get("/dictionary-api", function(req, res) { // router that open 
        console.log("On Get API");

            fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            skierTerms = [];
            obj = JSON.parse(data);
            obj = obj.users[0].MyActivitys;
            obj.forEach(function(everyObject) { 
                skierTerms.push({nameActivity: everyObject.nameActivity, Activity: everyObject.Activity}); 
            });
                    res.json(skierTerms); 

        });
    


});





app.delete("/dictionary-api/:nameActivity", function(req, res) { // on delete 
    var valueToDel = req.params.nameActivity;
    var posion = 0 ;
    var flag = -1 ;

    skierTerms = skierTerms.filter(function(definition) {
        return definition.nameActivity.toLowerCase() !== req.params.nameActivity.toLowerCase(); // if the request is data term so delete
    });
    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        var obj2 = obj.users[0].MyActivitys;
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
    fs.writeFileSync('public/activity-data.json', configJSON);
    
    });
    res.json(skierTerms); // reload
});









app.get("/login", function(req, res) { // router that open 
    
        
        console.log("On Login Get");
    
    res.json(flagChecker);
});




app.post("/login", function(req, res) { // handle post for that page 

        console.log("On Login Post");
        var Get_username = req.body.username.toLowerCase();
            var Get_password = req.body.password.toLowerCase();
    
        fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            obj = JSON.parse(data);
           obj = obj.users;
            var flag = 0 ; //check if user exists
          
            
                obj.forEach(function(everyObject) {  // every object
                    if(Get_username.trim() === everyObject.username.trim() && Get_password === everyObject.password.trim() )
                        {
                                           console.log("Login");  
                            flag = 1;
                            flagChecker[0] = flag ;
                        }
        
                });
            
            if(flag == 0)
                {
                    flagChecker[0] = flag ;
                 //   alert("user is not exsists")
                }

        });


});

//TO DO registerr XXXXXXOOOOOXXXXOOOOOXXXXXOOOOXXXXXOOOOXXXXOOOOO
app.post("/register", function(req, res) { // handle post for that page 

    console.log("on post");
        console.log("username : "+req.body.username );
            console.log("password : "+req.body.password );

});









function delete_object(num){
    
   fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        obj = obj.users[0].MyActivitys;
   });
    
  obj.MyActivitys.delete[num];
  obj.MyActivitys.delete(num);
  var configJSON = JSON.stringify(obj);
   fs.writeFile('public/activity-data.json', configJSON, (err) => {
          if (err){
               throw err;
          }
        });
        
    
    
}

function append_new_Object(new_obj){
    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        var obj2 = obj.users[0].MyActivitys;
        obj2.push(new_obj);
        var configJSON2 = JSON.stringify(obj);
        
        
        
     fs.writeFile('public/activity-data.json', configJSON2, (err) => {
          if (err){
               throw err;
          }
        });
        
        });


}


