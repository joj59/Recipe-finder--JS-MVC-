export default class Likes {
    constructor() {
        this.likes = [];
    }

    like(id, title, author, image) {
        
        const like = {

            id,
            title,
            author,
            image

        };

        this.likes.push(like);

        this.persistData();
        
        return like;
        
    }
    
    unlike(id) {
        
        const index = this.likes.findIndex(el => el.id = id);
        
        this.likes.splice(index, 1);
        
        this.persistData();

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1 ;
    }

    getNumberOfLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        
        const storage = JSON.parse(localStorage.getItem('likes'));
        console.log(storage);
        if(storage) this.likes = storage;
    }
}