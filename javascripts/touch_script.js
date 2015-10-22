// Ovde uzmem originalnu udaljenost i gledam na touchmove da li se smanjuje ili povecava
$(window).on("touchstart", function(ev) {
    var e = ev.originalEvent;

    if(e.touches.length == 2) {
        scaling = true;
    }
});

$(window).on("touchmove", function(ev) {
    var e = ev.originalEvent;
    if(scaling) {
        var dist =
            Math.sqrt(
                (e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) +
                (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));
            $('.gesture_label span').text(dist);
    }
});

$(window).on("touchend", function(ev) {
    var e = ev.originalEvent;
    if(scaling) {
        scalling = false;
    }
});