// SHOW BOTTOM NAVIGATION MENU
var bottomNav = document.querySelector('#mobileNav');

window.addEventListener('scroll', function() {
  if(window.pageYOffset > 200) {
    bottomNav.style.transform = 'translateX(0)';
  } else {
    bottomNav.style.transform = 'translateX(200%)';
  }
});

// SCROLL TO ELEMENT
var el = document.querySelectorAll('nav a');

for (var i = 0; i < el.length; i++) {

  el[i].addEventListener('click', function(e) {
    e.preventDefault();

    var element = e.srcElement.getAttribute('href');
    var target = document.querySelector(element);

    target.scrollIntoView({
      behavior: 'smooth'
    });
  })
}
