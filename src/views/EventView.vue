<template>
    <div id="app">

      <div id="header">
        <div id="icon-div">
          <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
          <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
        </div>
        <div id="picture-name">
          <div id="file-div"><img :src="imagePreview" alt="eventImage"> </div>
          <div id="name-description">
            <div class="name-description-input">
              <label id="name">{{ eventName }}</label>
            </div>
            <div class="name-description-input">
              <label id="description-short">{{kurzbeschreibung}}</label>
            </div>
          </div>
        </div>
      </div>
  
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung:</label>
            <div id="long-description-text">{{ beschreibung }}</div>
          </div>
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
          <div id="right-side-info">
            <div id="info-bookmark">
                <label id="info-headline">Infos</label>
                <div id="div-bookmark">
                  <img v-if="isFavorit && isDarkMode" src="../assets/bookmark-filled.png" id="bookmark">
                  <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
                  <img v-else-if="isFavorit" src="../assets/bookmark-gray.jpg" id="bookmark">
                  <img v-else src="../assets/bookmark-white.jpg" id="bookmark">
                </div>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Location:</strong> {{ location }}</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Datum:</strong> {{ formattedEventDate }}</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Zeit:</strong> {{ zeit }} Uhr</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Eventgröße:</strong> {{anzahlPersonen }} Personen</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Preis:</strong> {{preis}}€</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Altersfreigabe:</strong> {{alter}}+</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Open Air:</strong> {{openAir}}</label>
            </div>
          </div>
          <div id="ticket">
            Event buchen 
          </div>

        </div>
</template>
  
  <script>

  import DishForm from '../components/EventComponenet.vue';
  import axios from 'axios';
  import Leaflet from 'leaflet';
  import 'leaflet/dist/leaflet.css';


  export default {
    components: {
      DishForm,
        Bookmark,
        Header,
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

      let id = 44;
      const response = await axios.get(`/getEventById/${id}`)
      console.log(response.data);
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
        this.zeit = data.event.rows[0].uhrzeit;
        this.location = data.event.rows[0].locationname;
        this.anzahlPersonen = data.event.rows[0].eventgroesse;
        this.datum = data.event.rows[0].datum;
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






        /* this.kurzbeschreibung : '',
        this.beschreibung : '',
        this.location : '',
        this.datum : '',
        this.zeit : '',
        this.anzahlPersonen : '',
        this.preis : '',
        this.alter : '',
        this.openAir : '',
        this.imagePreview : null,  */
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
    // Muda o currentIndex para mostrar os próximos três providers, sem ultrapassar o tamanho do array
    if (this.currentIndex + 3 < this.combinedProviders.length) {
      this.currentIndex += 3;
    }
  },
  previousProvider() {
    // Muda o currentIndex para mostrar os três providers anteriores, sem ir abaixo de zero
    if (this.currentIndex - 3 >= 0) {
      this.currentIndex -= 3;
    }
  }



    }

  }
  </script>
  
  <style scoped>

  #header {
    background-color: var(--create-page-header-background);
    padding-bottom: 40px;
    padding-top: 10px;
  }
  
  #picture-name {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: end;
    gap: 20px;
  }
  
  #icon-div {
    width: 40px;
    padding: 15px;
    padding-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    cursor: pointer;
    background-color: var(--textfield-background);
    margin-left: 10px;
  }
  
  .icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
  } 

  .other-provider{
    cursor: pointer;
  }
  
  #name-description {
    background-color: var(--create-page-header-background);
    padding: 10px;
  }

  #name {
    text-align: left;
    font-size: 35px;
    color: white;
    margin-bottom: 10px;
  }

  #description-short {
    text-align: left;
    font-size: 18px;
    color: white;
    margin-bottom: -10px;
  }
  
  .name-description-input {
    display: grid;
    grid-template-columns: 300px;
    justify-content: left;
  }
  
  .description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: bold;
  }
  
  #file-div {
    width: 250px;
    height: 180px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    background-color: var(--textfield-background);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -225px;
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
  
  .long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
    display: grid;
    justify-content: left;
    font-weight: bold;
  }
  
  #right-side-info {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
  }
  
  .infos {
    display: grid;
    margin-top: 20px;
    margin-right: 10px;
  }
  
  .time-value-left {
    width: 71.9px;
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    margin-right: 5px;
  }
  
  .time-value-right {
    width: 71.9px;
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    margin-left: 5px;
  }
  
  .info-subheadline {
    text-align: left;
    font-size: 12px;
  }

  .description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
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
  
  #add-location-icon {
    width: 25px;
    height: 25px;
    margin-top: 4px;
  }
  
  #add-location {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    cursor: pointer;
    background-color: var(--textfield-background);
  }
  
  #info-headline {
    display: block; /* Als Block-Element anzeigen */
    text-align: left; /* Text links ausrichten */
    font-family: Arial, sans-serif; /* Schriftart festlegen */
    font-size: 18px; /* Schriftgröße festlegen */
    font-weight: bold;
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

  #addcreator {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  padding: 20px 0;
  margin-top: -25px;
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

.long-description {
  border-radius: 10px;
    background-color: var(--textfield-background);
  padding: 10px;
  display: grid;
  grid-template-columns: 580px;
  justify-content: left;
  font-weight: bold;
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
  
