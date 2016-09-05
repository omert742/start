$(document).ready(function () { // on fuction ready ( someting JQuery need)
      
    
    $( window ).load(function() {
  //  $('body>dl').empty();//clean my dl tag

    });
    
    
    $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
    
    
    
    $('#addText').submit(function (e) {
         e.preventDefault();
        $.post('/dictionary-api', {nameActivity: $('#name_activity').val(), Activity: $('#activity_description').val()});        this.reset();

         $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms


    });

    
    
    
//    
//    
//        $.getJSON('/login'), function(terms) { // router that open 
//            console.log("On Login JS + e :"+terms);
//            //this.reset();
//                        //e.preventDefault();};
//            
            

    
    
    $('#register').submit(function (e) {
        e.preventDefault();
        $.post('/login', {username: $('#username').val(),password: $('#password').val()}, printTerms);
        this.reset();
           
        
        
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
    
    });

});













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
