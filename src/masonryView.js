import Masonry from "masonry-layout";

const container = document.querySelector("#container");
const projects = document.querySelectorAll("div.project");

let msny = new Masonry(container, {
    itemSelector: '.project', 
    columnWidth: '.project',
    gutter: 20, 
    fitWidth: true, 
    transitionDuration: '0.2s',
    horizontalOrder: true,

});

msny.layout();

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        msny.layout();
    }
});

function observeProjects() {
    projects.forEach(project => resizeObserver.observe(project));
}

observeProjects();