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
    progress = 0;
    return setInterval(function() {
        if (progress < 100) {
            progress += 5;
            bar.css(progress_attr, progress + "%");
        }
    }, 500);
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
    bar.css(progress_attr, "0%");
}

function playCard(player) {
    orientation = getCardOrientation(player);
    cards = $("#player-" + player + " .card-" + orientation);
    stackSize = 4 - $(".stack-card[src='']").length;

    if(cards.length > 0) {
        card = cards[0];
        card.remove();
        $("#card-play-" + player).attr("src", $(card).attr("src"));
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

$(document).ready(function() {
    $("#player-bottom .card-ver").click(function(){
        if(window.localStorage.getItem("player") == "bottom") {
            $("#card-play-bottom").attr("src", $(this).attr("src"));
            $(this).remove();
        }
    });

    // setInterval(function(){ getGameStatus(); }, 500);

    simulateGame();
});
