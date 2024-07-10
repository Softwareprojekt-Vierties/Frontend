<template>
    <div id="card">
        <Image :url="computedImagePath" :width="`calc(170px * ${scaleFactor})`" :height="`calc(140px * ${scaleFactor})`" border-radius="5px" background-color="none" />
        <div id="details">
            <div id="name-bookmark">
                <div id="headline" @click="titleClickFunction(info)">
                    {{name}}
                </div>
                <Bookmark v-model:hasBookmark="hasBookmark" :id="info?.id ?? -1" :type="info?.type ?? ''" :width="`calc(20px * ${scaleFactor})`" :height="`calc(30px * ${scaleFactor})`" />
            </div>
            <div class="line-div">
                {{line1}}
            </div>
            <div class="line-div">
                 {{ line2 }}  
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
            buttonColor: {
                type: String,
                default: "var(--green)",
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
            },
            formattedEventDate() {
                console.log("Recalculating date for:", this.line2);
                return this.formatDate(this.line2);
            }
        },
        created() {
            this.hasBookmark = this.isBookmarked;
        },

        watch: {
    line2(newValue, oldValue) {
        console.log('line2 updated from:', oldValue, 'to:', newValue);
    }
},

methods: {
    formatDate(isoDateString) {
        console.log("Received ISO Date String:", isoDateString);  
        const date = new Date(isoDateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Formats date as DD/MM/YYYY
    }
}
}
</script>

<style scoped>

#card {
    display: grid;
    grid-template-columns: auto auto;
    align-items: top;
    justify-content: center;
    padding: calc(10px * v-bind("scaleFactor"));
    border: var(--button-border);
    border-radius: 5px;
    gap: calc(15px * v-bind("scaleFactor"));
    width: calc(380px * v-bind("scaleFactor"));
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
    margin-bottom: calc(11px * v-bind("scaleFactor"));
    font-size: calc(10px * v-bind("scaleFactor"));
    height: calc(10px * v-bind("scaleFactor"));
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
    margin-bottom: calc(10px * v-bind("scaleFactor"));
    cursor: pointer;
    font-size: calc(18px * v-bind("scaleFactor"));
    color: black;
    text-shadow: calc(2px * v-bind("scaleFactor")) calc(2px * v-bind("scaleFactor")) calc(4px * v-bind("scaleFactor")) rgba(0, 0, 0, 0.5);
}

#button {
    font-size: calc(11px * v-bind("scaleFactor"));
    cursor: pointer;
    background-color: v-bind("buttonColor");
    color: var(--simple-font-color);
    padding: calc(5px * v-bind("scaleFactor"));
    border: var(--button-border);
    border-radius: 5px;
    width: calc(180px * v-bind("scaleFactor"));
    height: calc(15px * v-bind("scaleFactor"));
    display: grid;
    justify-content: center;
    align-items: center;
    margin-top: calc(15px * v-bind("scaleFactor"));
}
</style>
