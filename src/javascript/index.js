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
let continent_infos = document.querySelectorAll('.continent_info') || [];

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
let ticking = false;

let current_info_top = info_div.offsetTop;
let current_info_left = info_div.offsetLeft;
let final_info_top = -62;
let final_info_left = -335;
let info_top_steps = current_info_top - final_info_top;
let info_left_steps = current_info_left - final_info_left;
let info_top_step = info_top_steps / planet_scale_step_count;
let info_left_step = info_left_steps / planet_scale_step_count;

// Touch events data
let touching = false;
var evCache = new Array();
var prevDiff = -1;

// particles.js init
particlesJS.load('particles-js', 'config/particlesjs-config.json');

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

// Zoom the planet up to specified max scale
function zoomIn() {
    if(current_planet_scale <= max_planet_scale) {
        planet.style.transform = `scale(${current_planet_scale})`;
        if(current_cloud_alpha > 0) {
            current_cloud_alpha -= cloud_alpha_step;
            for(let cloud of clouds) {
                cloud.style.opacity = current_cloud_alpha;
            }
            info_div.style.opacity = current_cloud_alpha;
        }
        if(current_cloud_alpha < 1) {
            current_continent_alpha += continent_alpha_step;
            for(let continent of continents) {
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
            for(let cloud of clouds) {
                cloud.style.opacity = current_cloud_alpha;
            }
            info_div.style.opacity = current_cloud_alpha;
        }
        if(current_cloud_alpha >= 0) {
            current_continent_alpha -= continent_alpha_step;
            for(let continent of continents) {
                continent.style.opacity = current_continent_alpha;
            }
        }
        info_div.style.opacity = current_cloud_alpha;
        current_planet_scale -= planet_scale_step;

        for(let infoDiv of continent_infos) {
            infoDiv.style.display = 'none';
        }
    }
}

// Continent hover
for(let continent of continents) {
    continent.addEventListener('mouseover', function(event) {
        if(continent.style.opacity === '1') {
            // Find the description that needs to be shown and display it
            let activates = continent.getAttribute('data-activates');
            if(activates) {
                // Set popup element position based on the hovered continent position
                let activatesEl = document.getElementById(activates);

                setPosition(continent, activatesEl);
                activatesEl.style.display = 'block';
                // Activate the arcade screen animation
                if(continent.classList.contains('game')) {
                    activateScreenBlinking(); 
                }else if(continent.classList.contains('about')) {
                    tower_beam.classList.remove('blinking_beam');
                }
            }
        }
    });
    continent.addEventListener('mouseout', function(event) {
        let activates = continent.getAttribute('data-activates');
        if(activates) {
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

// Sets the position of popup element based on it's data attribute and it's related continent position
function setPosition(continent, popup) {
    let popupPosition = popup.getAttribute('data-position');
    let continentRect = continent.getBoundingClientRect();

    if(popupPosition === 'top-left') {
        popup.style.top = continentRect.top - 20 + 'px';
        popup.style.left = continentRect.left - 100 + 'px';
    }else if(popupPosition === 'top-right') {
        popup.style.top = continentRect.top - 50 + 'px';
        popup.style.left = continentRect.right + 'px';
    }else if(popupPosition === 'bottom-left') {
        popup.style.top = continentRect.bottom - 70 + 'px';
        popup.style.left = continentRect.left - 350 + 'px';
    }else if(popupPosition === 'bottom-right') {
        popup.style.top = continentRect.bottom - 50 + 'px';
        popup.style.left = continentRect.right - 20 + 'px';
    }
}


function onPointerDown(event) {
    evCache.push(event);
    if(evCache.length > 1) {
        touching = true;
    }
}

function onPointerMove(event) {
    for (let i = 0; i < evCache.length; i++) {
        if(event.pointerId === evCache[i].pointerId) {
            evCache[i] = event;
            break;
        }
    }
    
    if(evCache.length === 2) {
        var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
        
        if(prevDiff > 0) {
            if(curDiff > prevDiff) {
                zoomIn();
            }
        }
        if(curDiff < prevDiff) {
            zoomOut();
        }
    }
    prevDiff = curDiff;
}

function onPointerUp(event) {
    removeEvent(event);
    if(evCache.length < 2) {
        prevDiff = -1;
    }
    if(current_planet_scale >= 3) {
        for(let continent of continents) {
            continent.addEventListener('click', function(e) {
                if(touching) {
                    e.preventDefault();
                    let activates = continent.getAttribute('data-activates');
                    if(activates) {
                        // Set popup element position based on the hovered continent position
                        let activatesEl = document.getElementById(activates);
                        if(activatesEl.style.display === 'none') {
                            activatesEl.style.display = 'block';
                            // Activate the arcade screen animation
                            if(continent.classList.contains('game')) {
                                activateScreenBlinking(); 
                            }else if(continent.classList.contains('about')) {
                                tower_beam.classList.remove('blinking_beam');
                            }
                        }
                    }
                }
            })
        }
    }
}

document.body.onpointerdown = onPointerDown;
document.body.onpointermove = onPointerMove;
document.body.onpointerup = onPointerUp;
document.body.onpointercancel = onPointerUp;
document.body.onpointerout = onPointerUp;
document.body.onpointerleave = onPointerUp;


for(let infoDiv of continent_infos) {
    infoDiv.addEventListener('click', function(event) {
        if(touching) {
            let tapLink = infoDiv.getAttribute('data-tap-link');
            if(tapLink) {
                event.stopPropagation;
                Object.assign(document.createElement('a'), {
                    target: '_blank',
                    href: tapLink,
                }).click();
            }
        };
    })
}

function removeEvent(event) {
    for(let i=0; i<evCache.length; i++) {
        if(evCache[i].pointerId === event.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}

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