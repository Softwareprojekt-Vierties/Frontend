<template>
    <div id="right-side-info">
        <div id="info-bookmark">
            <label id="info-headline">Infos</label>
            <div id="div-bookmark">
                <Bookmark v-model:hasBookmark="isBookmarked" :id="$route.params.id" :type="type" width="10px" height="17px" wrappingDiv="div-bookmark" />
            </div>
        </div>
        <div v-if="region" class="infos">
            <label class="info-subheadline"><strong>Addresse:</strong> {{region}}</label>
        </div>
        <div v-if="age" class="infos">
            <label class="info-subheadline"><strong>Alter:</strong> {{age}} Jahre</label>
        </div>
        <div v-if="gender" class="infos">
            <label class="info-subheadline"><strong>Geschlecht:</strong> {{gender}}</label>
        </div>
        <div v-if="category" class="infos">
            <label class="info-subheadline"><strong>Kategorie:</strong> {{category}}</label>
        </div>
        <div v-if="experience" class="infos">
            <label class="info-subheadline"><strong>Erfahrung:</strong> {{experience}} Jahre</label>
        </div>
        <div v-if="location" class="infos">
            <label class="info-subheadline"><strong>Location:</strong> {{ location }}</label>
        </div>
        <div v-if="date" class="infos">
            <label class="info-subheadline"><strong>Datum:</strong> {{ date}}</label>
        </div>
        <div v-if="startTime || endTime" class="infos">
            <label class="info-subheadline"><strong>Startzeit:</strong> {{ startTime }}Uhr - {{endTime}}Uhr</label>
        </div>
        <div v-if="eventSize" class="infos">
            <label class="info-subheadline"><strong>Eventgröße:</strong> {{eventSize}} Personen</label>
        </div>
        <div v-if="city" class="infos">
            <label class="info-subheadline"><strong>Stadt:</strong> {{ city}}</label>
        </div>
        <div v-if="address" class="infos">
            <label class="info-subheadline"><strong>Straße:</strong> {{ address}}</label>
        </div>
        <div v-if="capacity" class="infos">
            <label class="info-subheadline"><strong>Kapazität:</strong> {{ capacity}} Personen</label>
        </div>
        <div v-if="price" class="infos">
            <label class="info-subheadline"><strong>Preis:</strong> {{ price}} €/h</label>
        </div>
        <div v-if="ageLimit" class="infos">
            <label class="info-subheadline"><strong>Altersfreigabe:</strong> {{ageLimit}}+</label>
        </div>
        <div v-if="locationSize" class="infos">
            <label class="info-subheadline"><strong>Größe:</strong> {{ locationSize}} ha</label>
        </div>
        <div v-if="openAir" class="infos">
            <label class="info-subheadline"><strong>Open Air:</strong> {{openAir}}</label>
        </div>
    </div>
</template>

<script>
    import Bookmark from '../components/BookmarkComponent.vue';

    export default {
        data() {
            return {
                isBookmarked: false,
            }
        },
        components: {
            Bookmark,
        },
        props: {
            type: {
                type: String,
                default: "",
            },
            hasBookmark: {
                type: Boolean,
                default: false,
            },
            region: {
                type: String,
                default: "",
            },
            age: {
                type: String,
                default: "",
            },
            gender: {
                type: String,
                default: "",
            },
            category: {
                type: String,
                default: "",
            },
            experience: {
                type: String,
                default: "",
            },
            location: {
                type: String,
                default: "",
            },
            date: {
                type: String,
                default: "",
            },
            startTime: {
                type: String,
                default: "",
            },
            endTime: {
                type: String,
                default: "",
            },
            eventSize: {
                type: String,
                default: "",
            },
            price: {
                type: String,
                default: "",
            },
            ageLimit: {
                type: String,
                default: "",
            },
            openAir: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                default: "",
            },
            address: {
                type: String,
                default: "",
            },
            capacity: {
                type: String,
                default: "",
            },
            locationSize: {
                type: String,
                default: "",
            },
        },
        created() {
            this.isBookmarked = this.hasBookmark;
        },
        emits: [
            "update:hasBookmark",
        ],
        watch: {
            isBookmarked(newVal) {
                this.$emit("update:hasBookmark", newVal);
            },
            hasBookmark(newVal) {
                this.isBookmarked = newVal;
            }
        },
    }
</script>

<style scoped>

#info-headline {
    display: block; /* Als Block-Element anzeigen */
    text-align: left; /* Text links ausrichten */
    font-family: Arial, sans-serif; /* Schriftart festlegen */
    font-size: 18px; /* Schriftgröße festlegen */
    font-weight: bold;
}

#right-side-info {
    border-radius: 10px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    padding: 10px;
}

#right-side-info::placeholder {
    color: var(--placeholder-color);
}

#info-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
}

#div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
    cursor: pointer;
}

.infos {
    display: grid;
    grid-template-columns: 150px;
    margin-top: 20px;
}   

.info-subheadline {
    text-align: left;
    font-size: 12px;
}

</style>
