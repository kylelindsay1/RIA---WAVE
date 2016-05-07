/* Robin Savemark */

window.addEventListener("load", init, function load(e) {
    window.removeEventListener("load", load, false);
}, false);

function init() {
    try {
        scPlayer();
        loader();
    } catch(e) {
        console.log(e);
    }
}

function loader() {
    var loader = $(".spinner");
    return loader;
}

function scPlayer() {
    var player  =  SC.Widget($("iframe.sc-widget")[0]),
        playerHolder = $("#player"),
        pOffset = $(".player-info-progress").offset(),
        pWidth = $(".player-info-progress").width(),
        scrub;

    player.bind(SC.Widget.Events.READY, function (eventData) { setInfo(); }); // Set info on load
    player.bind(SC.Widget.Events.PLAY_PROGRESS, function (e) {
    if (e.relativePosition < 0.003 ) { setInfo(); }
        // Event listener when track is playing
        $(".player-info-progress-bar").css("width", ( e.relativePosition * 100) + "%");

    if (!$(".play > i").hasClass("glyphicon-pause")) {
      $(".play > i")
          .removeClass("glyphicon-play")
          .addClass("glyphicon-pause"); 
    }
    });

    player.bind(SC.Widget.Events.PAUSE, function (e) {   // Event listener when track is paused
      setInfo();
      $(".play > i")
        .addClass("glyphicon-play")
        .removeClass("glyphicon-pause");  
    });

    $(".player-info-progress").on("mousemove", function (e) { // Get position of mouse for scrubbing
      scrub = (e.pageX - pOffset.left);
    });

    $(".player-info-progress").on("click", function (){ // Use the position to seek when clicked
        $(".player-info-progress-bar").css("width", scrub + "px");
        var seek = player.duration * (scrub / pWidth);
        player.seekTo(seek);
    });

    //Buttons
    $("[data-play]").click(function(){ player.toggle(); });    
    $("[data-backward]").click(function(){ player.prev(); });  
    $("[data-forward]").click(function(){ player.next(); });

    function setInfo() {
        player.getCurrentSound(function(song) {
        if(!song) {
            $(".player-info-art").css("background-image", "");
            $(".player-info-artist").html("");
            $(".player-info-title").html("Oh, snap!");
            return;
        }

            loader().hide();
            playerHolder.show();

            $(".player-info-art").css("background-image", "url('" + song.artwork_url.replace('-normal', '-t250x250') + "')");
            $(".player-info-artist").html(song.user.username);
            $(".player-info-title").html(song.title);
            player.current = song;
        });
    
        player.getDuration(function(value){
            player.duration = value;
        });

        player.isPaused(function(bool){
          player.getPaused = bool;
        });
    }     
}