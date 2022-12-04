document.addEventListener('DOMContentLoaded', startApp);


const app = document.getElementById('app');
const buttons = document.querySelector('#buttons');
const url = 'https://rickandmortyapi.com/api/character';

let btnNext;
let btnPrevious;
let templateHtml;


function startApp() {
    search();
    select();
    getApi(url);
}

const getCard = async (url, urlInitial) => {

    // * Remove the search bar and select
    const searchCard = document.querySelector('.container-search');
    searchCard.classList.add('filter')

    // * Remove items on screen
    app.innerHTML = '';
    buttons.innerHTML = '';

    try {
        const response = await fetch(url);
        const results = await response.json();
        console.log(results);
        const genero = results.gender == 'Male' ? `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mars" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="10" cy="14" r="5" />
        <line x1="19" y1="5" x2="13.6" y2="10.4" />
        <line x1="19" y1="5" x2="14" y2="5" />
        <line x1="19" y1="5" x2="19" y2="10" />
        </svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-venus" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fd0061" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <circle cx="12" cy="9" r="5" />
        <line x1="12" y1="14" x2="12" y2="21" />
        <line x1="9" y1="18" x2="15" y2="18" />
    </svg>`
        
        templateHtml = `
            <div class="card_character">
                <h1 class="card_title">${results.name}</h1>
                <img class="card_img" src="${results.image}">
                <p class="card_created">Created: <span>${results.created}</span></p>
                <h3 class="card_gender">Gender: <span style="color: ${results.gender == 'Male' ? '#00abfb' : '#fd0061'}">${results.gender}</span> ${genero}</h3>
                <h3 class="card_status">Status: <span style="color: ${results.status == 'Alive' ? 'green' : 'red'}">${results.status == 'unknown' ? '¿?' : results.status}</span></h3>
                <h3 class="card_specie">Specie: <span>${results.species}</span></h3>
            </div>
        `;
        btnBack = `
            <button class="btns arrow-left" data-url="${urlInitial}">Back</button>
        `;
        app.innerHTML = templateHtml;
        buttons.innerHTML = btnBack;
        
    } catch (error) {
        console.log(error)
    }
}

const getApi = async (data) => {
    const searchCard = document.querySelector('.container-search');
    searchCard.classList.remove('filter')
    try {
        const response = await fetch(data);
        const results = await response.json();
        console.log(results);
        console.log(url);
        dataApi(results.results)
        btnNext = results.info.next ? `<button class="arrow-right btns" data-url="${results.info.next}"></button>` : '';
        btnPrevious = results.info.prev ? `<button class="arrow-left btns" data-url="${results.info.prev}"></button>` : '';
        buttons.innerHTML = btnPrevious + " " + btnNext;
    } catch (error) {
        console.log(error)
    }
}

const dataApi = async (data) => {
    app.innerHTML = '';
    try {
        for (let index of data) {
            const resp = await fetch(index.url);
            const result = await resp.json();
            // console.log(result)
            
            // ? Template for articles
            templateHtml = `
            <div class="articles" data-gender="${result.gender}" data-species="${result.species}" data-status="${result.status}"
            data-url="${result.url}">
            <img src="${result.image}" alt="${result.name}">
            <h3>${result.name}</h3>
            </div>
            `
            app.innerHTML += templateHtml;
        }
        
    } catch (error) {
        console.log(error)
    }
    
    const articles = document.querySelectorAll('.articles');
    articles.forEach(article => {
        
        article.addEventListener('click', (ev) => {
            
            const urlCharacter = ev.currentTarget.dataset.url;
            getCard(urlCharacter, url);
        })
    
    })
};

// Agregamos evento click a los botones para crear mas personajes apartir del dataSet
buttons.addEventListener('click', (event) => {
    if(event.target.classList.contains('btns')) {
        let value = event.target.dataset.url;
        getApi(value);
    };
});


// Función para buscar personajes por el nombre
const search = () => {
    const search = document.querySelector('#search');
    
    search.addEventListener('input', (ev) => {
                
        // ? Input value in real time
        const inputValue = ev.target.value.toLowerCase();

        const articles = document.querySelectorAll('.articles')
        // console.log(articles)
        
        articles.forEach( article => {

            if( article.textContent.toLowerCase().includes(inputValue) ) {
                article.classList.remove('filter') 

            } else {
                article.classList.add('filter')
            }
            
        });
    });
}

const select = () => {
    const elmSelect = document.querySelector('#elmSelect');
    
    elmSelect.addEventListener('change', (ev) => {
        const inputValue = ev.target.value;
        const articles = document.querySelectorAll('.articles');

        console.log(inputValue)
        console.log(articles)

        
        articles.forEach( article => {
            

            if( article.getAttribute('data-gender').toLowerCase() === inputValue ||
            article.getAttribute('data-status').toLowerCase() === inputValue||
            article.getAttribute('data-species').toLowerCase() === inputValue) {
                article.classList.remove('filter');
            } else if (inputValue === 'all') {
                article.classList.remove('filter');
            } else {
                article.classList.add('filter')
            }

        })
    })
}

