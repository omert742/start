var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require('fs');
var engines = require('consolidate');
var nodemailer = require('nodemailer');
var formidable = require('formidable');
var path = require('path');
var app = express();


app.use(bodyParser.json());  // add the app the option to parse data that send to the app on json type
app.use(bodyParser.urlencoded({ extended: false })); // allways false (use only for real big amout of data)
app.use(express.static("./public"));  // make all the file on public static so the app will know them
app.set('views', __dirname + '/public');
app.engine('html', engines.mustache);
const S3_BUCKET = process.env.S3_BUCKET;

app.set('view engine', 'html');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(cors()); // allow other web and pages to read from my app



var userIndex = 0;
var skierTerms = [
 
]; // my activitys
var AWS = require('aws-sdk'); 
AWS.config.update({region: 'eu-west-1'});
AWS.config.update({accessKeyId:'AKIAIR7H7JBH5UWFXLIA',secretAccessKey:'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'});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);

	next();
});
app.get('/sign-s3', (req, res) => {
  const s3 = new AWS.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
    
    var random_name = '';
    
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 30; i++ ){
        random_name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    append_new_file(fileName,random_name);
  const s3Params = {
    Bucket: "omta-firstapp",
    Key: random_name,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${"omta-firstapp"}.s3.amazonaws.com/${random_name}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});
app.get('/public/sites/add_file.html', function(request, response) {
    response.render('public/sites/add_file.html');
});
app.get('/public/sites/forgot_mypass.html', function(request, response) {
    response.render('public/sites/forgot_mypass.html');
});
app.get('/public/sites/show_files.html', function(request, response) {
    response.render('public/sites/show_files.html');
});
app.get('/', function(request, response) {
    response.render('public/login.html');
});
app.get('/public/sites/login.html', function(request, response) {
    response.render('public/sites/login.html');
});
app.get('/public/sites/acount_not_exsists.html', function(request, response) {
    response.render('public/sites/acount_not_exsists.html');
});
app.get('/public/sites/panel.html', function(request, response) {
    response.render('public/sites/panel.html');
});
app.get('/public/sites/showdictionary.html', function(request, response) {
    response.render('public/sites/dictionary.html');
});
app.get("/dictionary-api", function(req, res) { // router that open 
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
            skierTerms = [];
            var obj = JSON.parse(data);
            obj = obj.users[userIndex].MyActivitys;
            obj.forEach(function(everyObject) { 
                skierTerms.push({nameActivity: everyObject.nameActivity, Activity: everyObject.Activity}); 
            });
                    res.json(skierTerms); 

        });
    


});
app.get("/get_my_links", function(req, res) { // router that open     
  var my_links = [];
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        obj = obj.users[userIndex].MyFiles;
        if(obj.length >= 1){
            obj.forEach(function(everyObject,callback) {       
            var new_file_save = { fileName: everyObject.fileName, fileUrl: everyObject.fileUrl , nameServer : everyObject.nameServer};
             my_links.push(new_file_save);
            });   
        }
        res.json(my_links);
    });                       
                
});
app.post("/forgot_password", function(req, res) { // handle post for that page 
        forgotPassword(req.body,function(value) {
                    res.end(value);
                });

});
app.post("/dictionary-api", function(req, res) { // router that open 
    append_new_Object(req.body,function(value) {
                    res.end(value);
                });


});
app.post("/login", function(req, res) { // handle post for that page 
    
    LoginFunc(req.body,function(value) {
                    console.log("hello You : "+value)
                    res.end(value);
                });
    
});    
app.post("/register", function(req, res) { // handle post for that page 
            
            newMember(req.body,function(value) {
                    res.end(value);
                });
});
app.post("/updateUserIndex", function(req, res) { // handle post for that page 
            userIndex = req.body.userIndex;
});
app.post("/delete_file", function(req, res) { // handle post for that page 
                                console.log("here1" +req.body.Key);
                                console.log("here2" +req.body.nameServer);
            deleteFile(req.body);
});
app.delete("/dictionary-api/:nameActivity", function(req, res) { // on delete 
    var valueToDel = req.params.nameActivity;
    var posion = 0 ;
    var flag = 0 ;
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



function LoginFunc(Get_req_body,cb){
        var my_account_index = -1; // 0 == no;
        var Get_username = Get_req_body.username.toLowerCase();
        var Get_password = Get_req_body.password.toLowerCase();
        fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        obj = JSON.parse(data);
        obj = obj.users;
        var run = 1 ;
        for(var i = 0 ; i<obj.length && run == 1; i++){
               if(Get_username.trim() == obj[i].username.trim() && Get_password == obj[i].password.trim() ){
                                       console.log("hello ! Match i:"+i);    
                   my_account_index = i ; // the object number on the json
                   userIndex=i;
                   run = 0 ;
                }    
        };
  
            cb(my_account_index+"");
           
        });
};//log in the the web page and save the localStorage index
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
        
    
    
} // delete a activty
function append_new_Object(new_obj,cb){
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
        cb("");
        
});


} // add new activity on the Activity list
function newMember(new_obj,cb){ // add new user the json
        var check_new_member = 0 ; // 0==no
        fs.readFile('public/activity-data.json', 'utf8', function (err, data) {
        var obj = JSON.parse(data); // data 
        var this_accountName_is_taken = 0 ;
        var run = 1 ;// check if user exists
        for(var i = 0 ; i<obj.users.length && run == 1; i++){                           
               if(new_obj.username.trim() === obj.users[i].username.trim() && new_obj.password === obj.users[i].password.trim()){
               check_new_member = 1 ; // the object are exists
               run = 0 ;
            }    
        };
            
        //if user is not exists , create him
        if(check_new_member == 0 ){//not exists
                var exmapleObj = obj.users[0]; // take json un user index
                var configJSONExample = JSON.stringify(exmapleObj);
                var newObject = configJSONExample;
                var obj3 = JSON.parse(newObject); // data 
                obj3.username = new_obj.username.toLowerCase();
                obj3.email = new_obj.email.toLowerCase();
                obj3.password = new_obj.password.toLowerCase();
                obj3.MyActivitys = [];
                obj.users.push(obj3);
                var configJSON = JSON.stringify(obj);
                fs.writeFile('public/activity-data.json', configJSON, (err) => {
                      if (err){
                           throw err;
                      }
             
                });
                cb("success");

                }
            else{
                cb("fail");
            }

     });

        }
function deleteFile(deleted_obj){ // delete the file from the s3 server
var BUCKET = 'omta-firstapp';
var s3 = new AWS.S3();
var params = {
  Bucket: 'omta-firstapp', 
  Delete: { // required
    Objects: [ {
        Key: 'LoveImage' // required
      } ],
  },
};
var newobj = {Key: deleted_obj.nameServer} //delete from node
var newobj2 = {Key: deleted_obj.Key} // delete from json
params.Delete.Objects[0] = newobj;
var configJSON2 = JSON.stringify(params);
s3.deleteObjects(params, function(err, data) {
  if (err){
      console.log(err, err.stack); // an error occurred
  }else{
       console.log(data);  
      remove_fromjson_file(newobj2);
  }            // successful response
});
}
function remove_fromjson_file(deleted_obj){ // delete the url file from the json file
    var file_name = deleted_obj.Key; 
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        var obj2 = obj.users[userIndex].MyFiles;
        var runThisFor = 1;
        var indexToDel = -1;
        var configJSON = JSON.stringify(obj2);
        for(var i = 0 ; i<obj2.length && runThisFor == 1; i++){     
            if(obj2[i].fileName == deleted_obj.Key){
                 runThisFor = 0 ;
                 indexToDel = i;
            }
         }
           
        delete obj2[userIndex]
        obj2.splice(userIndex,1);
        var configJSON = JSON.stringify(obj);
        fs.writeFileSync('public/activity-data.json', configJSON);

    });

} 
function append_new_file(name_json,name_server){//add new file to the json 
    fs.readFile('public/activity-data.json', 'utf8', function (err, data) {  
        var obj = JSON.parse(data); // data 
        var obj2 = obj.users[userIndex].MyFiles;
        var new_file_save = {fileName: name_json, fileUrl: "http://omta-firstapp.s3.amazonaws.com/"+name_server,nameServer: name_server };
        obj2.push(new_file_save);
        var configJSON2 = JSON.stringify(obj);
        
        
     fs.writeFile('public/activity-data.json', configJSON2, (err) => {
          if (err){
               throw err;
          }
        });
        
        });
    

} // add the file url to the json on the user
function forgotPassword(new_obj,cb){
        fs.readFile('public/activity-data.json', 'utf8', function (err, data) { 
            var email = '';
            var pass = '';
            var obj = JSON.parse(data); // data 
            var run = 1 ;// check if user exists 
            for(var i = 0 ; i<obj.users.length && run == 1; i++){                     
                if(new_obj.username.trim() == obj.users[i].username.trim()){
                run = 0 ;
                email = obj.users[i].email;//look for email 
                pass = obj.users[i].password;//look for password 
               }
                       
            }   
            
            if(email != ''){ // if email has found
                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport('smtps://omertamire%40gmail.com:fhcjhhovfk@smtp.gmail.com');

                
                
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '"Omer Tamir 👥" <omertamire@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Password Recovery ', // Subject line
                    text: 'Dear User, you account password is : '+pass, // plaintext body
                    //    html: <b>"Dear User, you account password is : "+pass</b>// html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                });
                   
                cb("success");

            }
            else{// if email has not found
                cb("fail");
            }
            

        }); 
} // if user forgot is password
                       














//
//app.post("/check_file_exists", function(req, res) { // handle post for that page
//    checkFileExists(req.body.fileName);
//    
//});


//
//app.post("/update_values", function(req, res) { // handle post for that page 
//    uploadFileIfNeeded(req);    
//});

//
//
//
//function uploadFileIfNeeded(req){ // upload file to the s3
//    
//fs.stat(req.body.data, function(err, stat) {
//    if(err == null) {
//    //    console.log('File exists');
//        flagChecker[5] = 1;
//            var body = fs.createReadStream(req.body.data);
//        var s3obj = new AWS.S3({params: {Bucket: 'omta-firstapp', Key: req.body.fileName}});
//
//              var configJSON2 = JSON.stringify(body);
//
//        s3obj.upload({Body: body}).
//          on('httpUploadProgress',function(evt){
//           // console.log(evt); 
//        }).send(function(err, data) { 
//
//          //  console.log(err, data);
//        });
//         append_new_file(req.body.fileName);    
//        
//    } else if(err.code == 'ENOENT') {
//       // console.log('File do not exists');
//
//        
//    } else {
//     //   console.log('Some other error: ', err.code);
//    }
//});
//    
//
//
//     
//}
//function checkFileExists(req_key){ // check if the file name is exists on the s3 bucket
//    var fs = require('fs');
//    var allKeys = [];
//    var s3 = new AWS.S3(); 
//    var a = 0;
//    var params2 = {
//      Bucket: 'omta-firstapp', /* required */
//    //  Delimiter: 'STRING_VALUE',
//      EncodingType: 'url',
//      Marker: '',
//    //  Prefix: 'STRING_VALUE'
//    };
//    
//    
////    ------Get Key When there is no Errors------
//    s3.listObjects(params2, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else {           
//            var run = 1;
//          for(var i = 0 ; i< data.Contents.length && run == 1; i++){
//                 if( data.Contents[i].Key.trim() == req_key.trim())
//                  {
//                      a=1;
//                      run= 0;
//                  }
//          }
//          
//
//            }
//            if(a==1){//exists
//                
//              flagChecker[3] = 1 ;
//
//            }
//        else{// not exsists
//            
//          flagChecker[3] = 0 ;
//            }
//        
//
//        });
//    
//
//     
//
//}