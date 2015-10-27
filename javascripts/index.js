var current_planet_scale = 1;
var max_planet_scale = 3;
var planet_scale_step = .2;
var planet_scale_step_count = (max_planet_scale - 1) / planet_scale_step;

var current_cloud_alpha = 1;
var cloud_alpha_step = 1 / planet_scale_step_count;

var current_continent_alpha = 0;
var continent_alpha_step = 1 / planet_scale_step_count;

var scaling = false;
var current_finger_distance = 0;

$(document).ready(function(e) {

    var main_container = $(".main_container");
    var planet = $(".planet");
    var info_div = $(".info");

    // If touch events are supported, activate gesture scripts
    if ('ontouchstart' in document.documentElement) {
        $('.gesture_label').show();

        // Ovde uzmem originalnu udaljenost i gledam na touchmove da li se smanjuje ili povecava
        $(window).on("touchstart", function(ev) {
            var e = ev.originalEvent;
            if(e.touches.length == 2) {
                scaling = true;
                var dist = get_distance(e);
                current_finger_distance = dist;
            }
        });

        $(window).on("touchmove", function(ev) {
            var e = ev.originalEvent;
            if(scaling) {
                var dist = get_distance(e);
                // if(dist > current_finger_distance) {
                //     $('.gesture_label span').text("Zooming IN");
                // }else {
                //     $('.gesture_label span').text("Zooming OUT");
                // }
                $('.gesture_label span').text(dist + "[ " + current_finger_distance + "]");
                current_finger_distance = dist;
            }
        });

        $(window).on("touchend", function(ev) {
            var e = ev.originalEvent;
            if(scaling) {
                var dist = get_distance(e);
                scalling = false;
                current_finger_distance = dist;
            }
        });
    }

    $(window).bind('mousewheel DOMMouseScroll', function(event){
        // Mouse wheel up
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // Zoom the planet up to 4X
            if(current_planet_scale <= max_planet_scale) {
                scale(planet, current_planet_scale);
                scale(info_div, current_planet_scale);
                if(current_cloud_alpha > 0) {
                    current_cloud_alpha -= cloud_alpha_step;
                    $(".cloud").css("opacity", current_cloud_alpha);
                    info_div.css("opacity", current_cloud_alpha);
                }
                if(current_continent_alpha < 1) {
                    current_continent_alpha += continent_alpha_step;
                    $(".continent").css("opacity", current_continent_alpha);
                }
                current_planet_scale += planet_scale_step;
            }
        }else { // Mouse wheel down
            // Zoom out down to original size
            if(current_planet_scale >= 1) {
                scale(planet, current_planet_scale);
                scale(info_div, current_planet_scale);
                if(current_cloud_alpha < 1) {
                    current_cloud_alpha += cloud_alpha_step;
                    $(".cloud").css("opacity", current_cloud_alpha);
                    info_div.css("opacity", current_cloud_alpha);
                }

                if(current_continent_alpha >= 0) {
                    current_continent_alpha -= continent_alpha_step;
                    $(".continent").css("opacity", current_continent_alpha);
                }
                current_planet_scale -= planet_scale_step;
            }
        }
    });

    // CONTINENT HOVER
    $('.continent').hover(function(e) {
        if($(this).css('opacity') == 1) {
            var activates = $(this).attr('data-activates');
            $('.' + activates).stop().fadeIn();
            if($(this).hasClass('game')) {
                $('.screens').fadeIn().addClass('blinking');
                $('.screen1').fadeIn().addClass('s1_ani');
                $('.screen2').fadeIn().addClass('s2_ani');
                $('.screen3').fadeIn().addClass('s3_ani');
            }else if($(this).hasClass('about')) {
                $('.beam').removeClass('blinking_beam');
            }
        }
    }, function(e) {
        var activates = $(this).attr('data-activates');
        $('.' + activates).stop().fadeOut();
        $('.screens').hide().removeClass('blinking');
        $('.screen1').hide().removeClass('s1_ani');
        $('.screen2').hide().removeClass('s2_ani');
        $('.screen3').hide().removeClass('s3_ani');
        $('.beam').addClass('blinking_beam');
    });

});

function scale(element, value) {
    element.css({
        '-moz-transform': 'scale('+ current_planet_scale + ')', 
        '-webkit-transform': 'scale('+ current_planet_scale + ')',
        '-o-transform': 'scale('+ current_planet_scale + ')'
    });
}

function get_distance(e) {
    var dist =
        Math.sqrt(
            (e.touches[0].pageX-e.touches[1].pageX) * (e.touches[0].pageX-e.touches[1].pageX) +
            (e.touches[0].pageY-e.touches[1].pageY) * (e.touches[0].pageY-e.touches[1].pageY));
    return dist;
}