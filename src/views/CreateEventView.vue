<template>
  <div id="app">
    <div id="header">
      <div id="icon-div">
        <img alt="Filer" class="icon" src="../assets/home.jpg" @click="goToHomePage">
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
            <label class="description">Eventnamen hinzufügen:</label>
            <input class="header-input" v-model="eventName" type="text" placeholder="z.B. UNI PARTY"><br>
          </div>
          <div class="name-description-input">
            <label class="description">Kurze Beschreibung hinzufügen:</label>
            <input class="header-input" v-model="shortDescription" type="text" placeholder="z.B. Minden">
          </div>
        </div>
      </div>
    </div>

    <div id="main">
      <div id="left-side">
        <div class="long-description">
          <label class="description">Beschreibung hinzufügen:</label>
          <textarea id="long-description-input" v-model="longDescription" type="text" placeholder="Hier einfügen…"></textarea>
        </div>
        <br>
        <div class="long-description">
          <label class="description">Dienstleister hinzufügen:</label>
          <div id="addcreator" ref="addCreator" class="scroll-container">
            <div class="dish-container">
              <div v-for="(serviceProvider, index) in serviceProvider" :key="index" class="dish-item">
                <dish-form :serviceProvider="serviceProvider" @remove="removeProvider(index)"></dish-form>
              </div>
              <div class="add-dish-button" @click="addProvider">
                <img src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-side">
        <div id="right-side-info">
          <label id="info-headline">Infos hinzufügen:</label>
          <div class="infos">
            <label class="info-subheadline">Location:</label>
            <div>
              <div id="add-location">
                <img src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-location-icon" @click="openModalLocation" />
              </div>
            </div>
          </div>
          <div class="infos">
            <label class="info-subheadline">Datum:</label>
            <input class="input" v-model="eventDate" type="text" placeholder="z.B. 17.08.2024">
          </div>
          <div class="infos">
            <label class="info-subheadline">Zeit:</label>
            <div class="time">
              <input class="time-value-left" v-model="eventStartTime" placeholder="z.B. 17Uhr"> - 
              <input class="time-value-right" v-model="eventEndTime" placeholder="z.B. 20Uhr">
            </div>
          </div>
          <div class="infos">
            <label class="info-subheadline">Eventgröße:</label>
            <input class="input" v-model="eventSize" type="text" placeholder="z.B. 50 Personen">
          </div>
          <div class="infos">
            <label class="info-subheadline">Preis:</label>
            <input class="input" v-model="price" type="text" placeholder="z.B. 50€">
          </div>
          <div class="infos">
            <label class="info-subheadline">Alter:</label>
            <input class="input" v-model="ageLimit" type="text" placeholder="z.B. 18 Jahre">
          </div>
          <div id="open-air">
            <label class="info-subheadline">Open Air:</label>
            <label class="switch">
              <input type="checkbox" v-model="openAir">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div id="buttons">
          <div id="break" @click="resetForm">
            abbrechen  
          </div>
          <div id="continue" @click="openModal">
            anlegen
          </div>
        </div>
      </div>
    </div>

    <!-- Integrated PopupModal functionality -->
    <div v-if="isModalVisible" id="modal-overlay">
      <div id="modal-content">
        <div id="headline">
          <label>Privatsphäre-Einstellung</label>
        </div>
        <div id="event-buttons">
          <div id="event-button" @click="selectEventType('private')" :class="{ 'selected': selectedEventType === 'private' }">privates Event</div>
          <div id="event-button" @click="selectEventType('public')" :class="{ 'selected': selectedEventType === 'public' }">öffentliches Event</div>
        </div>
        <div id="action-buttons">
          <button id="cancel-button" @click="closeModal">abbrechen</button>
          <button id="create-button" @click="createEvent">Jetzt erstellen</button>
        </div>
      </div>
    </div>

    <div v-if = "isLocationModalVisible" id ="modal-overlay">
      <div id="modal-content-location">
        <div id="headline">
            <label>Location Auswählen</label>
        </div>
        <!--  Auflistung der Events--> 
        <div id="event-div">
          <SearchComponent :mutable="false" startValue="1"/>
        </div>
        <div id="action-buttons">
          <button id="cancel-button" @click="closeModalLocation">abbrechen</button>
          <button id="create-button" >Location auswählen</button>
        </div>

      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import DishForm from '../components/DishForm.vue';
import SearchComponent from '../components/SearchComponent.vue';

export default {
  components: {
    DishForm,
    SearchComponent
  },
  data() {
    return {
      eventName: '',
      shortDescription: '',
      longDescription: '',
      eventImage: null,
      imagePreview: null, 
      eventDate: '',
      eventStartTime: '',
      eventEndTime: '',
      eventSize: '',
      price: '',
      ageLimit: '',
      openAir: false,
      serviceProvider: [
        { name: '', details: [] }
      ],
      isModalVisible: false,
      isLocationModalVisible : false,
      selectedEventType: null 

    };
  },

  computed: {
    fileDivStyle() {
      return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
    }
  },


  methods: {

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file); // Set the image preview
        this.uploadedImage = file; // Store the actual file for upload
      }
    },
    addProvider() {
      this.serviceProvider.push({ name: '', details: [] });
      this.$nextTick(() => {
        const container = this.$refs.addCreator;
        container.scrollLeft = container.scrollWidth - container.clientWidth;
      });
    },
    removeProvider(index) {
      this.serviceProvider.splice(index, 1);
    },
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    openModalLocation() {
      this.isLocationModalVisible = true;
    },
    closeModalLocation() {
      this.isLocationModalVisible = false;
    },
    selectEventType(type) { 
      this.selectedEventType = type;
    },
    resetForm() {
      this.eventName = '';
      this.shortDescription = '';
      this.longDescription = '';
      this.eventImage = null;
      this.imagePreview = null; 
      this.eventDate = '';
      this.eventStartTime = '';
      this.eventEndTime = '';
      this.eventSize = '';
      this.price = '';
      this.ageLimit = '';
      this.openAir = false;
      this.serviceProviders = [{ name: '', ingredients: [] }];
      this.selectedEventType= null; 
    },
    async createEvent() {
      const formData = new FormData();
      formData.append('eventName', this.eventName);
      formData.append('shortDescription', this.shortDescription);
      formData.append('longDescription', this.longDescription);
      formData.append('eventDate', this.eventDate);
      formData.append('eventStartTime', this.eventStartTime);
      formData.append('eventEndTime', this.eventEndTime);
      formData.append('eventSize', this.eventSize);
      formData.append('price', this.price);
      formData.append('ageLimit', this.ageLimit);
      formData.append('openAir', this.openAir);
      formData.append('selectedEventType', this.selectedEventType); 
      if (this.uploadedImage) {
        formData.append('eventImage', this.uploadedImage);
      }

      const serviceProvidersData = this.serviceProvider.map(provider => ({
        name: provider.name,
        details: provider.details
      }));
      formData.append('serviceProviders', JSON.stringify(serviceProvidersData));

      const token = localStorage.getItem('authToken');

      try {
        const response = await axios.post('/createEvent', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Event created:', response.data);
        this.closeModal(); 
      } catch (error) {
        console.error('Error with Event creation:', error);
      }
    },
    goToHomePage() {
      this.$router.push('/search');
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
  height: 398px;
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
  background-color: rgb(242, 242, 242);
}

/* Integrated PopupModal styles */
#modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  grid-template-columns: auto;
  justify-content: center;
  align-items: center;
}

#modal-content {
  background: white;
  padding: 30px;
  padding-top: 20px;
  padding-bottom: 12.5px;
  border-radius: 20px;
  text-align: center;
  width: 800px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

#modal-content-location{
  background: white;
  padding: 30px;
  padding-top: 20px;
  padding-bottom: 12.5px;
  border-radius: 20px;
  text-align: center;
  width: 800px;
  max-height: 800px;
  min-height: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);

}

#headline {
  margin-bottom: 50px;
  font-weight: bold;
}

#event-buttons {
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

#event-button {
  border-radius: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  padding: 11px;
  padding-left: 45px;
  padding-right: 45px;
  margin-bottom: 20px;
  font-size: 12px;
}

#action-buttons {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
  margin-right: 10px;
}

#cancel-button {
  background-color: rgb(254, 68, 77);
  width: 115px;
  height: 35px;
  border-radius: 7px;
  border: 1px solid #000000;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

#create-button {
  background-color: rgb(146, 208, 80);
  width: 115px;
  height: 35px;
  border-radius: 7px;
  border: 1px solid #000000;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

#modal-content #event-buttons #event-button.selected {
  background-color: blue; 
  color: white; 
}

#event-div{
  max-height: 600px;
  min-height:400px;
  overflow-y: scroll;
}
</style>
