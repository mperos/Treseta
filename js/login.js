function login() {
    var user = $("#name").val();
    var pass = $("#pass").val();

    $.ajax({
        url:"php/login.php",
        data: { 
            user: user,
            pass: pass,
            action: "login"
        },
        type: "GET",
        success: function(data) {
            console.log("Login!");

            if(data["id"] !== false) {
                $("#login_id").val(data["id"]);
                console.log("ID value: ", $("#login_id").val());
                $("#login_form").submit();
            }
        }, 
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

function register() {
    var user = $("#name").val();
    var pass = $("#pass").val();

    $.ajax({
        url:"php/login.php",
        data: {
            user: user,
            pass: pass,
            action: "register"
        },
        type: "GET",
        success: function(data) {
            console.log("Register!");
            console.log(data);
        },
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

$(document).ready(function() {
    $("#login").on("click", login);
    $("#register").on("click", register);
});
