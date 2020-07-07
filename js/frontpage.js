function enter_room(room_id) { 
    console.log("Room ID: ", room_id);
    $.ajax({
        url:"php/frontpage.php",
        data: { 
            login_id: getCookie("login_id"),
            room_id: room_id,
            action: "enter_room"
        },
        type: "GET",
        success: function(data) {
            console.log("Enter room!");
            $("#login_id").val(getCookie("login_id"));
            $("#room_id").val(room_id);
            $("#game_form").submit();
        },
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

function rooms() {
    $.ajax({
        url:"php/frontpage.php",
        data: {
            action: "rooms"
        },
        type: "GET",
        success: function(data) {
            console.log("All rooms!");
            $("#front-page").html("");
            $("#front-page").append("<table>");
            $("#front-page").append("<tr> <th> Room Name </th> <th> Number of users </th> <th> Enter </th> </tr>");
            
            for (var i = 0; i < data["room_id"].length; i++) {
                $("#front-page").append("<tr>");
                var room_id = data["room_id"][i];
                var room_name = data["room_name"][i];
                // var room_status = data["room_status"][i];    - ovo mi mozda ni ne triba
                var room_users = data["room_users"][i];
                
                $("#front-page").append("<td>" + room_name + "</td>");
                $("#front-page").append("<td>" + room_users.length + "</td>");  // ovo triba popravit
                $("#front-page").append("<td> <button id='btn_" + room_id + "' value ='" + room_id + "'> Enter </button> </td>");
                $("#front-page").append("</tr>");

                $("#btn_" + room_id).click(function() { 
                    enter_room($(this).val())
                });
            }
            $("#front-page").append("</table>");
        }, 
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

function new_room() {
    $.ajax({
        url:"php/frontpage.php",
        data: { 
            action: "new_room"
        },
        type: "GET",
        success: function(data) {
            console.log("New room!");
            $("#front-page").html("");
            $("#front-page").html(data);
            
            $(document).on("click", "#btn_create", create_room);
        },
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

function create_room() {
    $.ajax({
        url:"php/frontpage.php",
        data: {
            login_id: getCookie("login_id"),
            room_name: $("#nroom").val(),
            action: "create_room"
        },
        type: "GET",
        success: function(data) {
            console.log("Create room!");
            $("#front-page").html("");
            $("#front-page").html(data);
        },
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}


function logout() {
    $.ajax({
        url:"php/frontpage.php",
        data: { 
            action: "logout"
        },
        type: "GET",
        success: function() {
            $("#front-page").html("");
            /*
            $.getScript("cookies.js", function(){
                deleteCookie("login_id");
            });
            */
            window.location.href = "login.html";
        }, 
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status == 404) {
                alert(thrownError);
            }
        }
    });
}

$(document).ready(function() {
    if(getCookie("login_id") == "") {
        window.location.href = "login.html";
    }

    $("#rooms").on("click", rooms);
    $("#new_room").on("click", new_room);
    $("#logout").on("click", logout);
});