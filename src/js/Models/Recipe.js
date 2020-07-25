import axios from 'axios';
import {apiLink} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
      try {
        
        const result = await axios(`${apiLink}/get?rId=${this.id}`);
        this.title = result.data.recipe.title;
        this.author = result.data.recipe.publisher;
        this.img = result.data.recipe.image_url;
        this.source = result.data.recipe.source_url;
        this.ingredients = result.data.recipe.ingredients;

      } catch (e) {
          console.log(e);
          alert('fuch this');
      };
    };

    calcTime() {
         const numIng = this.ingredients.length;
         const periods = Math.ceil(numIng / 3);
         this.time = periods * 15;
    };

    calcServings() {
        this.serving = 4;
    }

    parseIngeredients(){

      const unitsLong = ['tablespoons','tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
      const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
      const units= [...unitsShort, 'kg', 'g'];

      const newIngredients = this.ingredients.map(el => {

        let ingredient = el.toLowerCase();
        
        unitsLong.forEach((cur, ind) => 
        {
          ingredient = ingredient.replace(cur, unitsShort[ind])
        });

        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        const arrIng = ingredient.split(' ');

        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng ;
        if (unitIndex > -1) {

          const arrCount = arrIng.slice(0, unitIndex);

          let count;
          if (arrCount.length === 1) {
            count = eval(arrIng[0].replace('-', '+'));

          } else {
            count = eval(arrIng.slice(0, unitIndex).join('+'));
          };

          objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          };

        } else if (parseInt(unitIndex[0],  10)){
          objIng = {
            count: parseInt(unitIndex[0],  10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ')
          };

        }else if(unitIndex === -1) {
          objIng = {
            count: 1,
            unit: '',
            ingredient
          };
        }


        // ingertient
        return objIng;
      }); 

      this.ingredients = newIngredients

    };

    updateServings(type) {
      
      const newServings = type === 'dec' ? this.serving - 1 : this.serving + 1;

      this.ingredients.forEach(cur => {
        cur.count *= (newServings / this.serving);
      });

      this.serving = newServings;
    }
};

