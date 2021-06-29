const scrolltop = document.querySelector("#toTop");
scrolltop.addEventListener("click", function(){
    window.scrollTo({
        top: 0,
        left : 0,
        behavior: "smooth",
    });
});