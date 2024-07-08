<template>
    <div id="card">
        <Image :url="computedImagePath" width="170px" height="135px" border-radius="5px" background-color="none" />
        <div id="details">
            <div id="name-bookmark">
                <div id="headline" @click="titleClickFunction(info)">
                    {{name}}
                </div>
                <Bookmark v-model:hasBookmark="hasBookmark" :id="info.id" :type="info.type" width="20px" height="30px" />
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
            <div id="button" @click="buttonClickFunction(info)">
                {{buttonText}}
            </div>
        </div>
    </div>
</template>

<script>
    import Image from './ImageComponent.vue';
    import Bookmark from './BookmarkComponent.vue';

    export default {
        components: {
            Image,
            Bookmark,
        },
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
            buttonClickFunction: {
                type: Function,
                default: function () { console.log("No function"); }
            },
            titleClickFunction: {
                type: Function,
                default: function () { console.log("No function"); }
            },
            info: {
                type: Object,
                default: null,
            }
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
    background-color: var(--textfield-background);
}

#headline {
    @media (prefers-color-scheme: dark) {
        color: var(--textfield-font-color);
    }
    overflow: hidden;
}

.line-div {
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: left;
    text-align: left;
    margin-bottom: 11px;
    font-size: 10px;
    height: 10px;
    overflow: hidden;
    color: var(--textfield-font-color);
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
    background-color: var(--green);
    color: var(--simple-font-color);
    padding: 5px;
    border: var(--button-border);
    border-radius: 5px;
    width: 180px;
    height: 15px;
    display: grid;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
}
</style>
