<template>
    <div id="comment-div">
        <img class="user-avatar" src="../assets/left.jpg" width="20px" height="20px">
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
        <img class="user-avatar" src="../assets/right.jpg" width="20px" height="20px">
    </div>
</template>



<script>

import axios from 'axios'; 
export default {
  /*props: {
    userName: {
      type: String,
      default: "Peter Müller"
    },
    rating: {
      type: Number,
      default: 3
    },
    totalStars: {
      type: Number,
      default: 5
    },
    reviewText:{
        type: String,
        default: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm" 
    }
  }*/ 

   data(){
     return {
        userName : '',
        rating : '',
        totalStars : 5,
        reviewText : '',
        dbLocationReviews : []
     };
   },

    async created(){
        let id = 24;
        try {
            const response = await axios.get(`/getLocationReview/${id}`);
            this.dbLocationReviews = response.data.rows;
            

            console.log(this.dbLocationReviews);
            this.setFormData(this.dbLocationReviews);
            console.log('Location data of location received:', response.data);
        } catch (error) {
            console.error('Error with sending location ID for review to DB :', error);

        }
    },
    methods: {

    setFormData(data) {
        this.userName = data[1]["profilname"] ;
        this.rating = data[1]["sterne"]   ;
        this.reviewText = data[1]["inhalt"] ;
     },

  }
}

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