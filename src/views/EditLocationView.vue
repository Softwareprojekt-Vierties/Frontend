<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img @click="goToAnotherPage" alt="Filer" class="icon" src="../assets/home.jpg">
        </div>
        <div id="picture-name">
          <div id="file-div" :style="fileDivStyle">
            <div id="file-upload">
              <label id="image-text" for="fileToUpload">
                <img v-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
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

        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('kurzbeschreibung', this.kurzbeschreibung);
        formData.append('beschreibung', this.beschreibung);
        formData.append('region', this.region);
        formData.append('addresse', this.addresse);
        formData.append('kapazitaet', this.kapazitaet);
        formData.append('preis', this.preis);
        formData.append('flaeche', this.flaeche);
        formData.append('openair', this.openair);
        formData.append('bild', this.bild);
        console.log('FormData:', Array.from(formData.entries())); 

        try {
          const response = await axios.post('/updateLocation', formData);
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
  :root html, body {
    width: 100%;
    height: 100%;
    background-color: rgb(242, 242, 242);
  }
  
  #header {
    background-color: rgb(213, 213, 213);
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
    background-color: white;
    margin-left: 10px;
  }
  
  .icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  
  #name-description {
    border-radius: 10px;
    background-color: white;
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
    background-color: white;
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
    color: #999999;
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
    background-color: #ccc;
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
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: rgb(0, 217, 217);
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px rgb(0, 217, 217);
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
    background-color: rgb(242, 242, 242);
    padding-top: 30px;;
    gap: 20px;
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
  
  #right-side-info {
    border-radius: 10px;
    background-color: white;
    padding: 10px;
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
  
  .input {
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
  }
  
  #long-description-input {
    width: 558px;
    height: 380px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 10px;
    border: 1px solid #000000;
    border-radius: 8px;
    resize: none;
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
  }
  
  #break {
    background-color: rgb(254, 68, 77);
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
    background-color: rgb(146, 208, 80);
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
  </style>
  