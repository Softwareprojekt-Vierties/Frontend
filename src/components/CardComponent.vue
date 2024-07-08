<template>
    <div id="card">
        <Image :url="computedImagePath" width="calc(170px * var(--scale-factor))" height="calc(135px * var(--scale-factor))" border-radius="5px" background-color="none" />
        <div id="details">
            <div id="name-bookmark">
                <div id="headline" @click="titleClickFunction(info)">
                    {{name}}
                </div>
                <Bookmark v-model:hasBookmark="hasBookmark" :id="info.id" :type="info.type" width="calc(20px * var(--scale-factor))" height="calc(30px * var(--scale-factor))" />
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
            },
            scaleFactor: {
                type: Number,
                default: 1,
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
        created() {
            this.hasBookmark = this.isBookmarked;
            document.documentElement.style.setProperty('--scale-factor', this.scaleFactor);
        }
    };
</script>

<style scoped>
:root {
    --scale-factor: 1; /* Standardwert */
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
    color: var(--textfield-font-color);
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
    border: var(--button-border);
    border-radius: 5px;
    width: calc(180px * var(--scale-factor));
    height: calc(15px * var(--scale-factor));
    display: grid;
    justify-content: center;
    align-items: center;
    margin-top: calc(15px * var(--scale-factor));
}
</style>
