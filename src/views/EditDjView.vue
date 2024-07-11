<template>
  <div id="app">
      <Header :isLoggedIn="true" v-model:name="djName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />

    <div id="main">
      <div id="left-side">
        <div class="long-description">
          <label class="description">Beschreibung hinzufügen:</label>
          <textarea v-model="longDescription" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
        </div>
        <br>
        <div class="long-description">
          <label class="description">Playlist:</label>
          <div id="addcreator" ref="addCreator" class="scroll-container">
            <div class="dish-container">
              <div v-for="(song, index) in songs" :key="index" class="dish-item">
                <div id="dish-form">
                  <div id="right">
                    <div id="text">Lied:</div>
                    <input v-model="song.songName" id="input" placeholder="z.B. Party-Song">
                    <div id="ingredients">Infos:</div>
                    <input v-model="song.songLength" id="input" placeholder="z.B. Länge: 3,41 min">
                    <input v-model="song.songYear" id="input" placeholder="z.B. Jahr: 06-12-2024">
                  </div>
                </div>
              </div>
              <div class="add-dish-button" @click="addSong"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-side">
        <div id="right-side-info">
          <label id="info-headline">Infos hinzufügen:</label>
          <div class="infos">
            <label class="info-subheadline">Addresse:</label>
            <input v-model="region" class="input" type="text" placeholder="z.B. 32427 Minden">
          </div>
          <div class="infos">
            <label class="info-subheadline">Kategorie:</label>
            <input v-model="category" class="input" type="text" placeholder="z.B. Rap">
          </div>
          <div class="infos">
            <label class="info-subheadline">Erfahrung:</label>
            <input v-model="experience" class="input" type="number" min ="0" placeholder="z.B. 10 Jahre">
          </div>
          <div class="infos">
            <label class="info-subheadline">Preis:</label>
            <input v-model="price" class="input" type="number" min="0" placeholder="z.B. 50€">
          </div>
        </div>
        <div id="buttons">
          <div id="break" @click="reset">
            zurücksetzen
          </div>
          <div id="continue" @click="updateDJ" >
            aktualisieren
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
  
<script>
import Header from '../components/EditHeader.vue';
import axios from 'axios'; 

export default {
    components: {
        Header,
    },
  data() {
    return {
      djName: '',
      shortDescription: '',
      longDescription: '',
      region: '',
      category: '',
      experience: '',
      price: '',
      imagePreview: null,
      uploadedImage: null,
      email:'',
      songs: [
        { id: '', songName: '', songLength: '', songYear: '' }
      ],
      originalData : {},
      id:''
    };
  },

  async created(){
    this.id = this.$route.params.id;
    const token = localStorage.getItem('authToken'); 

      try {
          const response = await axios.get(`/getArtistById/${this.id}`,{headers: {'auth':token}});
          console.log(response);
          this.originalData = { ...response.data };
          this.setFormData(response.data);
          console.log('dj data received:', response.data);
      } catch (error) {
          console.error('Error with sending dj ID to DB :', error);
        }
    },

  computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
  },

  methods: {
    setFormData(data) {
      this.djName = data['artist'].rows[0].benutzername;
      this.shortDescription = data['artist'].rows[0].kurzbeschreibung;
      this.longDescription = data['artist'].rows[0].beschreibung ;
      this.region = data['artist'].rows[0].region;
      this.category = data['artist'].rows[0].kategorie;
      this.experience =  data['artist'].rows[0].erfahrung;
      this.price = data['artist'].rows[0].preis;
      this.imagePreview = data['artist'].rows[0].profilbild;
      this.uploadedImage = data['artist'].rows[0].profilbild;
      this.email = data['artist'].rows[0].emailfk;
      this.songs = []; // use empty Array to remove example container
      data['lieder'].rows.forEach(lied => {
        this.songs.push({
          id: lied['id'],
          songName: lied['name'], 
          songLength: lied['laenge'], 
          songYear: lied['erscheinung'].substring(0, 10)
        })
      });
    },

    async updateDJ() {
      if (!this.djName || !this.shortDescription || !this.longDescription || !this.region || !this.category || !this.experience || !this.price || !this.uploadedImage) {
          alert('Please fill in all required fields.');
          return;
      }

      let formData = {};
      formData.profilname = this.djName;
      formData.kurzbeschreibung = this.shortDescription;
      formData.beschreibung = this.longDescription;
      formData.region = this.region;
      formData.kategorie = this.category;
      formData.erfahrung = this.experience;
      formData.preis = +this.price;
      formData.email = this.email;
      formData.profilbild = this.imagePreview;
      formData.songs = this.songs;
      formData.id = this.id;
      console.log('FormData:', formData); 

      const token = localStorage.getItem('authToken'); 

      try {
        const response = await axios.post('/updateArtist', formData, {headers: {'auth':token}});
        console.log('Artist updated:', response.data);
        alert('Artist updated successfully!');
      } catch (error) {
        console.error('Error with Artist update:', error);
        alert('Error with Artist update. Please try again.');
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = file;
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addSong() {
        this.songs.push({ songName: '', songLength: '', songYear: '' });
    },
    removeSong(index) {
        this.songs.splice(index, 1);
    },
    reset() {
      this.djName = this.originalData["artist"].rows[0]["benutzername"];
      this.shortDescription =this.originalData["artist"].rows[0]["kurzbeschreibung"];
      this.longDescription = this.originalData["artist"].rows[0]["beschreibung"] ;
      this.region = this.originalData["artist"].rows[0]["region"];
      this.category = this.originalData["artist"].rows[0]["kategorie"];
      this.experience =  this.originalData["artist"].rows[0]["erfahrung"];
      this.price = this.originalData["artist"].rows[0]["preis"];
      this.imagePreview = this.originalData["artist"].rows[0]["profilbild"];
      this.uploadedImage = this.originalData["artist"].rows[0]["profilbild"];
      this.email = this.originalData["artist"].rows[0]["emailfk"];
      this.songs  =[];
      this.originalData["lieder"].rows.forEach(lied => {
        this.songs.push({
          id: lied['id'],
          songName: lied['name'], 
          songLength: lied['laenge'], 
          songYear: lied['erscheinung'].substring(0, 10)
        })
      });
    },
    goToHomePage() {
        this.$router.push('/search');
    }
  }
}
</script>

<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 40px; /* Angepasst an die neue Höhe */
    height: 20px;
    margin-left: 20px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
    margin-left: 70px;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--slider-background-color);
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 20px; /* Angepasst an die neue Höhe */
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px; /* Angepasst an die neue Höhe */
    width: 16px; /* Angepasst an die neue Höhe */
    left: 2px; /* Angepasst an die neue Höhe */
    bottom: 2px; /* Angepasst an die neue Höhe */
    background-color: var(--create-page-background);
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--cyan);
}

input:focus + .slider {
    box-shadow: 0 0 1px var(--cyan);
}

input:checked + .slider:before {
    -webkit-transform: translateX(20px); /* Angepasst an die neue Höhe */
    -ms-transform: translateX(20px); /* Angepasst an die neue Höhe */
    transform: translateX(20px); /* Angepasst an die neue Höhe */
}

#main {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    background-color: var(--create-page-background);
    padding-top: 30px;;
    gap: 20px;
}

.long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    padding: 10px;
    display: grid;
    grid-template-columns: 580px;
    justify-content: left;
    font-weight: bold;
}

.long-description::placeholder {
    color: var(--placeholder-color);
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

.infos {
    display: grid;
    grid-template-columns: 180px;
    margin-top: 20px;
}

.time-value-left {
    width: 71.9px;
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    margin-right: 5px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

.time-value-left::placeholder {
    color: var(--placeholder-color);
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
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

.time-value-right::placeholder {
    color: var(--placeholder-color);
}

.info-subheadline {
    text-align: left;
    font-size: 12px;
    overflow: hidden;
}

.input {
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

.input::placeholder {
    color: var(--placeholder-color);
}

#long-description-input {
    width: 558px;
    height: 398px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 10px;
    border: 1px solid #000000;
    border-radius: 8px;
    resize: none;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

#long-description-input::placeholder {
    color: var(--placeholder-color);
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
    color: var(--textfield-font-color);
}

#add-location::placeholder {
    color: var(--placeholder-color);
}

#info-headline {
    display: block; /* Als Block-Element anzeigen */
    text-align: left; /* Text links ausrichten */
    font-family: Arial, sans-serif; /* Schriftart festlegen */
    font-size: 14px; /* Schriftgröße festlegen */
    font-weight: bold;
}

#open-air {
    display: block;
    text-align: left;
    margin-top: 20px;
}

#buttons {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 15px;
    color: var(--simple-font-color);
}

#break {
    background-color: var(--red);
    width: 88px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

#continue {
    background-color: var(--green);
    width: 88px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

#addcreator {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    align-items: center;
    padding: 20px 0;
}

.dish-item {
    display: inline-block;
    margin-right: 10px;
    flex: 0 0 auto;
}

.add-dish-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 50px;
    height: 50px;
}

#add-icon {
    width: 24px;
    height: 24px;
}

.dish-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

footer {
    background-color: var(--create-page-background);
}

#dish-form {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 12px;
    padding-top: 7px;
    padding-bottom: 10px;
    padding-right: 12px;
    margin-left: 5px;
}

.upload-icon {
    max-width: 50%;
    max-height: 50%;
    margin-bottom: -10px; /* Adjust margin to bring the text closer */
    margin-left: 5px;
    margin-top: -5px;
}

#right {
    display: grid;
    grid-template-columns: auto;
}

#text {
    text-align: left;
    font-size: 11px;
    margin-top: 5px;
}

#input {
    width: 130px;
    border-radius: 5px;
    border: 1px solid #000;
    margin-top: 5px;
    font-size: 10px;
    padding: 3px;
    padding-left: 10px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

#input::placeholder {
    color: var(--placeholder-color);
}

#ingredients {
    text-align: left;
    font-size: 10px;
    margin-top: 5px;
    border-top: 1px solid rgb(200, 200, 200);
    padding-top: 5px;
}

#addcreator {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    align-items: center;
    padding: 20px 0;
}

.dish-item {
    display: inline-block;
    margin-right: 10px;
    flex: 0 0 auto;
}

.add-dish-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 50px;
    height: 50px;
}

#add-icon {
    width: 24px;
    height: 24px;
}

.dish-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

#dish-form {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 12px;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-right: 15px;
    margin-left: 5px;
}

#file-div-comp {
    width: 120px;
    height: 108px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    background-color: var(--textfield-background);
}

#file-upload {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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

#file-upload input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.upload-icon-comp {
    max-width: 50%;
    max-height: 50%;
    margin-bottom: -10px; /* Adjust margin to bring the text closer */
    margin-left: 5px;
    margin-top: -5px;
}

#upload-text-comp {
    color: rgb(209, 209, 209);
    padding-top: 5px;
    font-size: 7px;
}

#right {
    display: grid;
    grid-template-columns: auto;
}

#text-component {
    text-align: left;
    font-size: 11px;
    margin-top: 5px;
}

.input-comp {
    width: 130px;
    border-radius: 5px;
    border: 1px solid #000;
    margin-top: 5px;
    font-size: 10px;
    padding: 3px;
    padding-left: 10px;
}

#ingredients {
    text-align: left;
    font-size: 10px;
    margin-top: 5px;
    border-top: 1px solid rgb(200, 200, 200);
    padding-top: 5px;
}

#app {
    min-height: 100vh;
    background-color: var(--create-page-background);
}
</style>
