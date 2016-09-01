$(document).ready(function () { // on fuction ready ( someting JQuery need)

    $.getJSON('/dictionary-api', printTerms);//go to the adress '/dictionary-api' and take the paramtes and send the to the function printTerms
    
    
    $('form').submit(function (e) {
        e.preventDefault();
        $.post('/dictionary-api', {termx: $('#term').val(), defined: $('#defined').val()}, printTerms);
        this.reset();
    });

});

function printTerms(terms) { // got the json file on terms .
    $('body>dl').empty();//clean my dl tag
    $.each(terms, function () { // for each term in the terms json (for each json object)
        $('<dt>').text(this.termx).appendTo('body>dl');  // create <dt> with the term value and add in to the dl
        $('<dd>').text(this.defined).appendTo('body>dl');  //create <dd> with the defined value and add in to the dl
    });
    $('dt').off('dblclick').dblclick(function() { // on double click on 'dt'
        $.ajax({
            url: '/dictionary-api/' + $(this).text(),// open delete request with the value of /dictionary-api/+term name
            type: 'DELETE',
            success: printTerms // on success - reload the list 
        });
    });
}
