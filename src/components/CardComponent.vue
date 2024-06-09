<template>
    <div id="card">
        <div class="image-container">
            <img :alt="name" :src="computedImagePath" class="image">
        </div>
        <div id="details">
            <div id="name-bookmark">
                <div id="headline">
                    UNI PARTY
                </div>
                <img :alt="name" :src="computedImagePath" class="bookmark">
            </div>
            <div class="line-div">
                Location: Campus Minden
            </div>
            <div class="line-div">
                Datum: 17.8.2024
            </div>
            <div class="line-div">
                Zeit: 19 Uhr – 2Uhr
            </div>
            <div id="button">
                Ticket buchen (20/50)
            </div>
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
#card {
    display: grid;
    grid-template-columns: auto auto;
    align-items: top;
    justify-content: center;
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    gap: 15px;
    width: 380px;
}

.image {
    width: 170px;
    height: 135px;
    border-radius: 5px;
}

.bookmark {
    width: 20px;
    height: 30px;
}

.line-div {
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: left;
    text-align: left;
    margin-bottom: 11px;
    font-size: 10px;
}

#name-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    justify-content: space-between;
}

#details {
}

#name-bookmark {
    margin-bottom: 10px;
    font-size: 18px;
    color: black;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

#button {
    font-size: 11px;
    background-color: rgb(146, 208, 80);
    padding: 5px;
    border: 1px solid #000;
    border-radius: 5px;
    width: 180px;
    height: 15px;
    display: grid;
    justify-content: center;
    align-items: center;
}
</style>