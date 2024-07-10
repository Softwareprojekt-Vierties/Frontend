<template>
    <div id="app">
        <MobileHeaderComponent :imagePreview="imagePreview" :name="eventName" :kurzbeschreibung="kurzbeschreibung" :sterne="sterne" />
        <div>
            <div id="info-bookmark">
                <div id="info-headline">Infos</div>
                <div id="div-bookmark">
                    <Bookmark v-model:hasBookmark="hasBookmark" :id="$route.params.id" type="events" width="10px" height="17px" margin-left="1px" wrappingDiv="div-bookmark" />
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-left">

                <label class="info-subheadline"><strong>Location:</strong>{{location}}</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Datum:</strong> {{ formattedEventDate }}</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Startzeit:</strong> {{ startuhrzeit }} Uhr</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Eventgröße:</strong> {{anzahlPersonen }} Personen</label>
            </div>
            <div id="info-right">
                <label class="info-subheadline"><strong>Preis:</strong> {{preis}}€</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Altersfreigabe:</strong> {{alter}}+</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Open Air:</strong> {{openAir}}</label>
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Beschreibung:
            </div>
        </div>
        <div id="description-div">
            <div id="description">
                {{beschreibung}}
            </div>
        </div>
        <div class="description-headline-div" v-if="currentProviders.length > 0">
            <div class="description-headline">
                Dienstleister:
            </div>
        </div>
        <div id="event-container" >
            <MobileEventComponent v-for="(provider, index) in currentProviders" :key="index" :componentName="provider.nameCaterer || provider.nameArtist" :imagePath="provider.imageCaterer || provider.imageArtist" />
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Karte:
            </div>
            <div id="maps-div" style="height: 200px;"></div>
        </div>
        <div id="button-div">
            <div id="ticket" 
              :class="{ 'disabled': hasTickets || isOwner }"  
              :style="{ 'cursor': (hasTickets || isOwner) ? 'not-allowed' : 'pointer' }"
              @click="bookEvent">
              Event buchen ({{freietickets }}/{{ maxtickets }})
            </div>
        </div>
        <div id="home-button" v-if="menu" @click="goToHomePage">
            <img id="home-mobile" src="../assets/home-mobile.png" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileHeaderComponent from '@/components/MobileHeaderComponent.vue';
import MobileEventComponent from '@/components/MobileEventComponent.vue';
import Bookmark from '@/components/BookmarkComponent.vue';

export default {
    components: {
        MobileHeaderComponent,
        MobileEventComponent,
        Bookmark,
    },

    data(){
        return{
            menu: false,
            eventName:'',
            kurzbeschreibung : '',
            beschreibung : '',
            location : '',
            datum : '',
            anzahlPersonen : '',
            preis : '',
            alter : '',
            openAir : '',
            sterne: '',
            imagePreview : null,
            artists: [],
            caterers : [],
            adresse : '',
            map: null,
            marker : null,
            currentIndex: 0,
            combinedProviders: [],
            startuhrzeit: "",
            enduhrzeit: "",
            hasBookmark: false,
            id : '',
            isOwner : '',
            maxtickets : '',
            freietickets : '',
            hasTickets:''
        };
    },

    async created(){
        let id = this.$route.params.id;
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/getEventById/${id}`,{headers: {'auth':token}});
        console.log("where i am ??",response.data);

        this.setFormData(response.data);
        this.geocodeAddress();
    },

    computed: {
        formattedEventDate() {
                return this.formatDate(this.datum);
        }, 
        currentProviders() {
            return this.combinedProviders.slice(this.currentIndex, this.currentIndex + 3);
        }
    },

    methods: {

        bookEvent() {
            if (this.hasTickets || this.isOwner) {
                console.log("not allowed to buy tickets");
                return; 
            }
            this.bookEventAction(); 
        },
        
        async bookEventAction() {
            try {
            console.log("Trying to book tickets...");
            const token = localStorage.getItem('authToken');
            const response = await axios.post('/createTicket', {
                eventid: this.id
            }, { headers: { 'auth': token } });
            console.log('Ticket successfully booked:', response.data);
            this.hasTickets = true;
            } catch (error) {
            console.error('Error booking ticket:', error);
            }
        },

        goToHomePage(){
            this.$router.push('/search');
        },
        setFormData(data){
            this.maxtickets = data.event.rows[0].maxtickets,
            this.freietickets = data.event.rows[0].freietickets,
            this.id = data.event.rows[0].id;
            this.eventName = data.event.rows[0].name;
            this.kurzbeschreibung = data.event.rows[0].kurzbeschreibung;
            this.imagePreview = data.event.rows[0].bild;
            this.beschreibung = data.event.rows[0].beschreibung;
            this.kurzbeschreibung = data.event.rows[0].kurzbeschreibung;
            this.preis = data.event.rows[0].preis;
            this.alter = data.event.rows[0].altersfreigabe;
            let time = data.event.rows[0].startuhrzeit.split(":");
            this.startuhrzeit = time[0]+":"+time[1];
            time = data.event.rows[0].enduhrzeit.split(":");
            this.enduhrzeit = time[0]+":"+time[1];
            this.location = data.event.rows[0].locationname;
            this.anzahlPersonen = data.event.rows[0].eventgroesse;
            let date = data.event.rows[0].datum.split("-");
            this.datum = date[2].split("T")[0] + "." + date[1] + "." + date[0];
            let openair = data.event.rows[0].openair;
            this.isOwner = data.isOwner;
            this.hasTickets = data.hasTicket;



            if(openair === true){
                this.openAir = "Ja";
            } else{
                this.openAir = "Nein";
            }

            this.addresse = data.event.rows[0].adresse;
            this.sterne = data.event.rows[0].sterne;

            data['caterers'].rows.forEach(caterer =>{
                this.caterers.push({
                    id: caterer.id,
                    nameCaterer: caterer.profilname,
                    imageCaterer : caterer.profilbild
                })
            });
            console.log("the caterer", this.caterers);

            data['artists'].rows.forEach(artist =>{
                this.artists.push({
                    id: artist.id,
                    nameArtist: artist.profilname,
                    imageArtist : artist.profilbild
                })
            });
            console.log("the artists", this.artists);

            this.combinedProviders = [...this.caterers, ...this.artists];
        }, 

        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }, 

        async geocodeAddress() {
            const address = `${this.addresse}`;
            console.log('Geocoding address:', address);
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

            try {
                const response = await axios.get(url);
                console.log('Geocode response:', response.data);
                if (response.data.length > 0) {
                    const location = response.data[0];
                    this.showMap(location.lat, location.lon);
                } else {
                    console.error('No location found for this address');
                }
                } catch (error) {
                    console.error('Failed to fetch coordinates:', error);
            }
        },
        showMap(lat, lon) {
            console.log('Lat:', lat, 'Lon:', lon);
            if (this.map) this.map.remove();
                this.map = Leaflet.map('maps-div').setView([lat, lon], 16);
                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
                var customIcon = Leaflet.icon({
                iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });
            this.marker = Leaflet.marker([lat, lon], { icon: customIcon }).addTo(this.map);
        },

        nextProvider() {
            if (this.currentIndex + 3 < this.combinedProviders.length) {
                this.currentIndex += 3;
            }
        },
        previousProvider() {
            if (this.currentIndex - 3 >= 0) {
                this.currentIndex -= 3;
            }
        },
        handleClick() {
            if(this.menu) {
                this.menu = false;
            }
            else {
                this.menu = true;
            }
        }
    }
}
</script>
  
<style scoped>

#main {

}

#info-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 200px;
    margin-top: 20px;
}

.disabled {
    background-color: grey !important;
    pointer-events: none;
}

#div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
    cursor: pointer;
    margin-right: 10px;
}

#info-headline {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

#info {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: top;
    gap: 10px;
    height: 120px;
}

#info-left {
    text-align: left;
    font-size: 10px;
    width: 155px;
}

#info-right {
    text-align: left;
    font-size: 10px;
    width: 105px;
    margin-right: 15px;
}

.description-headline-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
}

.description-headline {
    width: 287px;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 3px;
}

#description-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

#description {
    width: 287px;
    text-align: left;
    font-size: 13px;
}

#event-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    width: 280px; /* Feste Breite, die du anpassen kannst */
    margin: 0 auto; /* Zentriert den Container horizontal */
    gap: 10px;
    padding: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
}

#maps-div {
  border: 1px solid #000000;
  border-radius: 8px;
  margin-top: 3px;
  margin-bottom: 20px;
}

#button-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
}

#ticket {
    background-color: var(--green);
    width: 285px;
    height: 30px;
    border-radius: 5px;
    border: 1.5px solid #000000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

#home-button {
    position: fixed;
    bottom: 70px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    background-color: white;
}

#home-mobile {
    margin-bottom: -3px;
    width: 35px;
    height: 35px;
}

#menu-button {
    position: fixed;
    bottom: 20px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    padding: 7.5px;
    background-color: white;
}

#menu-mobile {
    margin-bottom: -3px;
    width: 20px;
    height: 20px;
}
</style>
  
