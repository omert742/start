$(document).ready(function () { // on fuction ready ( someting JQuery need)
      
    
    $( window ).load(function() {
  //  $('body>dl').empty();//clean my dl tag

    });
    
    
    $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
    
    
    $('form').submit(function (e) {
        e.preventDefault();
  
        $.post('/dictionary-api', {nameActivity: $('#name_activity').val(), Activity: $('#activity_description').val()}, printTerms);
        this.reset();

      
    });

});

function printTerms(terms) { // got the json file on terms .
    
    $('body>dl').empty();//clean my dl tag
    $.each(terms, function () { // for each term in the terms json (for each json object)
        $('<dt>').text(this.nameActivity).appendTo('body>dl');  // create <dt> with the term value and add in to the dl
        $('<dd>').text(this.Activity).appendTo('body>dl');  //create <dd> with the Activity value and add in to the dl
    });
    $('dt').off('dblclick').dblclick(function() { // on double click on 'dt'
        $.ajax({
            url: '/dictionary-api/' + $(this).text(),// open delete request with the value of /dictionary-api/+term name
            type: 'DELETE',
            success: printTerms // on success - reload the list 
        });
    });
}
