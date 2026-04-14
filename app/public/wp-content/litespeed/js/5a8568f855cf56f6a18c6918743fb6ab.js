if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:!0})}else{console.error('GSAP oder ScrollTrigger ist nicht verfügbar.')}
let refreshDebounceTimer=null;function refreshScrollTriggers(){if(typeof ScrollTrigger==='undefined'){return}
clearTimeout(refreshDebounceTimer);refreshDebounceTimer=setTimeout(function(){ScrollTrigger.refresh()},200)}
function initParallax(){if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'){return}
gsap.utils.toArray('.parallax').forEach((element)=>{const viewportWidth=window.innerWidth||document.documentElement.clientWidth;let speed=Number(element.getAttribute('data-speed'))||125;if(viewportWidth<768){speed=speed*0.5}
gsap.to(element,{y:-speed,ease:'none',scrollTrigger:{trigger:element,start:'top bottom',end:'bottom top',scrub:0.5,invalidateOnRefresh:!0,markers:!1}})});const bellaVistaElement=document.querySelector('svg#Ebene_1');if(bellaVistaElement){gsap.fromTo(bellaVistaElement,{scale:0.95},{scale:1,ease:'none',scrollTrigger:{trigger:bellaVistaElement,start:'top bottom',end:'top center',scrub:!0,invalidateOnRefresh:!0,markers:!1}})}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(refreshScrollTriggers)}
document.querySelectorAll('img').forEach((img)=>{if(!img.complete){img.addEventListener('load',refreshScrollTriggers,{once:!0});img.addEventListener('error',refreshScrollTriggers,{once:!0})}})}
document.addEventListener('DOMContentLoaded',initParallax)
;