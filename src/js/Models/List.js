// import {uniqid} from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    };

    createId() {
      
        const x = Math.floor(Math.random()*10000);

        return x;
    };

    addItem(count, unit, ingredient) {
        const item ={
            id: this.createId(),
            count,
            unit,
            ingredient
        };   

        this.items.push(item);
        return item;
    };

    deleteItem(id) {

        const index = this.items.findIndex(el => el.id = id);

        this.items.splice(index, 1);
    };

    UpdateCount(id, newCount) {

        this.items.find(el => el.id = id).count = newCount;

    };
};