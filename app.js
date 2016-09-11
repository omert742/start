
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require('fs');
var engines = require('consolidate');

app.use(bodyParser.json());  // add the app the option to parse data that send to the app on json type
app.use(bodyParser.urlencoded({ extended: false })); // allways false (use only for real big amout of data)
app.use(express.static("./public"));  // make all the file on public static so the app will know them
app.set('views', __dirname + '/public');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(cors()); // allow other web and pages to read from my app

var userIndex = 0;
var skierTerms = [
 
]; // my activitys
var flagChecker = [2,2] ; // check if user exists // check registerison [0 = exists]





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
    response.render('public/login.html');
});

app.get('/public/add.html', function(request, response) {
    response.render('public/add.html');
});

app.get('/public/login.html', function(request, response) {
    response.render('public/login.html');
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
            obj = obj.users[userIndex].MyActivitys;
            obj.forEach(function(everyObject) { 
                skierTerms.push({nameActivity: everyObject.nameActivity, Activity: everyObject.Activity}); 
            });
                        console.log("On get sk")+skierTerms;

                    res.json(skierTerms); 

        });
    


});

app.delete("/dictionary-api/:nameActivity", function(req, res) { // on delete 
    var valueToDel = req.params.nameActivity;
    var posion = 0 ;

    skierTerms = skierTerms.filter(function(definition) {
        return definition.nameActivity.toLowerCase() !== req.params.nameActivity.toLowerCase(); // if the request is data term so delete
    });
    
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        var obj2 = obj.users[userIndex].MyActivitys;
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
    
        
    
    res.json(flagChecker);

});

app.post("/login", function(req, res) { // handle post for that page 
    
    LoginFunc(req.body);
    
    



});

app.post("/register", function(req, res) { // handle post for that page 
            
            newMember(req.body);
});


app.get("/register", function(req, res) { // router that open 
    
        
    
    res.json(flagChecker);

});





function LoginFunc(Get_req_body){
            flagChecker[0] = 2 ;
        console.log("On Login Post : "+ flagChecker[0] );
        var Get_username = Get_req_body.username.toLowerCase();
            var Get_password = Get_req_body.password.toLowerCase();
    
        fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            obj = JSON.parse(data);
           obj = obj.users;
      
            var run = 1 ;
            for(var i = 0 ; i<obj.length && run == 1; i++)
                {
                       if(Get_username.trim() === obj[i].username.trim() && Get_password === obj[i].password.trim() )
                        {
                            console.log("i am In");
                            flagChecker[0] = 1 ; // the object are exists
                           run = 0 ;

                        }    
                };
            
            
           

        });
}
function delete_object(num){
    
   fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        obj = obj.users[userIndex].MyActivitys;
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
        var obj2 = obj.users[userIndex].MyActivitys;
        obj2.push(new_obj);
        var configJSON2 = JSON.stringify(obj);
        
        
        
     fs.writeFile('public/activity-data.json', configJSON2, (err) => {
          if (err){
               throw err;
          }
        });
        
        });


}
function updateData(new_obj){
          fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            var obj = JSON.parse(data); // data 
                          console.log("\n\n\n Console : "+obj+"\n\n\n")

            obj.users.forEach(function(everyObject,callback) { 
                
                
                if(new_obj.username != undefined){
                    var checkvalue = new_obj.username;
                    if(everyObject.username == checkvalue){
                                        flagChecker[1] = 1 // work
                                        return true;
                        }
                }
            });
        });
}
function newMember(new_obj){
            flagChecker[1] = 2 ;

        fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            var obj = JSON.parse(data); // data 
            
       
                
             var run = 1 ;
            for(var i = 0 ; i<obj.users.length && run == 1; i++)
                {   
                        console.log("\n\n\n");
                        console.log("new_obj.username : "+new_obj.username);
                        console.log("obj.users[i].username"+obj.users[i].username);
                        console.log("\n\n\n");
                        
                       if(new_obj.username.trim() === obj.users[i].username.trim() && new_obj.password === obj.users[i].password.trim() )
                        {
                            console.log("i am In");
                            flagChecker[1] = 1 ; // the object are exists
                           run = 0 ;

                        }    
                };
            
            
            if(flagChecker[1] == 2 )
                {
                     var exmapleObj = obj.users[userIndex];
                    var configJSONExample = JSON.stringify(exmapleObj);
                    var newObject = configJSONExample;
                   var obj3 = JSON.parse(configJSONExample); // data 
                    obj3.username = new_obj.username.toLowerCase();
                    obj3.password = new_obj.password.toLowerCase();
                    obj3.MyActivitys = [];
                    obj.users.push(obj3);
                    var configJSON = JSON.stringify(obj);




                     fs.writeFile('public/activity-data.json', configJSON, (err) => {
                          if (err){
                               throw err;
                          }
             
                });
                }
//            if(flagChecker[1] == 1){
//                    var exmapleObj = obj.users[userIndex];
//                    if(flagChecker[1]==1){//if user is allready exists
//
//                }
//            }
//            else{
//              flagChecker[1] = 0;  
//            }
     });

        }




