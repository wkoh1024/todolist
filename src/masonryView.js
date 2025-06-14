import Masonry from "masonry-layout";

const container = document.querySelector("#container");

let msny = new Masonry(container, {
    itemSelector: '.project', 
    columnWidth: 900,
});
