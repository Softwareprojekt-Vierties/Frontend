<template>
    <div id="artist-div">
        <img class="user-avatar" src="../assets/left.jpg" style="cursor:pointer" width="20px" height="20px" @click="$emit('decreaseEventLocationsIndex')">
        <div id="background">
            <div id="card">
                <Image :url="info.profilbild" :width="`calc(170px * ${scaleFactor})`" :height="`calc(140px * ${scaleFactor})`" border-radius="5px" background-color="none" />
                <div id="details">
                    <div id="name-bookmark">
                        <div id="headline">
                            {{name}}
                        </div>
                        <Bookmark v-model:hasBookmark="hasBookmark" :id="info?.id ?? -1" :type="info?.type ?? ''" :width="`calc(20px * ${scaleFactor})`" :height="`calc(30px * ${scaleFactor})`" />
                    </div>
                    <div class="line-div">
                        {{line1}}
                    </div>
                    <div class="line-div">
                        Datum: {{formatedDatum}}
                    </div>
                    <div class="line-div">
                        {{line3}}
                    </div>
                    <div id="button" @click="clickFuntion">
                        {{buttonText}}
                    </div>
                </div>
            </div>
        </div>
        <img class="user-avatar" src="../assets/right.jpg" style="cursor:pointer" width="20px" height="20px" @click="$emit('increaseEventLocationsIndex')">
    </div>
</template>

<script>
    import Bookmark from './BookmarkComponent.vue';
    import Image from './ImageComponent.vue';

    export default {
        components: {
            Bookmark,
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
            info: {
                type: Object,
                default: null,
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
                scaleFactor: .56,
            }
        },
        computed: {
            computedImagePath() {
                if (this.imagePath === null) {
                    return require("@/assets/bild-hsbi.jpg");
                }
                return this.imagePath;
            
            },

            formatedDatum() {
                if (this.line2 && this.line2.includes("Datum: ")) {
                    let datumPart = this.line2.split("Datum: ")[1].trim();
                    let isoDate = new Date(datumPart);
                    if (!isNaN(isoDate)) {
                        let day = String(isoDate.getDate()).padStart(2, '0');
                        let month = String(isoDate.getMonth() + 1).padStart(2, '0');
                        let year = isoDate.getFullYear();
                        return `${day}-${month}-${year}`;
                    }
                }
                return this.line2; 
            }
        },
        methods: {
            setScaleFactor(factor) {
                document.documentElement.style.setProperty('--scale-factor', factor);
            }
        },
        created() {
            this.hasBookmark = this.isBookmarked;
            this.setScaleFactor(0.56); // Setzt den Skalierungsfaktor dynamisch
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
    background-color: rgb(146, 208, 80);
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
