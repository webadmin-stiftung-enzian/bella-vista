(function(){const navElement=document.querySelector('div.wp-block-group:has(>nav)');const mobileWrapper=navElement?navElement.querySelector('nav.nav-mobile'):null;const mobileMenuList=mobileWrapper?mobileWrapper.querySelector('ul.wp-block-navigation__container'):null;const mobileButtonsContainer=navElement?Array.from(navElement.children).find((child)=>child.classList&&child.classList.contains('wp-block-buttons')):null;if(!navElement){console.warn('Navigation element not found');return}
let mobileToggleButton=null;function isMobileMenuOpen(){return!!(mobileWrapper&&mobileWrapper.classList.contains('is-open'))}
function showNav(){if(!navElement.classList.contains('nav-visible')){console.log('[nav] showNav')}
navElement.classList.remove('nav-hidden');navElement.classList.add('nav-visible')}
function hideNav(){if(!navElement.classList.contains('nav-hidden')){console.log('[nav] hideNav')}
navElement.classList.remove('nav-visible');navElement.classList.add('nav-hidden')}
function setMobileMenuOpen(isOpen){if(!mobileWrapper||!mobileToggleButton){return}
mobileWrapper.classList.toggle('is-open',isOpen);mobileToggleButton.setAttribute('aria-expanded',isOpen?'true':'false');mobileToggleButton.setAttribute('aria-label',isOpen?'Menü schließen':'Menü öffnen');if(isOpen){showNav()}}
function ensureMobileToggleButton(){if(!mobileWrapper||!mobileMenuList||!mobileButtonsContainer){return null}
mobileWrapper.classList.add('has-toggle');let button=mobileWrapper.querySelector('button.nav-toggle');if(button){return button}
const buttonWrapper=document.createElement('div');buttonWrapper.className='wp-block-button';button=document.createElement('button');button.type='button';button.className='nav-toggle';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','mobile-nav-list');button.setAttribute('aria-label','Menü öffnen');buttonWrapper.appendChild(button);mobileButtonsContainer.appendChild(buttonWrapper);mobileMenuList.id=mobileMenuList.id||'mobile-nav-list';return button}
let isUserScrolling=!1;let userScrollTimer=null;const userScrollTimeout=200;function markUserScrolling(){isUserScrolling=!0;clearTimeout(userScrollTimer);userScrollTimer=setTimeout(function(){isUserScrolling=!1},userScrollTimeout)}
window.addEventListener('wheel',markUserScrolling,{passive:!0});window.addEventListener('touchstart',markUserScrolling,{passive:!0});window.addEventListener('touchmove',markUserScrolling,{passive:!0});window.addEventListener('scroll',markUserScrolling,{passive:!0});window.addEventListener('keydown',function(e){var scrollKeys=['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];if(scrollKeys.indexOf(e.key)!==-1){markUserScrolling()}},{passive:!0});const topThreshold=100;const velocityThreshold=50;function initScrollNavigation(){if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'){initFallbackScroll();return}
gsap.registerPlugin(ScrollTrigger);ScrollTrigger.create({start:0,end:'max',onUpdate:function(self){if(isMobileMenuOpen()){return}
if(self.scroll()<topThreshold){showNav();return}
if(window.__smoothScrollActive){return}
if(!isUserScrolling){return}
var velocity=self.getVelocity();if(velocity<-velocityThreshold){console.log('[nav] onUpdate → showNav | velocity:',Math.round(velocity),'| scroll:',Math.round(self.scroll()),'| isUserScrolling:',isUserScrolling);showNav()}else if(velocity>velocityThreshold){console.log('[nav] onUpdate → hideNav | velocity:',Math.round(velocity),'| scroll:',Math.round(self.scroll()),'| isUserScrolling:',isUserScrolling);hideNav()}}})}
function initFallbackScroll(){var lastScrollY=window.scrollY;var ticking=!1;var scrollThreshold=10;function updateNavigation(){var currentScrollY=window.scrollY;var scrollDifference=currentScrollY-lastScrollY;lastScrollY=currentScrollY;ticking=!1;if(isMobileMenuOpen()){return}
if(!isUserScrolling){return}
if(Math.abs(scrollDifference)<scrollThreshold){return}
if(currentScrollY<topThreshold){showNav()}else if(scrollDifference>0){hideNav()}else{showNav()}}
window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(updateNavigation);ticking=!0}},{passive:!0})}
mobileToggleButton=ensureMobileToggleButton();if(mobileToggleButton){mobileToggleButton.addEventListener('click',function(){setMobileMenuOpen(!isMobileMenuOpen())});document.addEventListener('click',function(e){if(!isMobileMenuOpen()){return}
if(mobileWrapper.contains(e.target)){return}
if(mobileButtonsContainer&&mobileButtonsContainer.contains(e.target)){return}
setMobileMenuOpen(!1)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isMobileMenuOpen()){setMobileMenuOpen(!1)}});if(mobileMenuList){mobileMenuList.querySelectorAll('a').forEach(function(link){link.addEventListener('click',function(){setMobileMenuOpen(!1)})})}
window.addEventListener('resize',function(){if(!window.matchMedia('(max-width: 900px)').matches&&isMobileMenuOpen()){setMobileMenuOpen(!1)}})}
showNav();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initScrollNavigation)}else{initScrollNavigation()}})()
;