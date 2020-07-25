import axios from 'axios';
import {apiLink} from '../config';


export default class Search{

    constructor(query) {
        this.query = query;
    };



     async getResults() {
         try {
             const result = await axios(`${apiLink}/search?q=${this.query}`);
             this.result = result.data.recipes;
            //  console.log(this.rec);
             
         } catch (error) {
             console.log(error);
         };

    };

};