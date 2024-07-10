<template>
    <div id="artist-div">
        <img class="other-event" src="../assets/left.jpg" width="20px" height="20px" @click="previousEvent">

        <div id="background">
            <div id="card">
                <Image :url="eventsFromFather[eventsIndex].bild" :width="`calc(170px * ${scaleFactor})`" :height="`calc(140px * ${scaleFactor})`" border-radius="5px" background-color="none" />
                <div id="details">
                    <div id="name-bookmark">
                        <div id="headline">
                            {{ eventName }}
                        </div>
                        <Bookmark v-model:hasBookmark="events[eventsIndex].favorit" :id="events[eventsIndex]?.id ?? -1" type="events" :width="`calc(20px * ${scaleFactor})`" :height="`calc(30px * ${scaleFactor})`" />
                    </div>
                    <div class="line-div">
                        Location: {{ eventLocation }}
                    </div>
                    <div class="line-div">
                         Datum: {{ formattedEventDate }}
                    </div>
                    <div class="line-div">
                        Uhrzeit: {{ eventTime }}
                    </div>

                    <div id="button" @click="() => {clickFuntion(events[eventsIndex].id)}">
                        {{ buttonText }}

                    </div>
                </div>
            </div>
        </div>

        <img class="other-event" src="../assets/right.jpg" width="20px" height="20px" @click="nextEvent">

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
        eventsFromFather: {
            type: Array,
            default: () => []

        },
        buttonText: {
            type: String,
            default: "Event ansehen"
        },
        imagePath: {
            type: String,
            default: require("@/assets/bild-hsbi.jpg")
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
            events: [],
            eventsIndex: 0,
            eventName: '',
            eventLocation: '',
            eventDate: '',
            eventTime: '',
            scaleFactor: .56,
        };
    },
    computed: {
        computedImagePath() {
            if (this.imagePath === null) {
                return require("@/assets/bild-hsbi.jpg");
            }
            return this.imagePath;
        } , 
        formattedEventDate() {
            return this.formatDate(this.eventDate);
        }
    },
    methods: {
        setScaleFactor(factor) {
            document.documentElement.style.setProperty('--scale-factor', factor);
        },
        updateEvents() {
            console.log("events from father received",this.eventsFromFather);
            this.events = [];
            this.eventsFromFather.forEach(event => this.events.push({
                id: event['id'],
                name: event['name'],
                location: event['adresse'],
                datum: event['datum'],
                time: event['startuhrzeit'],
                favorit: event?.favorit ?? false,
            }));

            if (this.events.length > 0) {
                this.eventsIndex = 0; 
                this.eventName = this.events[this.eventsIndex].name;
                this.eventLocation = this.events[this.eventsIndex].location;
                this.eventDate = this.events[this.eventsIndex].datum;
                let newTime = this.events[this.eventsIndex].time.split(":");
                this.eventTime = newTime[0]+ ":"+ newTime[1];
            }
        }, 
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },

        previousEvent() {
            if (this.events.length > 0) {
                if (this.eventsIndex > 0) {
                    this.eventsIndex -= 1;
                } else {
                    this.eventsIndex = 0;
                }
                this.refreshEvents(this.events[this.eventsIndex]);
            } else {
                console.warn('No events available to show previous event.');
            }
        },

        nextEvent() {
            if (this.events.length > 0) {
                if (this.eventsIndex < this.events.length - 1) {
                    this.eventsIndex += 1;
                } else {
                    this.eventsIndex = this.events.length - 1;
                }
                this.refreshEvents(this.events[this.eventsIndex]);
            } else {
                console.warn('No events available to show next event.');
            }
        }
        ,

        refreshEvents(data){
            this.eventName = data.name;
            this.eventLocation = data.location;
            this.eventDate = data.datum;
            this.eventTime = data.time;

        }
    },
    created() {
        this.hasBookmark = this.isBookmarked;
        this.setScaleFactor(0.56); // Setzt den Skalierungsfaktor dynamisch
        this.updateEvents();
    },
    watch: {
        eventsFromFather: {
            handler: 'updateEvents',
            immediate: true
        }
    }
};
</script>

<style scoped>
:root {
    --scale-factor: 1; /* Standardwert */
}

.other-event{
    cursor: pointer;
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

.left-right-button {
    cursor: pointer;
}

</style>
