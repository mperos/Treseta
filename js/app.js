$(document).ready(function() {
    $("#player-bottom .card-ver").click(function(){
        // Call for backend
        // If move valid then
        $("#card-play-bottom").attr("src", $(this).attr("src"));
        $(this).remove();
        // Else
        // Display some error message
    });

    function runTimer() {
        var elem = document.getElementsByClassName("timer-hor")[0];
        var elem = document.getElementsByClassName("bar-hor")[0];
        var width = 0;
        var id = setInterval(function() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width += 10;
                elem.style.width = width + "%";
            }
        }, 1000);
    }

    runTimer();
});
