<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img @click="goToAnotherPage" alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
          <img @click="goToAnotherPage" alt="Filer" class="icon" v-else src="../assets/home.jpg">
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
              <input v-model="name" class="header-input" type="text" placeholder="z.B. Campus Minden"><br>
            </div>
            <div class="name-description-input">
              <label class="description">Kurze Beschreibung hinzufügen:</label>
              <input v-model="kurzbeschreibung" class="header-input" type="text" placeholder="z.B. Minden">
            </div>
          </div>
        </div>
      </div>
  
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung hinzufügen:</label>
            <textarea v-model="beschreibung" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
          </div>
          <br>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <label id="info-headline">Infos hinzufügen:</label>
            <div class="infos">
              <label class="info-subheadline">Stadt:</label>
              <input v-model="region" class="input" type="text" placeholder="z.B. 32427 Minden">
            </div>
            <div class="infos">
              <label class="info-subheadline">Straße:</label>
              <input v-model="addresse" class="input" type="text" placeholder="z.B. Artilleriestraße 9">
            </div>
            <div class="infos">
              <label class="info-subheadline">Kapazität:</label>
              <input v-model="kapazitaet" class="input" type="text" placeholder="z.B. 50 Personen">
            </div>
            <div class="infos">
              <label class="info-subheadline">Preis:</label>
              <input v-model="preis" class="input" type="text" placeholder="z.B. 50€">
            </div>
            <div class="infos">
              <label class="info-subheadline">Größe:</label>
              <input v-model="flaeche" class="input" type="text" placeholder="z.B. 50 ha">
            </div>
            <div id="open-air">
              <label class="info-subheadline">Open Air:</label>
              <label class="switch"> <input v-model="openair" type="checkbox"> <span class="slider round"> </span> </label>
            </div>
          </div>
          <div id="buttons">
            <div id="break" @click="reset">
              zurücksetzen
            </div>
            <div id="continue" @click="editLocation">
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
    components: {
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
      bild:null,
      originalData: {}        

      };
    },

    async created(){
      let id = 59;
      try {
          const response = await axios.get(`/getLocation/${id}`);
          const dbLocation = response.data.rows[0];
          console.log(dbLocation);
          this.originalData = { ...dbLocation };
          this.setFormData(dbLocation);
          console.log('Location data received:', response.data);
        } catch (error) {
          console.error('Error with sending location ID to DB :', error);

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
        this.openair = data.openair;
        this.imagePreview = data.bild;
        this.bild = data.bild;
     },  
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.bild = file;
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      reset(){
        this.setFormData(this.originalData);
      },

      goToAnotherPage() {
        this.$router.push("/search");
      },

      async editLocation() {
        if (!this.name || !this.kurzbeschreibung || !this.beschreibung || !this.region || !this.addresse 
            || !this.kapazitaet || !this.preis || !this.flaeche || !this.bild) {
          alert('Please fill in all required fields.');
          return;
        }

        let formData = {};
            formData.name = this.name;
            formData.kurzbeschreibung = this.kurzbeschreibung;
            formData.beschreibung = this.beschreibung;
            formData.adresse =this.addresse + ',' + this.region;
            formData.kapazitaet = this.kapazitaet;
            formData.preis = this.preis;
            formData.flaeche = this.flaeche;
            formData.openair = this.openair;
            formData.bild = this.imagePreview;
            formData.locationid = this.originalData.id;
            formData.privat = true;
            console.log(formData);
            console.log("this ist sent to db");

        try {
          const response = await axios.post('/updateLoacation', formData);
          console.log('Location edited:', response.data);
          alert('Location edited successfully!');
          //this.reset();
        } catch (error) {
          console.error('Error with Location editing:', error);
          alert('Error editing location. Please try again.');
        }
      }
    }
  }
  </script>
  
  <style scoped>
@import "../css/editPages.css"
  </style>
  
