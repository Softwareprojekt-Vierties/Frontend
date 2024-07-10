<template>
  <div id="app">
        <Header :imagePreview="imagePreview" :name="name" :sterne="sterne" :kurzbeschreibung="kurzbeschreibung" />
    <div id="main">
      <div id="left-side">
          <LongDescription :description="beschreibung" />
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
            <Info v-model:hasBookmark="hasBookmark" type="location" :city="region" :address="addresse" :capacity="kapazitaet" :price="preis" :locationSize="flaeche" :openAir="openAir" />
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
import Header from '../components/ViewHeader.vue';
import LongDescription from '../components/LongDescription.vue';
import Info from '../components/RightSideInfo.vue';
import axios from 'axios';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  components: {
    DishForm,
      Header,
      LongDescription,
      Info,
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
      isOwner: '',
        hasBookmark: false,
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
        this.hasBookmark = data.result.rows[0].favorit;

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
          this.$router.push({path: "/createEvent", query: {location: this.id}});
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

.description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
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

#maps {
  border-radius: 8px;
}

#maps-div {
  border: 1px solid #000000;
  border-radius: 8px;
  margin-top: 15px;
}
</style>
