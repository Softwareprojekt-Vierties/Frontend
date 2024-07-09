<template>
    <div id="comment-div">
        <div class="review">
            <div class="user-info">
                <div class="stars">
                    <span v-for="star in totalStars" :key="star" class="star" :class="{ 'filled': star <= rating }" @click="setRating(star)">★</span>
                </div>
            </div>
            <div class="comment">
                <textarea v-model="comment" class="comment_input" type="text" placeholder="Kommentar Hier einfügen…"></textarea>
            </div>
        </div>
        <button @click="saveReview">Senden</button>
    </div>
</template>


<script>
import axios from 'axios'; 
export default {
    props: {
        idFromFather: {
            type: String,
            required: true
        },
        typeOfReview: {
            type: String,
            required: true
        }
    },
    data(){
        return {
            rating: 0, 
            totalStars: 5,
            comment: ''
        };
    },
    methods: {
        setRating(star) {
            this.rating = star;
        },
        async saveReview() {
            const token = localStorage.getItem('authToken');

            try {
                console.log("userid",this.idFromFather);
                const response = await axios.post('/createReview', {
                    id: this.idFromFather, 
                    sterne: this.rating,
                    inhalt: this.comment,
                    intention: "user"
                },
                {headers: {'auth':token}}
                );
                console.log('Review saved:', response.data);

                this.rating = 0;
                this.comment = '';
            } catch (error) {
                console.error('Error saving review:', error);
            }
        }
    }
};
</script>



<style scoped>

.comment_input{
    width: 100%;
}

.review{
    display:flex;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    background-color: white;
    border-radius: 18px;
    margin:2px;
    max-height: 110px;
    width: 530px;
}

.user-info{
    display: flex;
    flex-direction: column;
    max-height: 100%;
    margin-left: -5px;
}

.other-review{
    cursor:pointer;
}

.user-info-details{
    display: flex;
    flex-direction: row;
    align-items:start;
    justify-content: space-around;
    flex:1;
    max-height: 55px;
    margin:10px;
    margin-bottom: 0px;
    gap:7.5px;
}

.user-logo{
    margin-left:5px;
}

.stars{
    display:flex;
    flex:2;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    margin-top:-7px;
    margin-left:5px;
}

.user-name{
    font-size: 13px; 
    font-weight: bold;
    margin-top:5px;
}

.comment{
    display:flex;
    justify-content:left;
    border-left: 1px solid black;
    flex:5;
    font-size: 12px;
    text-align: left;
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 7px;
    margin-bottom: 10px;
}

.star {
    color: #ccc; 
    font-size: 22px; 
    cursor : pointer;
}

.star.filled {
    color: #f5d130; 
}

#comment-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

</style>
