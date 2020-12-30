let  fuse;
const fuse_options = {keys:['content', 'title']};
let fetching = false;
const input = document.getElementById('search-box');
const search_div = document.getElementById('search-results');
const search_results_div = document.getElementById('search-result-entries');
const content_div = document.getElementById('content-container');
const template = document.getElementById('search_entry');

let timeOut;

input.addEventListener('input', (e) => {
    if (!fuse && !fetching){
        fetching = true;
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                fuse = new Fuse(data, fuse_options);
                fetching = false;
                search(input.value);
            });
    } else if (!fetching) {
        clearTimeout(timeOut);
        timeOut = setTimeout(()=>search(input.value), 100);
    }
});

function search(str) {
    if (str == ''){
        content_div.style.display = 'block';
        search_div.style.display = 'none';
    } else  {
        console.log(fuse.search(str));
        search_results_div.innerHTML = '';
        for (result of fuse.search(str)){
            let clone = document.importNode(template.content, true);
            clone.querySelector('.title').innerText = result.item.title;
            clone.querySelector('.title').setAttribute("href", result.item.permalink);
            if (result.item.content && result.item.content.length > 300){
                clone.querySelector('.card-text').innerText = result.item.content.slice(0,300) + ' ...';
            } else {
                clone.querySelector('.card-text').innerText = result.item.content;
            }
            search_results_div.appendChild(clone);
            content_div.style.display = 'none';
            search_div.style.display = 'block';
        }
    }

}


const sidebar = document.querySelector('#sidebar');
const toggleSidebar = document.querySelector('#toggle-sidebar');

toggleSidebar.onclick = () => {
  sidebar.classList.toggle('open');
  toggleSidebar.innerText = sidebar.classList.contains('open') ? '>' : '<';
};
