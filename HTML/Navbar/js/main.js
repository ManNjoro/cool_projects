const linksContainer = document.querySelector('.links-container')
const links = document.querySelector('.links')
const navToggler = document.querySelector('.nav-toggle')


navToggler.addEventListener('click', () => {
    const linksContainerHeight = linksContainer.getBoundingClientRect().height
    const linksHeight = links.getBoundingClientRect().height
    if (linksContainerHeight === 0){
        linksContainer.style.height = `${linksHeight}px`
    } else {
        linksContainer.style.height = 0
    }
})