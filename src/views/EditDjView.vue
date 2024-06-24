<template>
  <div id="app">
    <div id="header">
      <div id="icon-div">
        <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png" @click="goToHomePage">
        <img alt="Filer" class="icon" v-else src="../assets/home.jpg" @click="goToHomePage">
      </div>
      <div id="picture-name">
        <div id="file-div" :style="fileDivStyle">
          <div id="file-upload">
            <label id="image-text" for="fileToUpload">
              <img v-if="!imagePreview && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
              <img v-else-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
              <span id="upload-text" v-if="!imagePreview">Bild hochladen</span>
            </label>
            <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChange">
          </div>
        </div>
        <div id="name-description">
          <div class="name-description-input">
            <label class="description">Name:</label>
            <input v-model="djName" class="header-input" type="text" placeholder="z.B. Name"><br>
          </div>
          <div class="name-description-input">
            <label class="description">Kurze Beschreibung hinzufügen:</label>
            <input v-model="shortDescription" class="header-input" type="text" placeholder="z.B. 24/7">
          </div>
        </div>
      </div>
    </div>

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
            <label class="info-subheadline">Region:</label>
            <input v-model="region" class="input" type="text" placeholder="z.B. 32427 Minden">
          </div>
          <div class="infos">
            <label class="info-subheadline">Kategorie:</label>
            <input v-model="category" class="input" type="text" placeholder="z.B. Rap">
          </div>
          <div class="infos">
            <label class="info-subheadline">Erfahrung:</label>
            <input v-model="experience" class="input" type="text" placeholder="z.B. 10 Jahre">
          </div>
          <div class="infos">
            <label class="info-subheadline">Preis:</label>
            <input v-model="price" class="input" type="text" placeholder="z.B. 50€">
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
import axios from 'axios'; 

export default {
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
      originalData : {}
    };
  },

  async created(){
    let id = 13;
      try {
          const response = await axios.get(`/getArtistById/${id}`);
          console.log(response);
          this.originalData = { ...response.data };
          this.setFormData(response.data);
          console.log('dj data received:', response.data);
      } catch (error) {
          console.error('Error with sending dj ID to DB :', error);
        }
    },

  computed: {
    fileDivStyle() {
      return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
    },
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
      formData.preis = this.price;
      formData.email = this.email;
      formData.profilbild = this.imagePreview;
      formData.songs = this.songs;
      console.log('FormData:', formData); 

      //const token = localStorage.getItem('authToken'); 

      try {
        const response = await axios.post('/updateArtist', formData);
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
@import "../css/editPages.css"
</style>
