<template>
    <div id="card">
        <Image :url="computedImagePath" width="calc(170px * var(--scale-factor))" height="calc(135px * var(--scale-factor))" border-radius="5px" background-color="none" />
        <div id="details">
            <div id="name-bookmark">
                <div id="headline">
                    {{name}}
                </div>
                <img :alt="name" @click="changeBookmark" v-if="hasBookmark && isDarkMode" :src="require('@/assets/bookmark-filled.png')" class="bookmark">
                <img :alt="name" @click="changeBookmark" v-else-if="isDarkMode" :src="require('@/assets/bookmark-empty.png')" class="bookmark">
                <img :alt="name" @click="changeBookmark" v-else-if="hasBookmark" :src="require('@/assets/bookmark-gray.jpg')" class="bookmark">
                <img :alt="name" @click="changeBookmark" v-else :src="require('@/assets/bookmark-white.jpg')" class="bookmark">
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
    import Image from './ImageComponent.vue';
    import axios from 'axios';

    export default {
        components: {
            Image,
        },
        props: {
            name: {
                type: String,
                default: "UNI PARTY"
            }, 
            line1: {
                type: String,
                default: "Location: Campus Minden"
            },
            line2: {
                type: String,
                default: "Datum: 17.8.2024"
            },
            line3: {
                type: String,
                default: "Zeit: 19 Uhr – 2Uhr"
            },
            buttonText: {
                type: String,
                default: "Ticket buchen (20/50)"
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
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
        },
        methods: {
            changeBookmark() {
                this.hasBookmark = !this.hasBookmark;
                // send switch to server
                axios.post("/changeFavorite/", {
                    id: this.info.id,
                    type: this.info.type,
                },{
                    headers: { "auth": localStorage.getItem("authToken")}
                })
                    .then(res => console.log("Success: ", res))
                    .catch(err => console.error("Error: ", err));
            },
            setScaleFactor(factor) {
                document.documentElement.style.setProperty('--scale-factor', factor);
            }
        },
        created() {
            this.hasBookmark = this.isBookmarked;
            this.setScaleFactor(0.8); // Setzt den Skalierungsfaktor dynamisch
        }
    };
</script>

<style scoped>
:root {
    --scale-factor: 1; /* Standardwert */
}

#background {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 7px;
    background-color: white;
    margin-left: 2px;
    margin-right: 2px;
}

#card {
    display: grid;
    grid-template-columns: auto auto;
    align-items: top;
    justify-content: center;
    padding: calc(10px * var(--scale-factor));
    border: 1px solid #000;
    border-radius: 5px;
    gap: calc(15px * var(--scale-factor));
    width: calc(380px * var(--scale-factor));
    background-color: var(--textfield-background);
}

#headline {
    @media (prefers-color-scheme: dark) {
        color: var(--textfield-font-color);
    }
    overflow: hidden;
}

.image {
    width: calc(170px * var(--scale-factor));
    height: calc(135px * var(--scale-factor));
    border-radius: 5px;
}

.bookmark {
    width: calc(20px * var(--scale-factor));
    height: calc(30px * var(--scale-factor));
}

.line-div {
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: left;
    text-align: left;
    margin-bottom: calc(11px * var(--scale-factor));
    font-size: calc(10px * var(--scale-factor));
    height: calc(10px * var(--scale-factor));
    overflow: hidden;
}

#name-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    justify-content: space-between;
}

#name-bookmark {
    margin-bottom: calc(10px * var(--scale-factor));
    cursor: pointer;
    font-size: calc(18px * var(--scale-factor));
    color: black;
    text-shadow: calc(2px * var(--scale-factor)) calc(2px * var(--scale-factor)) calc(4px * var(--scale-factor)) rgba(0, 0, 0, 0.5);
}

#button {
    font-size: calc(11px * var(--scale-factor));
    cursor: pointer;
    background-color: var(--green);
    color: var(--simple-font-color);
    padding: calc(5px * var(--scale-factor));
    border: 1px solid #000;
    border-radius: 5px;
    width: calc(180px * var(--scale-factor));
    height: calc(15px * var(--scale-factor));
    display: grid;
    justify-content: center;
    align-items: center;
    margin-top: calc(15px * var(--scale-factor));
}

#artist-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}
</style>
