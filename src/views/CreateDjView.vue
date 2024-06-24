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
                    <input v-model="song.songYear" id="input" placeholder="z.B. Jahr: 2024">
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
          <div id="continue" @click="createDJ" >
            anlegen
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
      songs: [
        { songName: '', songLength: '', songYear: '' }
      ]
    };
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
      this.djName = '';
      this.shortDescription = '';
      this.longDescription = '';
      this.region = '';
      this.category = '';
      this.experience = '';
      this.price = '';
      this.imagePreview = null;
      this.uploadedImage = null;
      this.songs = [{ songName: '', songLength: '', songYear: '' }];
    },
    goToHomePage() {
      this.$router.push('/search');
    },
    async createDJ() {
      if (!this.djName || !this.shortDescription || !this.longDescription || !this.region || !this.category || !this.experience || !this.price || !this.uploadedImage) {
        alert('Please fill in all required fields.');
        return;
      }


      let formData = {};
        formData.benutzername = this.djName;
        formData.profilname = this.djName;
        formData.email = this.djName;
        formData.password = this.djName;
        formData.profilbild = this.imagePreview;
        formData.kurzbeschreibung = this.shortDescription;
        formData.beschreibung = this.longDescription;
        formData.region = this.region;
        formData.preis = this.price;
        formData.kategorie = this.category;
        formData.erfahrung = this.experience;
        formData.songs = this.songs;

        console.log('FormData:', formData); 


      //const token = localStorage.getItem('authToken'); 

      try {
          const response = await axios.post('/createArtist', formData);
          console.log('Artist created:', response.data);
          alert('Artist created successfully!');
          this.reset();
        } catch (error) {
          console.error('Error with Artist creation:', error);
          alert('Error creating Artist. Please try again.');
        }
    }
  }
}
</script>


<style scoped>
@import "../css/createPages.css"
</style>
