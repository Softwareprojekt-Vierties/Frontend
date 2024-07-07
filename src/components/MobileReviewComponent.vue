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
export default {
    props: {
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        reviewText: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            totalStars: 5
        };
    }
};
</script>



<style scoped>

#review{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
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
