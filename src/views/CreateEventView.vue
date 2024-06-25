<template>
  <div id="app">
    <div id="header">
      <div id="icon-div" @click="goToHomePage">
        <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
        <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
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
                  <img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" />
                  <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" />
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
              <div id="add-location" @click="openModalLocation">
                <img v-if=isDarkMode src="../assets/addlocation.png" alt="Bild hochladen" id="add-location-icon" />
                <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-location-icon" />
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
          <SearchComponent :mutable="false" startValue="1" locationButtonText="Zum Event hinzufügen"/>
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
import SearchComponent from '../components/SearchComponent.vue';
import DishForm from '../components/ArtistComponent.vue';

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
      selectedEventType: null,
        locationId: -1,

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
  },
}
</script>

<style scoped>
@import "../css/createPages.css"
</style>
