<template>
    <div id="card">
        <div class="image-container">
            <img :alt="name" :src="computedImagePath" class="image">
        </div>
        <div id="details">
            <div id="name-bookmark">
                <div id="headline">
                    {{name}}
                </div>
                <img :alt="name" @click="changeBookmark" :src="require(hasBookmark ? '@/assets/bookmark-gray.jpg' : '@/assets/bookmark-white.jpg')" class="bookmark">
            </div>
            <div class="line-div">
                {{line1}}
            </div>
            <div class="line-div">
                {{line2}}
            </div>
            <div class="line-div">
                {{line3}}
            </div>
            <div id="button" @click="clickFuntion">
                {{buttonText}}
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
            isBookmarked: {
                type: Boolean,
                default: false
            },
            clickFuntion: {
                type: Function,
                default: function () { console.log("No function"); }
            },
        },
        data() {
            return {
                hasBookmark: false,
            }
        },
        computed: {
            computedImagePath() {
                if (this.imagePath === null) {
                    return require("@/assets/bild-hsbi.jpg");
                }
                return this.imagePath;
            },
        },
        methods: {
            changeBookmark() {
                this.hasBookmark = !this.hasBookmark;
                // send switch to server
            }
        },
        created() {
            this.hasBookmark = this.isBookmarked;
        }
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
    cursor: pointer;
    font-size: 18px;
    color: black;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

#button {
    font-size: 11px;
    cursor: pointer;
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
