<template>
    <div id="app">
        <MobileHeaderComponent></MobileHeaderComponent>
        <div>
            <div id="info-bookmark">
                <div id="info-headline">Infos</div>
                <div id="div-bookmark" @click="changeBookmark">
                    <img v-if="isDarkMode && hasBookmark" src="../assets/bookmark-filled.png" id="bookmark">
                    <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
                    <img v-else-if="hasBookmark" src="../assets/bookmark-white.jpg" id="bookmark">
                    <img v-else src="../assets/bookmark-gray.jpg" id="bookmark">
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-left">
                <pre>
Location: Campus Minden

Datum: 17.8.2024

Zeit: 19 Uhr – 2Uhr

Eventgröße: 50 Personen
                </pre>
            </div>
            <div id="info-right">
                <pre>
Preis: 10 €

Altersfreigabe: 18+

Open Air: Nein
                </pre>
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Beschreibung:
            </div>
        </div>
        <div id="description-div">
            <div id="description">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Diesteleister:
            </div>
        </div>
        <div id="event-container">
            <MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/><MobileEventComponent/>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Karte:
            </div>
            <div id="maps-div" style="height: 200px;"></div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileHeaderComponent from '@/components/MobileHeaderComponent.vue';
import MobileEventComponent from '@/components/MobileEventComponent.vue';

export default {
    components: {
        MobileHeaderComponent,
        MobileEventComponent
    },

    data(){
        return{
            eventName:'',
            kurzbeschreibung : '',
            beschreibung : '',
            location : '',
            datum : '',
            zeit : '',
            anzahlPersonen : '',
            preis : '',
            alter : '',
            openAir : '',
            imagePreview : null,
            artists: [],
            caterers : [],
            adresse : '',
            map: null,
            marker : null,
            currentIndex: 0,
            combinedProviders: []
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
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }, 
        formattedEventDate() {
                return this.formatDate(this.datum);
        }, 
        currentProviders() {
            return this.combinedProviders.slice(this.currentIndex, this.currentIndex + 3);
        }
    },

    methods: {
        setFormData(data){
            this.eventName = data.event.rows[0].name;
            this.kurzbeschreibung = data.event.rows[0].kurzbeschreibung;
            this.imagePreview = data.event.rows[0].bild;
            this.beschreibung = data.event.rows[0].beschreibung;
            this.kurzbeschreibung = data.event.rows[0].kurzbeschreibung;
            this.preis = data.event.rows[0].preis;
            this.alter = data.event.rows[0].altersfreigabe;
            let time = data.event.rows[0].startuhrzeit.split(":");
            this.zeit = time[0]+":"+time[1];
            this.location = data.event.rows[0].locationname;
            this.anzahlPersonen = data.event.rows[0].eventgroesse;
            this.datum = data.event.rows[0].datum;
            let openair = data.event.rows[0].openair;

            if(openair === true){
                this.openAir = "Ja";
            } else{
                this.openAir = "Nein";
            }

            this.addresse = data.event.rows[0].adresse;

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

#info-headline {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
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

#bookmark {
    width: 10px;
    height: 17px;
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
}
</style>
  
