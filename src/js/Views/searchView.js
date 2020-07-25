

import {elements} from './base';



export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};   

export const clearResult = () => {
    elements.searchResult.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};   

export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const trimResultTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = title.substring(0, 17);
        return `${newTitle.substring(0,title.lastIndexOf(' '))}...`;
    }else if (title.length < limit){
        return title;
    }
};   

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src=${recipe.image_url} alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${trimResultTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResult.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => 
    `<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
    </button>`;

    
const renderButtons =   (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {

        button = createButton(page, 'next');
        
    }else if (pages > page) {

        button = `${createButton(page, 'next')}
                  ${createButton(page, 'prev')}`

    }
    else if(page === pages && pages > 1) {

        button = createButton(page, 'prev');

    };

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * 10;
    const end = page * resPerPage;
    
    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resPerPage);
};