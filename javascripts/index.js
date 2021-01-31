// Cached references to main elements on the page
let main_container = document.getElementById('main_container');
let planet = document.getElementById('planet');
let info_div = document.getElementById('info');
let clouds = document.querySelectorAll('.cloud') || [];
let continents = document.querySelectorAll('.continent') || [];
let arcade_screen = document.getElementById('screens');
let screen_frame_1 = document.getElementById('screen1');
let screen_frame_2 = document.getElementById('screen2');
let screen_frame_3 = document.getElementById('screen3');
let tower_beam = document.getElementById('beam');
let aboutme_div = document.getElementById('about_info');

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

// Continent hover
for(let continent of continents) {
    continent.addEventListener('mouseover', function(event) {
        if(continent.style.opacity === '1') {
            // Find the description that needs to be shown and display it
            let activates = continent.getAttribute('data-activates');
            document.getElementById(activates).style.display = 'block';
            // Activate the arcade screen animation
            if(continent.classList.contains('game')) {
                activateScreenBlinking(); 
            }else if(continent.classList.contains('about')) {
                tower_beam.classList.remove('blinking_beam');
            }
        }
    });
    continent.addEventListener('mouseout', function(event) {
        let activates = continent.getAttribute('data-activates');
        let activatesEl = document.getElementById(activates);
        if(!activatesEl.classList.contains('user-hovered')) {
            activatesEl.style.display = 'none';
        }else {
            activatesEl.classList.remove('user-hovered');
        }
        // Activate the arcade screen animation
        if(continent.classList.contains('game')) {
            deactivateScreenBlinking(); 
        }else if(continent.classList.contains('about')) {
            tower_beam.classList.add('blinking_beam');
        }
    });
}

aboutme_div.addEventListener('mouseover', function(event) {
    aboutme_div.style.display = 'block';
    aboutme_div.classList.add('user-hovered');
});
aboutme_div.addEventListener('mouseout', function(event) {
    aboutme_div.style.display = 'none';
});

function activateScreenBlinking() {
    arcade_screen.style.display = 'block'
    arcade_screen.classList.add('blinking');
    screen_frame_1.style.display = 'block';
    screen_frame_1.classList.add('s1_ani');
    screen_frame_2.style.display = 'block';
    screen_frame_2.classList.add('s2_ani');
    screen_frame_3.style.display = 'block';
    screen_frame_3.classList.add('s3_ani');
}

function deactivateScreenBlinking() {
    arcade_screen.style.display = 'none'
    arcade_screen.classList.remove('blinking');
    screen_frame_1.style.display = 'none';
    screen_frame_1.classList.remove('s1_ani');
    screen_frame_2.style.display = 'none';
    screen_frame_2.classList.remove('s2_ani');
    screen_frame_3.style.display = 'none';
    screen_frame_3.classList.remove('s3_ani');
}