const menuToggle = document.querySelector('.menu-toggle input');
const nav = document.querySelector('nav ul');

menuToggle.addEventListener('click', function(){
    nav.classList.toggle('slide');
});

const scroll = document.querySelector('#navli');
scroll.addEventListener("click", function(){
    window.scrollTo({
        behavior: "smooth",
    });
});