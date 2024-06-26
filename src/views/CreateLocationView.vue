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

#name-description {
  border-radius: 10px;
  background-color: var(--textfield-background);
  padding: 10px;
}

.name-description-input {
  display: grid;
  grid-template-columns: 300px;
  justify-content: left;
}

.header-input {
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  text-align: center;
  background-color: var(--textfield-background);
  color: var(--textfield-font-color);
}

.header-input::placeholder {
    color: var(--placeholder-color);
}

.description {
  text-align: left;
  font-size: 12px;
  margin-bottom: 3px;
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

.upload-icon {
  max-width: 50%;
  max-height: 50%;
  margin-bottom: -10px; /* Adjust margin to bring the text closer */
  margin-left: 10px;
  margin-top: -10px;
}

#upload-text {
  color: var(--upload-text-color);
  margin-top: 0; /* Remove any top margin to bring it closer to the image */
}

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
  </style>
  
