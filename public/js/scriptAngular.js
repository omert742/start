var NodeAngularApp = angular.module('NodeAngularApp',['ngRoute'])



NodeAngularApp.config(function($routeProvider,$locationProvider){
             
$routeProvider
.when('/',{
    templateUrl: 'sites/login.html',
    controller: 'login'
})
.when('/register',{
    templateUrl: 'sites/register.html',
    controller: 'registerController'
}).when('/online_chat',{
    templateUrl: 'sites/online_chat.html',
    controller: 'mainController'
})
.when('/login',{
    templateUrl: 'sites/login.html',
    controller: 'mainController'
})
.when('/add_file',{
        templateUrl: 'sites/add_file.html',
        controller: 'add_file'
})
.when('/showdictionary',{
        templateUrl: 'sites/dictionary.html',
        controller: 'showDictionary'
})
.when('/panel',{
        templateUrl: 'sites/panel.html',
        controller: 'MainController'
}).when('/show_files',{
        templateUrl: 'sites/show_files.html',
        controller: 'showFiles'
})

    
});

NodeAngularApp.controller('mainController',function($scope,$log,$location){
            
});


NodeAngularApp.controller('add_file',function(){
checkFileNameExists
});

    NodeAngularApp.controller('login',function(){
//Login();    
});
    
NodeAngularApp.controller('registerController',function(){
//newMember();    
});

NodeAngularApp.controller('showDictionary',function(){
    getDicitionry();
});

NodeAngularApp.controller('showFiles',function(){
    showFilesF();
});




function newMember() { // got the json file on terms .
    var Uname = $('#reg_username').val();
        var Upassword = $('#reg_password1').val();
            var Upassword2 = $('#reg_password2').val();
    
        if(Uname.length != 0 && Upassword.length != 0 && Upassword2.length != 0 && Upassword === Upassword2 && Upassword.length >= 5 && Upassword2.length >= 5)
            {
            $.post('/register', {username: $('#reg_username').val(),password: $('#reg_password1').val()});
               $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: false,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){

                         if(terms[1] == 1) {
                                alert('Registierison id allready exists');

                        }else {
                            alert('Sueceessfully Registiered');
                        }

                    });
                   }
            }); 
                

    }else{
        alert("Eror 404 - \n The filed are not full \n Or the passwords are not the same \n Or the password is short the 6 letters")
    }
    
   
    
}
function showFilesF(){
   var ulist = document.getElementById("addFilesBox");
              $.ajax({
                   type: "GET",
                   url: "get_my_links",
                   async: true,
                   success: function() {                     
                        $.getJSON('/get_my_links', function(my_links){
                        my_links.forEach(function(everyObject,callback) {       
                        var a = document.createElement("a");
                        var newItem = document.createElement("li");
                        a.textContent = everyObject.fileName;
                        a.setAttribute('href', everyObject.fileUrl);
                        newItem.appendChild(a);
                        ulist.appendChild(newItem);    
                    });   
                    });
                   }
            });

}
function getDicitionry(){
                                       
    $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
}
function printTerms(terms) { // got the json file on terms .
    $('#mainDataBox').empty();//clean my dl tag
    $.each(terms, function () { // for each term in the terms json (for each json object)
        $('<dt>').text(this.nameActivity).appendTo('#mainDataBox');  // create <dt> with the term value and add in to the dl
        $('<dd>').text(this.Activity).appendTo('#mainDataBox');  //create <dd> with the Activity value and add in to the dl
    });
    $('dt').off('dblclick').dblclick(function() { // on double click on 'dt'
        $.ajax({
            url: '/dictionary-api/' + $(this).text(),// open delete request with the value of /dictionary-api/+term name
            type: 'DELETE',
            success: printTerms // on success - reload the list 
        });
    });

}      

function Login() { // got the json file on terms .
    var Uname = $('#Log_username').val();
    var Upassword = $('#Log_password').val();

        if(Uname.length != 0 || Upassword.length != 0 )
            {
            $.post('/login', {username: $('#Log_username').val(),password: $('#Log_password').val()});
               $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: false,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){
                            
                        
                     if(terms[0] == 1) {
                                alert('Login');
                            window.location = '/#/showdictionary'
                                getDicitionry();

                                    
                                    
    
                            }else {
                            alert('Eror 404 - \nPlease check again that you filed all the details currectly');
                        }

                    });
                   }
            }); 
                

    }else{
        alert("Eror 404 - The filed are not full or the passwords is not the same")
    }
    
   
    
}

function AddNewTerm(){
    
    $('#addText').submit(function (e) {
         e.preventDefault();
        $.post('/dictionary-api', {nameActivity: $('#name_activity').val(), Activity: $('#activity_description').val()});  
        this.reset();
        
        
        
                setTimeout(function() {
         $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: true,
                   success: function() {     
                       
     $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
                   }
            });
    }, 200);
})
}
                         
                         
function checkOnChange(){
      document.getElementById("BtnUploadFile").disabled = true;
                        document.getElementById("BtnUploadFile").style.background='#Ff2141';

}

function checkFileNameExists(){   
    var fileName = $('#fileName').val();
    
    if(fileName.length > 0 ){
         $.post('/check_file_exists', {fileName: fileName,data: ""} );
                    move();

        setTimeout(function() {
         $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: true,
                   success: function() {     
                       
                                    console.log("ajax is starting");

                    $.getJSON('/resultArray', function(terms){
                        console.log("result Array : "+terms);
                     if(terms[3] == 0) {
                         document.getElementById("BtnUploadFile").disabled = false;
                         document.getElementById("BtnUploadFile").style.background='#2ff2ff';
                         
                     }
                    else{ // exists
                         document.getElementById("BtnUploadFile").disabled = true;
                        document.getElementById("BtnUploadFile").style.background='#Ff2141';
                             alert('File name is allready exists ,\nPlease choose other name :/');
                        }

                    });
                   }
            });
    }, 2000);
                       // Whatever you want to do after the wait
}
    else
    {
     alert('The name field is empty :/'); 
    }
}


function UploadFile()
{
    var error = "No such file or directory on :\n";
            var fileName = $('#fileName').val().trim();
               var filePath = $('#filePath').val().trim();
    error+=filePath;
    
    if(fileName.length != 0 && filePath.length != 0){
        
                
                $.post('/update_values', {fileName: fileName,data: filePath} );
        
                    $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: true,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){

                                alert('File Upload Successfully');
                        });
                   }
                    });
                   }
    else
    {
        alert('The fileds are empty , \nPlease fill them :)');
    }
}


function move() {
  var elem = document.getElementById("myBar");
          elem.style.width = 0 + '%';
  var width = 0.5;
  var id = setInterval(frame, 20);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }
}


