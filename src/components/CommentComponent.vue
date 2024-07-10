<template>
    <div class="comment">
        <div id="headline">
            Kommentar hinzufügen
        </div>
        <div id="star-div">
            <div id="star-headline"><div>Bewertung:</div><div id="stars"><span v-for="star in totalStars" :key="star" class="star" :class="{ 'filled': star <= rating }" @click="setRating(star)">★</span></div></div>
        </div>
        <div id="comment-headline">
            Begründung:
        </div>
        <textarea v-model="comment" class="comment_input" type="text" placeholder="Hier kommentieren…"></textarea>
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
                    intention: this.typeOfReview
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

.comment{
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.star {
    color: #ccc; 
    font-size: 22px; 
    cursor : pointer;
    margin-left: 10px;
}

.star.filled {
    color: #f5d130; 
}

textarea {
    width: 250px;
    height: 70px;
    border-radius: 8px;
    font-family: Arial, Helvetica, sans-serif;
    padding: 10px;
    margin-left: 10px;
}

button {
    width: 130px;
    height: 25px;
    margin-left: 153px;
    margin-top: 10px;
    border-radius: 7px;
    background-color: var(--green);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #000000;
}

#headline {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
}

#star-div {
    text-align: left;
    margin-bottom: 10px;
}

#star-headline {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;
}

#comment-headline {
    font-size: 15px;
    font-weight: bold;
    text-align: left;
    margin-bottom: -5px;
    margin-top: -5px;
}

</style>
