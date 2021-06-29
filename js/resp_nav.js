const menuToggle = document.querySelector('.menu-toggle input');
const nav = document.querySelector('nav .resp');

menuToggle.addEventListener('click', function(){
    nav.classList.toggle('slide');
});