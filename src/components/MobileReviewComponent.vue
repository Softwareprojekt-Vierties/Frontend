<template>
    <div id="comment-div">
        <div id="review">
            <div class="user-info">
                <div class="user-info-details">
                    <div class="user-logo">
                        <img class="user-avatar" src="../assets/user_logo.png" alt="User Avatar">
                    </div>
                    <div class="user-name">
                        {{ userName }}
                    </div>
                </div>
                <div class="stars">
                    <span v-for="star in totalStars" :key="star" class="star" v-bind:class="{ 'filled': star <= rating }">★</span>
                </div>
            </div>
            <div class="comment">
                {{ reviewText }}
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios'; 
export default {
    data(){
        return {
            userName : 'Peter Müller',
            rating : '3',
            totalStars : 5,
            reviewText : 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
            reviews : [],
            reviewSize : '',
            reviewIndex : 0,
            reviewToGet: ''
        };
    },

    watch: {
        typeOfReview: 'updateReviewToGet'
    },

    props: {
        idFromFather: {
            type: String,
            required: true   
        },
        typeOfReview: {
            type: Number,
            required: true
        }
    },

    methods: {
        async updateReviewToGet() {
            if (this.typeOfReview === 0) {
                this.reviewToGet = "getPersonReview"; //dj
            } else if (this.typeOfReview === 1) {
                this.reviewToGet = "getLocationReview"; // location
            }

            if (this.reviewToGet) {
                try {
                    const response = await axios.get(`/${this.reviewToGet}/${this.idFromFather}`);
                    this.reviews = response.data.rows;
                    this.reviewSize = this.reviews.length;

                    console.log("Review data received:", this.reviews);
                    this.setFormData(this.reviews);
                } catch (error) {
                    console.error('Error with sending review ID to DB:', error);
                }
            }
        },

        setFormData(data) {
            if (data.length > 0) {
                this.userName = data[this.reviewIndex]["profilname"];
                this.rating = data[this.reviewIndex]["sterne"];
                this.reviewText = data[this.reviewIndex]["inhalt"];
            }
        },

        previousReview() {
            if (this.reviewIndex > 0) {
                this.reviewIndex -= 1;
            } else {
                this.reviewIndex = 0;
            }
            this.setFormData(this.reviews);
        },

        nextReview() {
            if (this.reviewIndex >= 0 && this.reviewIndex < this.reviewSize - 1) {
                this.reviewIndex += 1;
            } else {
                this.reviewIndex = this.reviewSize - 1;
            }
            this.setFormData(this.reviews);
        }
    },

    created() {
        this.updateReviewToGet();
    }
};
</script>



<style scoped>

#review{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: top;
    width: 268px;
    border-radius: 18px;
    padding: 8px;
    gap: 5px;
}

.user-info{
    border-right: 1px solid rgb(200, 200, 200);
    padding-right: 5px;
}

.other-review{
}

.user-info-details{
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    margin-bottom: -5px;
}

.user-logo{
    width: 25px;
    height: 25px;
}

.stars{
    
}

.user-name{
    font-size: 12px;
    font-weight: bold;
    width: 70px;
}

.comment{
    font-size: 8.5px;
    height: 20px;
    text-align: left;
}

.star {
    color: #ccc; 
    font-size: 20px; 
}

.star.filled {
    color: #f5d130; 
}

#comment-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    gap: 0px;
}

</style>
