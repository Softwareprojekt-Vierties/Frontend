<template>
  <div id="DjView">
    <Header :imagePreview="imagePreview" :name="name" :sterne="sterne" :kurzbeschreibung="kurzbeschreibung" />
    <div id="main">
      <div id="left-side">
        <LongDescription :description="beschreibung" />
        <div id="event-dish">
          <div id="event" v-if="events.length > 0">
            <label class="description">Nächste Events:</label>
            <ArtistCard :eventsFromFather="events"/>
          </div>
          <div id="dish">
            <label class="description">Playlist:</label>
            <DJ  :songs="songs"/>
          </div>
        </div>
        <br>
        <div class="long-description">
          <label class="description">Bewertungen:</label>
          <DishForm v-if="userId" :idFromFather="userId" :typeOfReview="reviewType"/>
          <div id="newcomment" @click="togglePopup">
            <div id="newcomment-text">
              Kommentar hinzufügen:
            </div>
            <img id="newcomment-img" src="../assets/plus.png">
          </div>
        </div>
      </div>
      <div id="right-side">
        <Info v-model:hasBookmark="hasBookmark" type="caterer" :region="region" :category="kategorie" :experience="erfahrung" :price="preis" />
        <div id="ticket" @click="weiter">
          {{ buttonLabel }}
        </div>
      </div>
    </div>
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <span class="close-button" @click="togglePopup">&times;</span>
        <CommentComponent v-if="userId" :idFromFather="userId" :typeOfReview="kindOfReview"/>
      </div>
    </div>
  </div>
</template>

  
<script>
import DishForm from '../components/ReviewComponent.vue';
import ArtistCard from '../components/ArtistCardComponent.vue';
import DJ from '../components/DjComponent.vue';
import Header from '../components/ViewHeader.vue';
import LongDescription from '../components/LongDescription.vue';
import Info from '../components/RightSideInfo.vue';
import axios from 'axios'; 
import CommentComponent from '../components/CommentComponent.vue'

export default {
  components: {
    DishForm,
    ArtistCard,
    DJ,
    Header,
    LongDescription,
    Info,
    CommentComponent
  },
  data() {
    return {
      name: '',
      sterne: '',
      kurzbeschreibung: '',
      beschreibung: '',
      region: '',
      kategorie: '',
      erfahrung: '',
      preis: '',
      imagePreview: null,
      id: '',
      userId: '',
      reviewType: 0,
      events: [],
      songs: [],
      reviews: [],
      idSent: '',
      isOwner: '',
      hasBookmark: false,
      kindOfReview: 'user',
      showPopup: false // Popup anfangs nicht anzeigen
    };
  },
  computed: {
    buttonLabel() {
      return this.isOwner ? 'Edit DJ' : 'Event Erstellen';
    }
  },
  async created() {
    this.idSent = this.$route.params.id;
    console.log("here is the id received ->", this.idSent);
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.get(`/getArtistById/${this.idSent}`, { headers: { 'auth': token } });
      console.log(response.data);
      this.setFormData(response.data);
      console.log('dj data received:', response.data);
    } catch (error) {
     // console.log('Error with sending Caterer dj for dj page to DB :', error);
    }
  },
  methods: {
    setFormData(data) {
        const myVar = data['artist'].rows[0].region.split(',');
        console.log(myVar[0]);
        console.log(myVar[1]);
  
        this.name = data['artist'].rows[0].benutzername;
        this.kurzbeschreibung = data['artist'].rows[0].kurzbeschreibung;
        this.beschreibung = data['artist'].rows[0].beschreibung;
        this.region = myVar[1];
        this.kategorie = data['artist'].rows[0].kategorie;
        this.erfahrung = data['artist'].rows[0].erfahrung;
        this.preis = data['artist'].rows[0].preis;
        this.imagePreview = data['artist'].rows[0].profilbild;
        this.sterne = data['artist'].rows[0].sterne;
        this.userId = data['artist'].rows[0].userid;
        this.id = data['artist'].rows[0].id;
        this.events = data['events'].rows;
        this.isOwner = data['isOwner'];
        data['lieder'].rows.forEach(lied => {
          this.songs.push({
            id: lied['id'],
            songName: lied['name'],
            songLength: lied['laenge'],
            songYear: lied['erscheinung'].substring(0, 10)
          });
        });
      },
    goToAnotherPage() {
      this.$router.push('/search');
    },
    weiter() {
      if (this.isOwner === false) {
          this.$router.push({path: "/createEvent", query: {artist: this.id}});
      } else {
        this.$router.push({ name: 'EditDjType', params: { id: this.idSent } });
      }
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    submitComment() {
      // Logik zum Absenden des Kommentars hinzufügen
      console.log('Kommentar abgesendet');
      this.togglePopup();
    }
  }
}
</script>

  
<style scoped>
:root html, body {
  width: 100%;
  height: 100%;
  background-color: var(--create-page-background);
}

#DjView {
    min-height: 100vh;
    background-color: var(--create-page-background);
}

.description {
  text-align: left;
  font-size: 12px;
  margin-bottom: 3px;
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
  color: var(--textfield-font-color);
  padding: 10px;
  display: grid;
  justify-content: left;
  font-weight: bold;
}

#ticket {
  background-color: var(--green);
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

#event-dish {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

#event, #dish {
  border-radius: 10px;
  background-color: var(--textfield-background);
  color: var(--textfield-font-color);
  padding: 10px;
  display: grid;
  justify-content: left;
  font-weight: bold;
}

#newcomment {
  display: grid;
  grid-template-columns: auto;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

#newcomment-text {
  font-size: 10px;
  font-weight: normal;
}

#newcomment-img {
  cursor: pointer;
  margin-left: 40px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: var(--textfield-background);
  color: var(--textfield-font-color);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}
</style>
