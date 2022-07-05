$( document ).ready(function() {
    $.ajax({url: "/data/home.json", success: function(result){
        console.log(result);
    }});
});