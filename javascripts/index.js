// Cached references to main elements on the page
let main_container = document.getElementById('main_container');
let planet = document.getElementById('planet');
let info_div = document.getElementById('info');
let clouds = document.querySelectorAll('.cloud') || [];
let continents = document.querySelectorAll('.continent') || [];

// Scale animation values and calculations
let current_planet_scale = 1;
let max_planet_scale = 3;
let planet_scale_step = .2;
let planet_scale_step_count = (max_planet_scale - 1) / planet_scale_step;

let current_cloud_alpha = 1;
let cloud_alpha_step = 1 / planet_scale_step_count;

let current_continent_alpha = 0;
let continent_alpha_step = 1 / planet_scale_step_count;

let scaling = false;

let current_info_top = info_div.offsetTop;
let current_info_left = info_div.offsetLeft;
let final_info_top = -62;
let final_info_left = -335;
let info_top_steps = current_info_top - final_info_top;
let info_left_steps = current_info_left - final_info_left;
let info_top_step = info_top_steps / planet_scale_step_count;
let info_left_step = info_left_steps / planet_scale_step_count;

// particles.js init
particlesJS.load('particles-js', 'config/particlesjs-config.json');

// If touch events are supported, activate gesture scripts
if ('ontouchstart' in document.documentElement) {
    console.log('Touch controls are not currently supported.');
}else {
    let ticking = false;
    // Main window scroll event. Detects scroll direction
    // and triggers animations based on it
    window.addEventListener('wheel', function(event) {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if(event.deltaY > 0) {
                    zoomOut();
                }else {
                    zoomIn();
                }
                ticking = false;
            });
        }
        ticking = true;
    });
}

// Zoom the planet up to specified max scale
function zoomIn() {
    if(current_planet_scale <= max_planet_scale) {
        planet.style.transform = `scale(${current_planet_scale})`;
        if(current_cloud_alpha > 0) {
            current_cloud_alpha -= cloud_alpha_step;
            for(let cloud of clouds || []) {
                cloud.style.opacity = current_cloud_alpha;
            }
            info_div.style.opacity = current_cloud_alpha;
        }
        if(current_cloud_alpha < 1) {
            current_continent_alpha += continent_alpha_step;
            // TODO: Cache this and clouds
            for(let continent of continents || []) {
                continent.style.opacity = current_continent_alpha;
            }
        }
        info_div.style.opacity = current_cloud_alpha;
        current_planet_scale += planet_scale_step;
    }
}

// Zoom the planet down to it's original size
function zoomOut() {
    if(current_planet_scale >= 1) {
        planet.style.transform = `scale(${current_planet_scale})`;
        if(current_cloud_alpha < 1) {
            current_cloud_alpha += cloud_alpha_step;
            for(let cloud of clouds || []) {
                cloud.style.opacity = current_cloud_alpha;
            }
            info_div.style.opacity = current_cloud_alpha;
        }
        if(current_cloud_alpha >= 0) {
            current_continent_alpha -= continent_alpha_step;
            for(let continent of continents || []) {
                continent.style.opacity = current_continent_alpha;
            }
        }
        info_div.style.opacity = current_cloud_alpha;
        current_planet_scale -= planet_scale_step;
    }
}