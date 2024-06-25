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
              <input v-model="locationName" class="header-input" type="text" placeholder="z.B. Campus Minden"><br>
            </div>
            <div class="name-description-input">
              <label class="description">Kurze Beschreibung hinzufügen:</label>
              <input v-model="smallDescription" class="header-input" type="text" placeholder="z.B. Minden">
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
              <input v-model="address" class="input" type="text" placeholder="z.B. Artilleriestraße 9">
            </div>
            <div class="infos">
              <label class="info-subheadline">Kapazität:</label>
              <input v-model="quantityPersons" class="input" type="text" placeholder="z.B. 50 Personen">
            </div>
            <div class="infos">
              <label class="info-subheadline">Preis:</label>
              <input v-model="price" class="input" type="text" placeholder="z.B. 50€">
            </div>
            <div class="infos">
              <label class="info-subheadline">Größe:</label>
              <input v-model="size" class="input" type="text" placeholder="z.B. 50 ha">
            </div>
            <div id="open-air">
              <label class="info-subheadline">Open Air:</label>
              <label class="switch"> <input v-model="openAir" type="checkbox"> <span class="slider round"> </span> </label>
            </div>
          </div>
          <div id="buttons">
            <div id="break" @click="reset">
              zurücksetzen
            </div>
            <div id="continue" @click="createLocation">
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

      locationName: '',
      smallDescription: '',
      longDescription: '',
      region: '',
      address: '',
      quantityPersons: '',
      price: '',
      size: '',
      openAir: false,
      imagePreview: null,
      eventImage:null        

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
          this.eventImage = file;
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      reset(){
        this.locationName = '';
        this.smallDescription = '';
        this.longDescription = '';
        this.region = '';
        this.address = '';
        this.quantityPersons = '';
        this.price = '';
        this.size = '';
        this.openAir = false;
        this.imagePreview = null;
        this.eventImage = null;
        console.log("values turned into default");
      },

      goToAnotherPage() {
        this.$router.push("/search");
      },

      async createLocation() {
        if (!this.locationName || !this.smallDescription || !this.longDescription || !this.region || !this.address 
            || !this.quantityPersons || !this.price || !this.size || !this.eventImage) {
          alert('Please fill in all required fields.');
          return;
        }

          let formData = {};
        formData.name = this.locationName;
        formData.kurzbeschreibung = this.smallDescription;
        formData.beschreibung = this.longDescription;
        formData.region = this.region;
        formData.adresse = this.address;
        formData.kapazitaet = this.quantityPersons;
        formData.preis = this.price;
        formData.flaeche = this.size;
        formData.openair = this.openAir;
        formData.bild = this.imagePreview;
        console.log('FormData:', formData); 

        try {
          const response = await axios.post('/createLocation', formData);
          console.log('Location created:', response.data);
          alert('Location created successfully!');
          this.reset();
        } catch (error) {
          console.error('Error with Location creation:', error);
          alert('Error creating location. Please try again.');
        }
      }
    }
  }
  </script>
  
  <style scoped>
@import "../css/createPages.css"
  </style>
  
