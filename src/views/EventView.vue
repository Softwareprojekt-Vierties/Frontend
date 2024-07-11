<template>
    <div id="EventView">
      <Header :imagePreview="imagePreview" :name="eventName" :sterne=-1 :kurzbeschreibung="kurzbeschreibung"/>

      <div id="main">
        <div id="left-side">
            <LongDescription :description="beschreibung" />
          <br>
          <div class="long-description">
          <label class="description">Dienstleister:</label>
            <div id="artist">
              <img class="other-provider" src="../assets/left.jpg" width="20px" height="20px" @click="previousProvider">
              <div id="dish-container">
                <DishForm
                  v-for="(provider, index) in currentProviders"
                  :key="index"
                  :componentName="provider.nameCaterer || provider.nameArtist"
                  :imagePath="provider.imageCaterer || provider.imageArtist"
                />

              </div>
              <img class="other-provider" src="../assets/right.jpg" width="20px" height="20px" @click="nextProvider">
            </div>
        </div>
        <div id="maps-div" style="height: 400px;">
        </div>
        </div>
        <div id="right-side">
            <Info v-model:hasBookmark="hasBookmark" type="events" :location="location" :date="formattedEventDate" :startTime="zeit" :endTime="endzeit" :price="preis" :ageLimit="alter" :openAir="openAir" />
            <div v-if="!isOwner" id="ticket" 
              :class="{ 'disabled': hasTickets || isOwner }"  
              :style="{ 'cursor': (hasTickets || isOwner) ? 'not-allowed' : 'pointer' }"
              @click="bookEvent">
              Event buchen ({{freietickets }}/{{ maxtickets }})
            </div>
            <div v-if="isOwner" id="ticket" @click="$router.push(`/editEvent/${$route.params.id}`)">
              Bearbeiten
            </div>
        </div>
        </div>
      </div>
</template>
  
  <script>

  import DishForm from '../components/EventComponenet.vue';
  import axios from 'axios';
  import Leaflet from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import Header from '../components/ViewHeader.vue';
  import LongDescription from '../components/LongDescription.vue';
  import Info from '../components/RightSideInfo.vue';

  export default {
    components: {
      DishForm,
        Header,
        LongDescription,
        Info,
    },

    data(){
        return{
          eventName:'',
          kurzbeschreibung : '',
          beschreibung : '',
          location : '',
          datum : '',
          zeit : '',
          endzeit:'',
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
          hasTickets:'',
          combinedProviders: [],
          hasBookmark: false,
          id : '',
          isOwner : '',
          maxtickets : '',
          freietickets : ''
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

      setFormData(data){
        this.maxtickets = data.event.rows[0].maxtickets,
        this.freietickets = data.event.rows[0].freietickets,
        this.eventName = data.event.rows[0].name;
        let endzeit1 = data.event.rows[0].enduhrzeit.split(":");
        this.endzeit = endzeit1[0]+":"+endzeit1[1];
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
        this.hasTickets = data.hasTicket;
        console.log("hasTicket->",this.hasTickets);
        this.id = data.event.rows[0].id;
        this.isOwner = data.isOwner
        console.log("owner->",this.isOwner);
          this.hasBookmark = data.event.rows[0].favorit;
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
 
  .description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: bold;
  }

#EventView {
    width: 100vw;
    height: 100vh;
    background-color: var(--create-page-background);
}
  
  #main {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    background-color: var(--create-page-background);
    padding-top: 30px;
    gap: 20px;
  }

  #left-side {
    margin-left: -20px;
  }

  .disabled {
    background-color: grey !important;
    pointer-events: none;
  }
  
  .long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
    display: grid;
    justify-content: left;
    font-weight: bold;
  }
  
  #long-description-text {
    width: 580px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    border-radius: 8px;
    resize: none;
    text-align: left;
    text-decoration: none;
    font-weight: lighter;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
  }
  
  #ticket {
    background-color: var(--green);
    color: var(--simple-font-color);
    height: 30px;
    border-radius: 7px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 10px;
  }

.dish-item {
  display: inline-block;
  margin-right: 10px;
  flex: 0 0 auto;
  margin-left: 10px;
}

#add-icon {
  width: 24px;
  height: 24px;
}

#dish-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

#artist {
  display: flex;
  grid-template-columns: auto auto auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

#maps {
  border-radius: 8px;
}

#maps-div {
  border: 1px solid #000000;
  border-radius: 8px;
  margin-top: 15px;
}
  </style>
  
