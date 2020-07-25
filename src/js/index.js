// Global app controller    forkify-api.herokuapp.com 

import Search from './Models/Search';
import Recipe from './Models/Recipe';
import List from './Models/List';
import Likes from './Models/Likes';
import {elements, renderLoader, clearLoader} from './Views/base';
import * as searchView from './Views/searchView';
import * as recipeView from './Views/recipeView';
import * as listView from './Views/ListView';
import * as likesView from './Views/likesView';

const state = {};

const controlSearch = async () => {

//read ui
    const query = searchView.getInput();
    // const query = 'pizza';

    if(query){
        state.search = new Search(query);

        searchView.clearInput();
        searchView.clearResult();

        renderLoader(elements.loaderResult);
        
        try {

            await state.search.getResults();
            clearLoader();
            
        } catch (error) {
            console.log(error);
            alert('fucked up');
            clearLoader();
        }
        

        // console.log(state.search.result);
        searchView.renderResults(state.search.result);
    };

};




elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);

    }
});


// recipee

const controlRecipe = async () => {
    const id = parseInt(window.location.hash.replace('#',''));

    if (id) {
        

        state.recipe = new Recipe(id);
        recipeView.clearResult();
        renderLoader(elements.recipe);

        if (state.search) {
            searchView.highlightSelected(id);
        } 

        try {

            await state.recipe.getRecipe();
            state.recipe.parseIngeredients();
            
        } catch (error) {
            console.log(error);
            alert('we fucked up');
        }

        state.recipe.calcTime();
        state.recipe.calcServings();

        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        // console.log(state.recipe);
    };
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



const controlList = () => {

    if (!state.list) state.list = new List();
    
    state.recipe.ingredients.forEach((el, i )=> {

        const thingy = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(thingy);
    });

};

elements.shoppingList.addEventListener('click', e  => {
    const id = e.target.closest('.shopping__item').dataset.id;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        
        state.list.deleteItem(id);
        listView.deleteItem(id);
        
    } else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id,val);
    }        
});






const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)){
        
        const newLike = state.likes.like(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img

        );
        
        likesView.toggleLikeButton(true);
        likesView.renderLikes(newLike);

        
        // console.log(newLike);
    }else{
        state.likes.unlike(currentId);
        
        likesView.toggleLikeButton(false);
        likesView.renderUnlikes(currentId);
        // console.log(state.likes);

    };

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());    

};




window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes()); 

    state.likes.likes.forEach(el => {
        likesView.renderLikes(el);
    })
});



elements.recipe.addEventListener('click', e => {
    
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
       if(state.recipe.serving > 1) state.recipe.updateServings('dec');
       recipeView.updateServiceIgredient(state.recipe);
       
    }else if(e.target.matches('.btn-increase, .btn-increase *')) {
        
        state.recipe.updateServings('inc');
        recipeView.updateServiceIgredient(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }


    console.log(state.recipe.serving);
});




// window.l = new List();
// state.list = new List()
// window.s = state;