<template>
    <div class="card">
        <div class="image-container">
            <img :alt="name" :src="computedImagePath" class="image">
        </div>
        <div class="details">
            <h3>{{name}}</h3>
            <p>{{line1}}</p>
            <p>{{line2}}</p>
            <p>{{line3}}</p>
            <button>{{buttonText}}</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: "-"
            }, 
            line1: {
                type: String,
                default: "-"
            },
            line2: {
                type: String,
                default: "-"
            },
            line3: {
                type: String,
                default: "-"
            },
            buttonText: {
                type: String,
                default: "-"
            },
            imagePath: {
                type: String,
                default : require("@/assets/bild-hsbi.jpg")
            },
        },
        computed: {
            computedImagePath() {
                if (this.imagePath === null) {
                    return require("@/assets/bild-hsbi.jpg");
                }
                return this.imagePath;
            },
        },
    };
</script>

<style scoped>
.card {
    display: inline-grid;
    grid-template-columns: auto auto auto; 
    background: white;
    width: 25%;
    height: auto;
    border: black solid 1px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
}

.image-container {
    justify-self: center;
    justify-content: center;
    align-self: center;
    align-items: center;
}

.image {
    width: 80%;
    height: 80%;
    border-radius: 2%;
    object-fit: cover;
    margin: 10%;
}

.details {
    background-color: white; 
    color: black;
    padding: 15px; 
    border-top-right-radius: 10px; 
    border-bottom-right-radius: 10px; 
    font-family: Arial, sans-serif; 
}

.details h3 {
    margin-top: 0;
    font-size: 14;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5); 
}

.details p {
    color: black;
    margin-top: 0;
    font-size: 8;
}

.details button {
    color: black;
    margin-top: 0;
    font-size: 7;
}

.details button {
    background-color: #92D050; 
    color: black;
    border: none; 
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 10px;
    cursor: pointer;
    border: black solid 1px;
    border-radius: 5px; 
    width: 100px;
    height: 20px;
    margin: 4px 2px;
}
</style>

