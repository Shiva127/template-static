const navbarBurgers = document.querySelector('.navbar-burger')

navbarBurgers.addEventListener('click', () => {
  navbarBurgers.classList.toggle('is-active')
  document.getElementById(navbarBurgers.dataset.target).classList.toggle('is-active')
})
