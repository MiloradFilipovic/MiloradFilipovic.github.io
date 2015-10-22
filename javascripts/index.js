var current_planet_scale = 1;
var max_planet_scale = 3;
var planet_scale_step = .2;
var planet_scale_step_count = (max_planet_scale - 1) / planet_scale_step;

var current_cloud_alpha = 1;
var cloud_alpha_step = 1 / planet_scale_step_count;

var current_continent_alpha = 0;
var continent_alpha_step = 1 / planet_scale_step_count;

var scaling = false;

$(document).ready(function(e) {

    var main_container = $(".main_container");
    var planet = $(".planet");
    var info_div = $(".info");

    if ('ontouchmove' in document.documentElement) {
      $('.gesture_test span').text('Yes');
    }else {
        $('.gesture_test span').text('No');
    }

    // Ovde uzmem originalnu udaljenost i gledam na touchmove da li se smanjuje ili povecava
    $(window).on("touchstart", function(ev) {
        var e = ev.originalEvent;

        if(e.touches.length == 2) {
            scaling = true;
            $('.gesture_label span').text('<' +  e.touches[0].x);
        }
    });

    $(window).on("touchmove", function(ev) {
        var e = ev.originalEvent;
        if(scaling) {
            var dist =
                Math.sqrt(
                    (e.touches[0].x-e.touches[1].x) * (e.touches[0].x-e.touches[1].x) +
                    (e.touches[0].y-e.touches[1].y) * (e.touches[0].y-e.touches[1].y));
        }
    });

    $(window).on("touchend", function(ev) {
        var e = ev.originalEvent;
        if(scaling) {
            scalling = false;
        }
    });


    $(window).bind('mousewheel DOMMouseScroll', function(event){
        // Mouse wheel up
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // Zoom the planet up to 4X
            if(current_planet_scale <= max_planet_scale) {
                planet.css({
                    '-moz-transform': 'scale('+ current_planet_scale + ')', 
                    '-webkit-transform': 'scale('+ current_planet_scale + ')',
                    '-o-transform': 'scale('+ current_planet_scale + ')'
                });
                if(current_cloud_alpha > 0) {
                    current_cloud_alpha -= cloud_alpha_step;
                    $(".cloud").css("opacity", current_cloud_alpha);
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

                planet.css({
                    '-moz-transform': 'scale('+ current_planet_scale + ')', 
                    '-webkit-transform': 'scale('+ current_planet_scale + ')',
                    '-o-transform': 'scale('+ current_planet_scale + ')'
                });
                if(current_cloud_alpha < 1) {
                    current_cloud_alpha += cloud_alpha_step;
                    $(".cloud").css("opacity", current_cloud_alpha);
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
                $('.screen').fadeIn().addClass('blinking');
            }else if($(this).hasClass('about')) {
                $('.beam').removeClass('blinking_beam');
            }
        }
    }, function(e) {
        var activates = $(this).attr('data-activates');
        $('.' + activates).stop().fadeOut();
        $('.screen').hide().fadeOut('blinking');
        $('.beam').addClass('blinking_beam');
    });

});