function startTimer(player) {
    orientation = getTimerOrientation(player);

    if (orientation === "hor") {
        progress_attr = "width";
    }else{
        progress_attr = "height";
    }

    timer = $("#player-" + player + " .timer-" + orientation);
    bar = $("#player-" + player + " .bar-" + orientation);
    timer.css("background-color", "green");
}

function stopTimer(player, timerId) {
    clearInterval(timerId);
    orientation = getTimerOrientation(player);

    if (orientation === "hor") {
        progress_attr = "width";
    }else{
        progress_attr = "height";
    }

    timer = $("#player-" + player + " .timer-" + orientation);
    bar = $("#player-" + player + " .bar-" + orientation);
    timer.css("background-color", "grey");
}

function playCard(player, carddown) {
    orientation = getCardOrientation(player);
    cards = $("#player-" + player + " .card-" + orientation);
    stackSize = 4 - $(".stack-card[src='']").length;

    if(cards.length > 0) {
        card = cards[0];
        card.remove();
        $("#card-play-" + player).attr("src", ("assets/img/cards/" + carddown + ".png"));
        $("#card-play-" + player).css("z-index", stackSize + 1);

        audio = new Audio('assets/sound/flop.wav');
        audio.play();
    }
}

function clearStack() {
    $("#card-play-top").attr("src", "");
    $("#card-play-left").attr("src", "");
    $("#card-play-right").attr("src", "");
    $("#card-play-bottom").attr("src", "");
}

function getCardOrientation(player) {
    switch (player) {
        case "left":
            return "hor";
        case "right":
            return "hor";
        case "top":
            return "ver";
        case "bottom":
            return "ver";
        default:
            return NaN;
    }
}

function getTimerOrientation(player) {
    switch (player) {
        case "left":
            return "ver";
        case "right":
            return "ver";
        case "top":
            return "hor";
        case "bottom":
            return "hor";
        default:
            return NaN;
    }
}

function getGameStatus(){
    $.ajax({
        type: "POST",
        url: "https://{{ BACKEND_URI }}/game_status.php",
        crossDomain: true,
        data: {game_id: 123, session_id: 123},
        success: updateGameTable,
        error: updateGameTable,
        dataType: "json"
      });
}

function updateGameTable(data) {
    window.localStorage.setItem("gameStatus", "active");
    window.localStorage.setItem("player", "bottom");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  

async function simulateGame() {
    while(1) {
        window.localStorage.setItem("player", "top");
        timerId = startTimer("top");
        await sleep(3000);
        stopTimer("top", timerId);
        playCard("top");

        window.localStorage.setItem("player", "right");
        timerId = startTimer("right");
        await sleep(3000);
        stopTimer("right", timerId);
        playCard("right");

        window.localStorage.setItem("player", "bottom");
        timerId = startTimer("bottom");
        await sleep(3000);
        stopTimer("bottom", timerId);
        playCard("bottom");

        window.localStorage.setItem("player", "left");
        timerId = startTimer("left");
        await sleep(3000);
        stopTimer("left", timerId);
        playCard("left");

        await sleep(1000);
        clearStack();
    }
}

var user_turn = 0;
var user_id = 0;

var newgame = false;

async function get_user_id()
{
      await $.get("./php/game.php", { function: 'myturn'}, function(data){
        
        user_turn = parseInt(data);
      });
}

async function get_user_turn()
{
    await $.get("./php/game.php", { function: 'loadturn'}, function(data){
        newdata = JSON.parse(data);
        for(var i = 0;i<4;i++)
        {
            if(newdata.user_order[i] === user_id)
            {
                user_turn = (i+3)%4;
            }
        }
        });
}

async function set_cards()
{
    wait_game = true;
    while(wait_game)
    {
        newgame = false;
        await $.get("./php/game.php", { function: 'loadturn'}, function(data){
            if(data == 'no')
                return;
            newdata = JSON.parse(data);
            if(newdata.turn < 5)
                wait_game = false;
            else
                return;
            cards = $("#player-bottom  .card-ver");
            for(var i = 0;i<10;i++)
            {
                cards[i].src = "assets/img/cards/" + newdata.cards[user_turn][i] + ".png";
            }
            can_play = newdata.table[0][0];
            });
    }
}

async function set_game()
{
    var arr = Array(40).fill("value");
    arr[0] = "b1";
    arr[1] = "b2";
    arr[2] = "b3";
    arr[3] = "b4";
    arr[4] = "b5";
    arr[5] = "b6";
    arr[6] = "b7";
    arr[7] = "b11";
    arr[8] = "b12";
    arr[9] = "b13";
    arr[10] = "d1";
    arr[11] = "d2";
    arr[12] = "d3";
    arr[13] = "d4";
    arr[14] = "d5";
    arr[15] = "d6";
    arr[16] = "d7";
    arr[17] = "d11";
    arr[18] = "d12";
    arr[19] = "d13";
    arr[20] = "k1";
    arr[21] = "k2";
    arr[22] = "k3";
    arr[23] = "k4";
    arr[24] = "k5";
    arr[25] = "k6";
    arr[26] = "k7";
    arr[27] = "k11";
    arr[28] = "k12";
    arr[29] = "k13";
    arr[30] = "s1";
    arr[31] = "s2";
    arr[32] = "s3";
    arr[33] = "s4";
    arr[34] = "s5";
    arr[35] = "s6";
    arr[36] = "s7";
    arr[37] = "s11";
    arr[38] = "s12";
    arr[39] = "s13";
    shuffleArray(arr);

    
    
    var obj = {};
    var temp = Array(10).fill("value");
    var cards = [temp.slice(),temp.slice(),temp.slice(),temp.slice()];
    
    obj.cards = cards.slice();
    obj.table = ["","","",""];
    obj.turn = 0;
    obj.points = [0,0];


    for(var i = 0; i<40;i++)
       obj.cards[Math.floor(i/10)][i%10] = arr[i];

    if(first_game)
    {
       await $.get("./php/game.php", { function: 'users'}, function(data){
        obj.users = JSON.parse(data).users.slice();
        obj.user_order = obj.users.slice();
      });
      for(var i = 0;i<4;i++)
      {
          obj[obj.users[i]] = 0;
      }
    }
    else
    {
        await $.get("./php/game.php", { function: 'loadturn'}, function(data){
            newdata = JSON.parse(data);
            for(var i = 0;i<3;i++)
            {
                var temp = newdata.user_order[i];
                newdata.user_order[i] = newdata.user_order[i+1];
                newdata.user_order[i+1] = temp;
            }
            obj.users = newdata.user_order.slice();
            obj.user_order = newdata.user_order.slice();
            });
    }




    var cards_json = JSON.stringify(obj);
    
    await $.get("./php/game.php", { function: 'setcards', cards: cards_json}, function(data){
        return;
        });


    for(var i = 0;i<10;i++)
    {
        cards = $("#player-bottom .card-ver");
        cards[i].src = ("assets/img/cards/" + arr[i] + ".png");
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function get_player(turn)
{
    if(turn%4==user_turn)
    {
        return "bottom";
    }
    if(turn%4==(user_turn+1)%4)
    {
        return "left";
    }
    if(turn%4==(user_turn+2)%4)
    {
        return "top";
    }
    if(turn%4==(user_turn+3)%4)
    {
        return "right";
    }
}

var played_card = false;
var played_card_sign = "";
var turn = 0;
var newdata = {};

var strenght = {k4: 0, k5: 1, k6: 2, k7: 3, k11: 4, k12: 5, k13: 6, k1: 7, k2: 8, k3: 9,
    d4: 0, d5: 1, d6: 2, d7: 3, d11: 4, d12: 5, d13: 6, d1: 7, d2: 8, d3: 9,
    b4: 0, b5: 1, b6: 2, b7: 3, b11: 4, b12: 5, b13: 6, b1: 7, b2: 8, b3: 9,
    s4: 0, s5: 1, s6: 2, s7: 3, s11: 4, s12: 5, s13: 6, s1: 7, s2: 8, s3: 9}

var points = {k4: 0, k5: 0, k6: 0, k7: 0, k11: 1, k12: 1, k13: 1, k1: 3, k2: 1, k3: 1,
    d4: 0, d5: 0, d6: 0, d7: 0, d11: 1, d12: 1, d13: 1, d1: 3, d2: 1, d3: 1,
    b4: 0, b5: 0, b6: 0, b7: 0, b11: 1, b12: 1, b13: 1, b1: 3, b2: 1, b3: 1,
    s4: 0, s5: 0, s6: 0, s7: 0, s11: 1, s12: 1, s13: 1, s1: 3, s2: 1, s3: 1}

var can_play = "";

var first_game = true;


async function simulate_player()
{
    await $.get("./php/game.php", { function: 'loadturn'}, function(data){
        newdata = JSON.parse(data);
        });
    
    newdata.table[turn%4] = newdata.cards[turn%4][Math.floor(Math.random() * 10)];
    newdata.turn++;
    await $.get("./php/game.php", { function: 'setturn', cards: JSON.stringify(newdata)}, function(data){
        });
}

async function set_points()
{
    await $.get("./php/game.php", { function: 'loadturn'}, function(data){
        newdata = JSON.parse(data);
        var p1 = newdata[newdata.user_order[0]]+newdata[newdata.user_order[2]];
        var p2 = newdata[newdata.user_order[1]]+newdata[newdata.user_order[3]];
        
        p1=Math.floor(p1/3);
        p2=Math.floor(p2/3);

        if(newdata.user_order[0] == user_id || newdata.user_order[2]==user_id)
        {
            $("#mi").html(p1);
            $("#vi").html(p2);
        }
        else
        {
            $("#mi").html(p2);
            $("#vi").html(p1);
        }

        });

}

async function play_game()
{
    while(1) {
        if(turn == 40)
        {
            for(var i = 0;i<10;i++)
            {
                $("#player-bottom").append('<img class="card-ver" src="assets/img/cards/back.png" />');
                $("#player-right").append('<img class="card-hor" src="assets/img/cards/back.png" />');
                $("#player-left").append('<img class="card-hor" src="assets/img/cards/back.png" />');
                $("#player-top").prepend('<img class="card-ver" src="assets/img/cards/back.png" />');
            }
            break;
        }
        if(turn%4 == 0)
        {
            alert(turn);
            await $.get("./php/game.php", { function: 'myturn'}, function(data){
                user_turn = parseInt(data);
            });
        }
        player_turn = get_player(turn);
        if(turn%4 !== 0)
        {
            await $.get("./php/game.php", { function: 'loadturn'}, function(data){
                newdata = JSON.parse(data);
                can_play = newdata.table[0][0];
                });
        }
        window.localStorage.setItem("player", player_turn);
        var timerId = startTimer(player_turn);
        while(1)
        {
            await sleep(300);
            if(player_turn !== "bottom")
            {
                //await simulate_player();
                await $.get("./php/game.php", { function: 'loadturn'}, function(data){
                    newdata = JSON.parse(data);
                    if(newdata.turn !== turn)
                    {
                        if(turn > newdata.turn)
                        {
                            while(turn<40)
                            {
                                playCard(player_turn, newdata.table[turn%4]);
                                turn++;
                                player_turn = get_player(turn);
                            }
                        }
                        while(turn!==newdata.turn)
                        {
                            playCard(player_turn, newdata.table[turn%4]);
                            turn++;
                            //player_turn = get_player(turn);
                            played_card = true;
                        }
                    }
                    });
                if(played_card)
                {
                    stopTimer(player_turn, timerId);
                    played_card = false;
                    break;
                }
            }
            else
            {
                if(played_card)
                {
                    await $.get("./php/game.php", { function: 'loadturn'}, function(data){
                        newdata = JSON.parse(data);
                        });
                    newdata.table[turn%4] = played_card_sign;
                    newdata.turn++;
                    if(newdata.turn%4 == 0)
                    {
                        var best = newdata.table[0];
                        var win = 0;
                        var new_points = points[best];
                        for(var  i = 1;i<4;i++)
                        {
                            if(best[0] == newdata.table[i][0] && strenght[best] < strenght[newdata.table[i]])
                            {
                                best = newdata.table[i];
                                win = i;
                            }
                            new_points += points[newdata.table[i]];
                        }
                        newdata[newdata.users[win]] += new_points;
                        for(var i = 0;i<win;i++)
                            for(var j = 0;j<3;j++)
                            {
                                var temp = newdata.users[j];
                                newdata.users[j] = newdata.users[j+1];
                                newdata.users[j+1] = temp;
                            }
                    }
                    await $.get("./php/game.php", { function: 'setturn', cards: JSON.stringify(newdata)}, function(data){
                        });
                    
                    turn++;
                    played_card = false;
                    stopTimer(player_turn, timerId);
                    break;
                }
            }
        }
        if(turn%4 === 0)
        {
            ////////////////////////////
            /*await $.get("./php/game.php", { function: 'loadturn'}, function(data){
                newdata = JSON.parse(data);
                });


                var best = newdata.table[0];
                var win = 0;
                var new_points = points[best];
                for(var  i = 1;i<4;i++)
                {
                    if(best[0] == newdata.table[i][0] && strenght[best] < strenght[newdata.table[i]])
                    {
                        best = newdata.table[i];
                        win = i;
                    }
                    new_points += points[newdata.table[i]];
                }
                newdata[newdata.users[win]] += new_points;
                for(var i = 0;i<win;i++)
                    for(var j = 0;j<3;j++)
                    {
                        var temp = newdata.users[j];
                        newdata.users[j] = newdata.users[j+1];
                        newdata.users[j+1] = temp;
                    }
                    await $.get("./php/game.php", { function: 'setturn', cards: JSON.stringify(newdata)}, function(data){
                    });*/
            ////////////////////////////////////
            
            await sleep(1000);
            clearStack();
        }
    }
    return;
}

var game_over =false;


var poruka = "";

async function is_end()
{
    await $.get("./php/game.php", { function: 'loadturn'}, async function(data){
        newdata = JSON.parse(data);
        var p1 = newdata[newdata.user_order[0]]+newdata[newdata.user_order[2]];
        var p2 = newdata[newdata.user_order[1]]+newdata[newdata.user_order[3]];

        p1=Math.floor(p1/3);
        p2=Math.floor(p2/3);
        newdata[newdata.user_order[0]] = p1;
        newdata[newdata.user_order[1]] = p2;
        newdata[newdata.user_order[2]] = 0;
        newdata[newdata.user_order[3]] = 0;
        await $.get("./php/game.php", { function: 'setturn', cards: JSON.stringify(newdata)}, function(data){
        });

        if(p1>40 || p2>40)
        {
            if(p1>p2)
            {
                if(newdata.user_order[0] == user_id || newdata.user_order[2]==user_id)
                {
                    poruka = "<p>Pobjedili ste!</p><p>" + p1 + " : "+ p2+"</p>";
                }
                else
                {
                    poruka = "<p>Izgubili ste!</p><p>" + p2 + " : "+ p1+"</p>";
                }
            }
            else
            {
                if(newdata.user_order[0] == user_id || newdata.user_order[2]==user_id)
                {
                    poruka = "<p>Izgubili ste!</p><p>" + p1 + " : "+ p2+"</p>";
                }
                else
                {
                    poruka = "<p>Pobjedili ste!</p><p>" + p2 + " : "+ p1+"</p>";
                }
            }
            game_over = true;
        }
        });
}

async function send_data()
{
    user_id = parseInt(getCookie("login_id"));
    var room_id = parseInt(getCookie("room_id"));

    await $.get("./php/game.php", { function: 'set_session', user: user_id, room: room_id}, function(data){
      });
}

var you_cant_start_game = true;

async function wait_start()
{
    await sleep(1000);

    await $.get("./php/game.php", { function: 'wait'}, function(data){
        us = JSON.parse(data);
        if(us.users.length == 4)
        {
            you_cant_start_game = false;
            for(var i = 0;i<4;i++)
                if(user_id == us.users[i])
                {
                    user_turn = i;
                }
        }
      });
}

async function start_treseta()
{
    /*await send_data();
    while(you_cant_start_game)
    {
        await wait_start();
    }

    //$.get("./php/database/create_tables.php", { cards: myJSON});


   // await get_user_id();
    if(user_turn == 0)
    {
        await set_game();
    }
    else
    {
        await set_cards();
    }

    first_game = false;

    await play_game();


    while(1)
    {
        await is_end();
        await set_points();
        if(game_over)
            break;
        
        await get_user_turn();
        if(user_turn == 0)
        {
            await set_game();
        }
        else
        {
            await set_cards();
        }
    }*/
    poruka+= '<button id="exitnow" value ="Exit"> Exit </button>';
    
    $("#exitnow").click(function() { 
        alert(12);
        $.get("./php/game.php", { function: 'exit'}, function(data){
            $("#login_id").val(getCookie("login_id"));
            $("#room_id").val(getCookie("room_id"));
            $("#game_form").submit();
        });
    });
    $("#stack").html("").append(poruka);
}

$(document).ready(function() {
    $("#player-bottom .card-ver").click(function(){
        if(window.localStorage.getItem("player") == "bottom") {
            if(played_card)
                return;
            played_card_sign = $(this).attr("src");
            if(played_card_sign[played_card_sign.length-7] == '/')
                played_card_sign = played_card_sign.substring(played_card_sign.length-6,played_card_sign.length-4);
            else
                played_card_sign = played_card_sign.substring(played_card_sign.length-7,played_card_sign.length-4);
            if(turn%4 !== 0 && can_play !== played_card_sign[0])
            {
                cards = $("#player-bottom  .card-ver");
                var i = 0;
                for(;i<cards.length;i++)
                {
                    var temp = cards[i].src;
                    if(temp[temp.length-7] == '/')
                        temp = temp.substring(temp.length-6,temp.length-4);
                    else
                        temp = temp.substring(temp.length-7,temp.length-4);
                    if(temp[0] == can_play)
                        break;
                }
                if(i!==cards.length)
                    return;
            }
            
            $("#card-play-bottom").attr("src", $(this).attr("src"));
            played_card = true;
            $(this).remove();
        }
    });

    // setInterval(function(){ getGameStatus(); }, 500);


    start_treseta();
});
