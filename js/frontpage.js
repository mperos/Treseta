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
            $("#front-page").css("width", "100%").css("text-align", "center").css("display", "flex").css("justify-content","center");
            
            $("#front-page").html("");
            $("#front-page").append("<table id='tablica' style='align-self: center;'>");
            $("#tablica").append("<tr> <th> Room Name </th> <th> Number of users </th> <th> Enter </th> </tr>");
            
            for (var i = 0; i < data["room_id"].length; i++) {
                var room_id = data["room_id"][i];
                var room_name = data["room_name"][i];
                var room_users = JSON.parse(data["room_users"][i]);
                
                $("#tablica").append("<tr> <td>" + room_name + "</td> <td>" + room_users.users.length + "</td> <td> <button id='btn_" + room_id + "' value ='" + room_id + "'> Enter </button> </td> </tr>");
        
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
            $("#front-page").css("width", "100%").css("text-align", "center").css("display", "flex").css("justify-content","center");
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
            $("#front-page").css("width", "100%").css("text-align", "center").css("display", "flex").css("justify-content","center");
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
            $("#front-page").css("width", "100%").css("text-align", "center").css("display", "flex").css("justify-content","center");
            $("#front-page").html("");
            /*
            $.getScript("cookies.js", function() {
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