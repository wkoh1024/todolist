import Masonry from "masonry-layout";

const container = document.querySelector("#container");

let msny = new Masonry(container, {
    itemSelector: '.project', 
    columnWidth: '.project',
    gutter: 20, 
    fitWidth: true, 
    transitionDuration: '0.1s'
});

msny.layout();

container.addEventListener('change', () => {
    msny.layout();
});