<template>
  <div id="app">
        <Header :imagePreview="imagePreview" :name="name" :sterne="sterne" :kurzbeschreibung="kurzbeschreibung" />
    <div id="main">
      <div id="left-side">
        <div class="long-description">
          <label class="description">Beschreibung:</label>
          <div id="long-description-text">{{ beschreibung }}</div>
        </div>
        <div id="maps-div" style="height: 400px;">
          <!-- using openstreetmap here with maps-div :D -->
        </div>
        <br>
        <div class="long-description">
          <label class="description">Bewertungen:</label>
          <DishForm v-if="id" :idFromFather="id" :typeOfReview="reviewType"/>
        </div>
      </div>
      <div id="right-side">
        <div id="right-side-info">
              <Bookmark :isFavorite="false" :id="id" type="location" />
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
        <div id="ticket" @click="weiter" >
          <!-- create event or edit location button-->
          {{ buttonLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DishForm from '../components/ReviewComponent.vue';
import Bookmark from '../components/ViewPageBookmark.vue';
import Header from '../components/ViewHeader.vue';
import axios from 'axios';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    DishForm,
      Bookmark,
      Header,
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
      idSent: '',
      reviewType : 1,
      isOwner: ''

    };
  },

  async created() {
    this.idSent = this.$route.params.id;
    const token = localStorage.getItem('authToken');
    try {
      
      const response = await axios.get(`/getLocation/${this.idSent}`, {headers: {'auth':token}});
      console.log(response.data);
      this.setFormData(response.data);
      this.geocodeAddress();
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
    }, 
    buttonLabel() {
      return this.isOwner ? 'Edit Location' : 'Event Erstellen';
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
      const myVar = data['result'].rows[0].adresse.split(',');
      this.name = data['result'].rows[0].name;
      this.kurzbeschreibung = data['result'].rows[0].kurzbeschreibung;
      this.beschreibung = data['result'].rows[0].beschreibung;
      this.region = myVar[1];
      this.addresse = myVar[0];
      this.kapazitaet = data['result'].rows[0].kapazitaet;
      this.preis = data['result'].rows[0].preis;
      this.flaeche = data['result'].rows[0].flaeche;

      if (data['result'].rows[0].openair == true) {
        this.openair = 'Ja';
      } else {
        this.openair = 'Nein';
      }

      this.imagePreview = data['result'].rows[0].bild;     
      this.bild = data['result'].rows[0].bild;
      this.sterne = data['result'].rows[0].sterne;
      this.id = data['result'].rows[0].id;
      this.isOwner = data['isOwner'];
    },

    goToAnotherPage() {
      this.$router.push('/search');
    },
    async geocodeAddress() {
      const address = `${this.addresse}, ${this.region}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

      try {
        const response = await axios.get(url);
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
    weiter(){
      if(this.isOwner === false){
        this.$router.push('/createevent');
      } else{
        this.$router.push({ name : 'EditLocationType', params: {id : this.idSent}});
      }
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

.description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: bold;
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

