var NodeAngularApp = angular.module('NodeAngularApp',['ngRoute'])

//console.log("app Load");
//set userIndex 
$.post('/updateUserIndex', {userIndex: localStorage.userIndex});

NodeAngularApp.config(function($routeProvider,$locationProvider){
             
$routeProvider
.when('/',{
    templateUrl: 'sites/login.html',
    controller: 'login'
})
.when('/register',{
    templateUrl: 'sites/register.html',
    controller: 'registerController'
})
.when('/online_chat',{
    templateUrl: 'sites/online_chat.html',
    controller: 'mainController'
})
.when('/logout',{
    templateUrl: 'sites/login.html',
    controller: 'logout'
})
.when('/login',{
    templateUrl: 'sites/login.html',
    controller: 'login'
})
.when('/acount_not_exsists',{
    templateUrl: 'sites/acount_not_exsists.html',
    controller: 'notExists'
})
.when('/add_file',{
        templateUrl: 'sites/add_file.html',
        controller: 'add_file',
        contollerAs: 'vm'
})
.when('/showdictionary',{
        templateUrl: 'sites/dictionary.html',
        controller: 'showDictionary'
})
.when('/panel',{
        templateUrl: 'sites/panel.html',
        controller: 'mainController'
})
.when('/show_files',{
        templateUrl: 'sites/show_files.html',
        controller: 'showFiles'
})
.when('/forgot_mypass',{
        templateUrl: 'sites/forgot_mypass.html'
})


    
});
NodeAngularApp.controller('mainController',function(){
    if(localStorage.userIndex == undefined)
        {
            window.location = '/#/acount_not_exsists'
        }
});

NodeAngularApp.controller('notExists',function(){

});
NodeAngularApp.controller('logout',function(){
localStorage.removeItem("userIndex");
});
NodeAngularApp.controller('add_file',function($scope,$http){
//    
//        $scope.upload = function(file){
//            $http({url:})
//                   data = file
//        }
//        
       if(localStorage.userIndex == undefined)
        {
            window.location = '/#/acount_not_exsists'
        }else
        {
            //checkFileNameExists();
        }
});
NodeAngularApp.controller('login',function(){
//Login();    


});    
NodeAngularApp.controller('registerController',function(){
//newMember();    
});
NodeAngularApp.controller('showDictionary',function(){
           if(localStorage.userIndex == undefined)
        {
            window.location = '/#/acount_not_exsists'
        }else
        {
                getDicitionry();
        }
});
NodeAngularApp.controller('showFiles',function(){
    
             if(localStorage.userIndex == undefined)
        {
            window.location = '/#/acount_not_exsists'
        }else
        {
    showFilesF();
        }
});




function newMember() { // got the json file on terms .
    var Uname = $('#reg_username').val();
    var Umail = $('#reg_email').val();
        var Upassword = $('#reg_password1').val();
            var Upassword2 = $('#reg_password2').val();
        if(Uname.length != 0 && Upassword.length != 0 && Upassword2.length != 0 && Umail.length != 0 && Upassword === Upassword2 && Upassword.length >= 5 && Upassword2.length >= 5 )
            {
            $.post('/register', {username: $('#reg_username').val(),password: $('#reg_password1').val(),email : Umail});
               $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: true,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){

                         if(terms[1] == 1) {
                            var my_dialog = document.getElementById('register_dialog');
                              my_dialog.className = 'alert alert-danger'; 
                                my_dialog.innerHTML = 'Registierison id allready exists';
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";
                                }, 1000);

                        }else {
                            $('#reg_username').val('');
                            $('#reg_email').val('');
                            $('#reg_password1').val('');
                            $('#reg_password2').val('');
                            var my_dialog = document.getElementById('register_dialog');
                             my_dialog.className = 'alert alert-success';       
                            my_dialog.innerHTML = 'Sueceessfully Registiered';
                                    my_dialog.style.visibility = "visible";
                                    setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";
                                }, 1000);
                        
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
                            
                            
                        var a = document.createElement("a"); // create a       
                        a.textContent = everyObject.fileName;
                        a.setAttribute('href', everyObject.fileUrl);
                        var deleteBtn = document.createElement("BUTTON");
                        var t = document.createTextNode("Delete File");    
                        deleteBtn.appendChild(t);
                        deleteBtn.onclick = function () {
                            $("addFilesBox").empty();
    $.post('/delete_file',{Key: everyObject.fileName,nameServer: everyObject.nameServer}); 
                            var my_dialog = document.getElementById('show_dialog');
                              my_dialog.className = 'alert alert-info'; 
                                my_dialog.innerHTML = 'Deleting File...';
                                my_dialog.style.visibility = "visible";
                   
                            
                              setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";
                                     window.location = '/#/panel'
                                setTimeout(function() {
                                    window.location = '/#/show_files'

                                }, 200);

                                }, 1000);
                            
                               

                        };  
                            
 
                        var newItem = document.createElement("li"); // create li
                        newItem.className = "list-group-item" // li is list
                        newItem.appendChild(a); // add a to the li
                        var br = document.createElement("br");    
                        newItem.appendChild(br); // add a to the li
                        newItem.appendChild(deleteBtn); // add a to the li
                        ulist.appendChild(newItem);  // add the li to the list

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
                   async: true,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){
                            
                     if(terms[0] == 1) {
                            if(localStorage.userIndex != undefined)
                                {
                                    localStorage.removeItem("userIndex");
                                }
                                localStorage.userIndex = terms[4];
                              var my_dialog = document.getElementById('login_dialog');
                              my_dialog.className = 'alert alert-success'; 
                                my_dialog.innerHTML = 'Login';
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";
                                     window.location = '/#/panel'

                                }, 1000);
                         

                                    
                                    
    
                            }else {
                                 var my_dialog = document.getElementById('login_dialog');
                              my_dialog.className = 'alert alert-danger'; 
                                my_dialog.innerHTML = 'Eror 404 - \nPlease check again that you filed all the details currectly';
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";

                                }, 2000);    
                                
                        }

                    });
                   }
            }); 
                

    }else{
           var my_dialog = document.getElementById('login_dialog');
                              my_dialog.className = 'alert alert-danger'; 
                                my_dialog.innerHTML = "Eror 404 - The fileds are not fulls or the passwords is not match";
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";

                                }, 2000);
    }
    
   
    
}
function AddNewTerm(){
    
    $('#addText').submit(function (e) {
         e.preventDefault();
        
        var getName = $('#name_activity').val();
        var getActivity = $('#activity_description').val();
        if(getName.length != 0 && getActivity.length != 0){
        $.post('/dictionary-api', {nameActivity: getName, Activity: getActivity});  
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
        
    }else
        {
            alert('the fields are empty');
        }

})
} 
function sendMyPassById(){
        var Uname = $('#for_username').val();
    if(Uname.length >= 0){
            $.post('/forgot_password', {username: Uname});
        
                                        setTimeout(function() {

        
                       $.ajax({
                   type: "GET",
                   url: "resultArray",
                   async: true,
                   success: function() {                     
                    $.getJSON('/resultArray', function(terms){
                            console.log("terms[6] "+terms[6]);
                            console.log("terms[6].length "+terms[6].length);
                     if(terms[6].length > 0) {
                              var my_dialog = document.getElementById('forgot_pass_dialog');
                              my_dialog.className = 'alert alert-success'; 
                                my_dialog.innerHTML = 'The password sent to your email';
                                my_dialog.style.visibility = "visible";
                                $('#for_username').val('');

                        setTimeout(function() {
                            
                                    my_dialog.style.visibility = "hidden";

                                }, 1000);
                         

                                    
                                    
    
                            }else {
                                 var my_dialog = document.getElementById('forgot_pass_dialog');
                              my_dialog.className = 'alert alert-danger'; 
                                my_dialog.innerHTML = 'The username is not exists';
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";

                                }, 2000);    
                                
                        }

                    });
                   }
            }); 
                                                                            }, 200);

        
        
        
        
    }
                                                   
    else
        {
                      var my_dialog = document.getElementById('forgot_pass_dialog');
                              my_dialog.className = 'alert alert-danger'; 
                                my_dialog.innerHTML = "Eror 404 - The filed are not full or the passwords is not the same";
                                my_dialog.style.visibility = "visible";
                        setTimeout(function() {
                                    my_dialog.style.visibility = "hidden";

                                }, 2000); 
        }
}
function onChangeFile(){
     console.log("hey")
         const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    getSignedRequest(file);
}
function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
if (file.name.match(/\.(jpg|jpeg|png|gif)$/))
    {
        console.log('img')
        document.getElementById('preview').src = url;
    }
else
    {
       document.getElementById('preview').src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Upload.svg/2000px-Upload.svg.png"; 
    }
       // document.getElementById('avatar-url').value = url;
          
           var my_dialog = document.getElementById('add_dialog');
             my_dialog.className = 'alert alert-success'; 
            my_dialog.innerHTML = 'File Upload Successfully';
            my_dialog.style.visibility = "visible";
                setTimeout(function() {
                      my_dialog.style.visibility = "hidden";
                }, 4000);  
          
      }
      else{
                                      
            var my_dialog = document.getElementById('add_dialog');
              my_dialog.className = 'alert alert-danger'; 
                my_dialog.innerHTML = 'Could not upload file.';
                my_dialog.style.visibility = "visible";
                setTimeout(function() {
                            my_dialog.style.visibility = "hidden";
               }, 4000);   
      }
    }
  };
  xhr.send(file);
}




//function checkFileNameExists(){ 
//    
//    
//    
//    var formData = new FormData();
//
//    var fileName = $('#fileName').val();
//    if(fileName.length >=1){
//    $.post('/check_file_exists', {fileName: fileName,data: ""}, function( data ) {
//    alert('check Complte');
//    
//    })
//     .done(function() {
//    alert( "second success" );
//  });
//        
//        
//        
//        
//        
//                    move();
//
//        setTimeout(function() {
//         $.ajax({
//                   type: "GET",
//                   url: "resultArray",
//                   async: true,
//                   success: function() {     
//                       
//
//                    $.getJSON('/resultArray', function(terms){
//                     if(terms[3] == 0) {
//                         document.getElementById("BtnUploadFile").disabled = false;
//                         document.getElementById("BtnUploadFile").style.background='#2ff2ff';
//                         
//                         
//                            var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-info'; 
//                                my_dialog.innerHTML = 'File is ready for upload';
//                                my_dialog.style.visibility = "visible";
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);
//                         
//                         
//                     }
//                    else{ // exists
//                         document.getElementById("BtnUploadFile").disabled = true;
//                     document.getElementById("BtnUploadFile").style.background='#Ff2141';
//                        
//                          var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-danger'; 
//                                my_dialog.innerHTML = 'File name is allready exists ,\nPlease choose other name :/';
//                                my_dialog.style.visibility = "visible";
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);
//                        
//                        
//                        }
//
//                    });
//                   }
//            });
//    }, 2000);
//                       // Whatever you want to do after the wait
//}
//    else
//    {
//           var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-danger'; 
//                                my_dialog.innerHTML = 'The name field is empty :/';
//                                my_dialog.style.visibility = "visible";
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);
//    }
//}
//function UploadFile(){
//
//          document.getElementById("BtnUploadFile").disabled = true;
//      document.getElementById("BtnUploadFile").style.background='#Ff2141';
//    
//    var fileName = $('#fileName').val().trim();
//               var filePath = $('#filePath').val().trim();
//    
//    if(fileName.length != 0 && filePath.length != 0){
//        
//                
//                $.post('/update_values', {fileName: fileName,data: filePath} );
//        
//                                setTimeout(function() {
//
//                    $.ajax({
//                   type: "GET",
//                   url: "resultArray",
//                   async: true,
//                   success: function() {                     
//                    $.getJSON('/resultArray', function(terms){
//                        if(terms[5] == 0){
//                            
//                                          var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-danger'; 
//                                my_dialog.innerHTML = 'File Not Exists';
//                                my_dialog.style.visibility = "visible";
//                             document.getElementById("BtnUploadFile").disabled = false;
//                     document.getElementById("BtnUploadFile").style.background='#2ff2ff';
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);              
//                        }
//                        else{
//                                      var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-success'; 
//                                my_dialog.innerHTML = 'File Upload Successfully';
//                                my_dialog.style.visibility = "visible";
//                                  document.getElementById("BtnUploadFile").disabled = false;
//      document.getElementById("BtnUploadFile").style.background='#2ff2ff';
//                            
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);
//                        }
//                            
//                        });
//                   }
//                    });
//                    }, 500);
//                   }
//    else
//    {
//        
//         var my_dialog = document.getElementById('add_dialog');
//                              my_dialog.className = 'alert alert-danger'; 
//                                my_dialog.innerHTML = 'The fileds are empty , \nPlease fill them :)';
//                                my_dialog.style.visibility = "visible";
//                        setTimeout(function() {
//                                    my_dialog.style.visibility = "hidden";
//
//                                }, 2000);
//    }
//}
//function move() {
//  var elem = document.getElementById("myBar");
//          elem.style.width = 0 + '%';
//  var width = 0.5;
//  var id = setInterval(frame, 20);
//  function frame() {
//    if (width >= 100) {
//      clearInterval(id);
//    } else {
//      width++;
//      elem.style.width = width + '%';
//    }
//  }
//}
