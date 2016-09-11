$(document).ready(function () { // on fuction ready ( someting JQuery need)
      
    
    $( window ).load(function() {
  //  $('body>dl').empty();//clean my dl tag

    });
    
    
    $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
    
 
    
//            $.post('/registerupdatedata', {username: $('#username').val(),password: $('#password').val()}, printTerms);

    
    $('#addText').submit(function (e) {
         e.preventDefault();
        $.post('/dictionary-api', {nameActivity: $('#name_activity').val(), Activity: $('#activity_description').val()});        this.reset();

         $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms


    });

    
    

    
    
    $('#login').submit(function (e) {
                e.preventDefault();

        $.post('/login', {username: $('#username').val(),password: $('#password').val()}, printTerms);
           
        
        
        setTimeout(function (){

  // Something you want delayed.

}, 1000);
        
        
                    
    $.getJSON('/login', function(terms){
          console.log("Fuck It flag " +terms[0]);
        
        if(terms[0] == 0) {
                alert('Login Fail');
            }
        
        else{
            alert('Login Sueceessfully');
        }

    });//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
            this.reset();

    });

});





function Login() { // got the json file on terms .
    var Uname = $('#Log_username').val();
    var Upassword = $('#Log_password').val();

        if(Uname.length != 0 || Upassword.length != 0 )
            {
            $.post('/login', {username: $('#Log_username').val(),password: $('#Log_password').val()});
               $.ajax({
                   type: "GET",
                   url: "register",
                   async: false,
                   success: function() {                     
                    $.getJSON('/register', function(terms){
                          console.log("Fuck It register " +terms);

                        
                     if(terms[0] == 1) {
                                alert('Login');
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


function newMember() { // got the json file on terms .
    var Uname = $('#reg_username').val();
        var Upassword = $('#reg_password1').val();
            var Upassword2 = $('#reg_password2').val();
    
        if(Uname.length != 0 && Upassword.length != 0 && Upassword2.length != 0 && Upassword === Upassword2 && Upassword.length >= 5 && Upassword2.length >= 5)
            {
            $.post('/register', {username: $('#reg_username').val(),password: $('#reg_password1').val()});
               $.ajax({
                   type: "GET",
                   url: "register",
                   async: false,
                   success: function() {                     
                    $.getJSON('/register', function(terms){
                          console.log("Fuck It register " +terms);

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
