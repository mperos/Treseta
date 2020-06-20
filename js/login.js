function login() {
    var user = $("#name").val();
    var pass = $("#pass").val();

    $.ajax({
        url:"../php/login.php",
        data: { 
            user: user,
            pass: pass
        },
        type: "GET",
        dataType: "json",
        success: function(data) {
            // odvedi me na front page
            console.log(data);
        }
    });
}

function register() {
    var user = $("#name").val();
    var pass = $("#pass").val();

    $.ajax({
        url:"../php/login.php",
        data: { 
            user: user,
            pass: pass
        },
        type: "GET",
        dataType: "json",
        success: function(data) {
            // odvedi me na front page
            console.log(data);
        }
    });
}

$(document).ready(function() {
    $("#login").on("click", login);
    $("$register").on("click", register);
});