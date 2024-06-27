<template>
    <div id="comment-div">
        <img class="other-review" src="../assets/left.jpg" width="20px" height="20px" @click="previousReview" >
        <div class="review">
            <div class="user-info">
                <div class="user-info-details">
                    <div class="user-logo">
                        <img class="user-avatar" src="../assets/user_logo.png" width="30px" height="30px" alt="User Avatar">
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
        <img class="other-review" src="../assets/right.jpg" width="20px" height="20px" @click="nextReview">
    </div>
</template>


<script>
import axios from 'axios'; 
export default {
    data(){
        return {
            userName : '',
            rating : '',
            totalStars : 5,
            reviewText : '',
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
                this.reviewToGet = "getPersonReview";
            } else if (this.typeOfReview === 1) {
                this.reviewToGet = "getLocationReview";
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

.review{
    display:flex;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    background-color: white;
    border-radius: 18px;
    margin:2px;
    max-height: 110px;
    max-width: 530px;
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