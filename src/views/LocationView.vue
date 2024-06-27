<template>
  <div id="app">
    <div id="header" :style="headerStyle">
      <div id="icon-div">
        <img @click="goToAnotherPage" alt="Filer" class="icon" src="../assets/home.jpg">
      </div>
      <div id="picture-name">
        <div id="file-div" :style="fileDivStyle">
          <div id="file-upload">
            <label id="image-text"></label>
          </div>
        </div>
        <div id="name-description">
          <div class="name-description-input">
            <div id="name-stars">
              <label id="name">{{ name }}</label>
              <div class="stars">
                <span v-for="star in 5" :key="star" class="star" v-bind:class="{ 'filled': star <= sterne }">★</span>
              </div>
            </div>
          </div>
          <div class="name-description-input">
            <label id="description-short">{{ kurzbeschreibung }}</label>
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
        <div id="maps-div" style="height: 400px;">
          <!-- use openstreetmap here -->
        </div>
        <br>
        <div class="long-description">
          <label class="description">Bewertungen:</label>
          <DishForm v-if="id" :idFromFather="id" :typeOfReview="reviewType"/>
        </div>
      </div>
      <div id="right-side">
        <div id="right-side-info">
          <div id="info-bookmark">
            <label id="info-headline">Infos</label>
            <div id="div-bookmark">
              <img src="../assets/bookmark-white.jpg" id="bookmark">
            </div>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Stadt:</strong> {{ region }}</label>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Straße:</strong> {{ addresse }}</label>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Kapazität:</strong> {{ kapazitaet }} Personen</label>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Preis:</strong> {{ preis }} €/h</label>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Größe:</strong> {{ flaeche }} ha</label>
          </div>
          <div class="infos">
            <label class="info-subheadline"><strong>Open Air:</strong> {{ openair }}</label>
          </div>
        </div>
        <div id="ticket">
          Location buchen
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DishForm from '../components/ReviewComponent.vue';
import axios from 'axios';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    DishForm
  },
  data() {
    return {
      name: '',
      kurzbeschreibung: '',
      beschreibung: '',
      region: '',
      addresse: '',
      kapazitaet: '',
      preis: '',
      flaeche: '',
      openair: false,
      imagePreview: null,
      bild: null,
      sterne: '',
      map: null,
      marker: null,
      id:'',
      reviewType : 1

    };
  },

  async created() {
    let id = 23;
    try {
      const response = await axios.get(`/getLocation/${id}`);
      const dbLocation = response.data.rows[0];
      console.log(dbLocation);
      this.originalData = { ...dbLocation };
      this.setFormData(dbLocation);
      this.geocodeAddress();
      console.log('Location data received:', response.data);
    } catch (error) {
      console.error('Error with sending location ID to DB :', error);
    }
  },

  computed: {
    fileDivStyle() {
      return this.imagePreview
        ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};
    },
    headerStyle() {
      return {
        backgroundImage: `url(${this.imagePreview})`,
        backgroundSize: '340%',
        backgroundPosition: 'center center'
      };
    }
  },

  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    setFormData(data) {
      const myVar = data.adresse.split(',');
      console.log(myVar[0]);
      console.log(myVar[1]);

      this.name = data.name;
      this.kurzbeschreibung = data.kurzbeschreibung;
      this.beschreibung = data.beschreibung;
      this.region = myVar[1];
      this.addresse = myVar[0];
      this.kapazitaet = data.kapazitaet;
      this.preis = data.preis;
      this.flaeche = data.flaeche;
      if (data.openair == true) {
        this.openair = 'Ja';
      } else {
        this.openair = 'Nein';
      }

      this.imagePreview = data.bild;
      this.bild = data.bild;
      this.sterne = data.sterne;
      this.id = data.id;
    },

    goToAnotherPage() {
      this.$router.push('/search');
    },
    async geocodeAddress() {
      const address = `${this.addresse}, ${this.region}`;
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
    }
  }
};
</script>

<style scoped>
:root,
html,
body {
  width: 100%;
  height: 100%;
  background-color: rgb(242, 242, 242);
}

#header {
  position: relative;
  z-index: 0;
  padding-bottom: 40px;
  padding-top: 10px;
}

#header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: inherit; /* Nimmt das Hintergrundbild von #header */
  background-size: 400%;
  background-position: center center;
  filter: blur(10px);
  z-index: -1; /* Stellt sicher, dass das Pseudo-Element hinter den Kinderelementen liegt */
}

#icon-div,
#picture-name,
#file-div {
  position: relative; /* Stellt sicher, dass diese Elemente über dem gefilterten Hintergrund erscheinen */
  z-index: 1;
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
  background-color: white;
}

.icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

#name-description {
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
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -225px;
}

#file-upload label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

#file-upload input[type='file'] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

#main {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  background-color: rgb(242, 242, 242);
  padding-top: 30px;
  gap: 20px;
}

#left-side {
  margin-left: -20px;
}

.long-description {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  display: grid;
  justify-content: left;
  font-weight: bold;
}

#right-side-info {
  border-radius: 10px;
  background-color: white;
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

#long-description-text {
  width: 580px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  border-radius: 8px;
  resize: none;
  text-align: left;
  text-decoration: none;
  font-weight: lighter;
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
  background-color: white;
}

#info-headline {
  display: block; /* Als Block-Element anzeigen */
  text-align: left; /* Text links ausrichten */
  font-family: Arial, sans-serif; /* Schriftart festlegen */
  font-size: 18px; /* Schriftgröße festlegen */
  font-weight: bold;
}

#ticket {
  background-color: rgb(146, 208, 80);
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
}

#bookmark {
  width: 10px;
  height: 17px;
  margin-left: 2px;
}

#add-icon {
  width: 24px;
  height: 24px;
}

.long-description {
  border-radius: 10px;
  background-color: white;
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

.stars {
  margin-bottom: 10px;
}

.star {
  color: #ccc;
  font-size: 36px;
}

.star.filled {
  color: #f3c809;
}

#name-stars {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: left;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  max-width: 50%;
  max-height: 50%;
  margin-bottom: -10px; /* Adjust margin to bring the text closer */
  margin-left: 10px;
  margin-top: -10px;
}
</style>
