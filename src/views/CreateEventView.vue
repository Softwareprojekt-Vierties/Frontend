<template>
  <div id="CreateEventView">
    <div id="header">
      <div id="icon-div">
        <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
        <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
      </div>
      <div id="picture-name">
        <div id="file-div">
          <div id="file-upload">
            <label id="image-text" for="fileToUpload">
              <img v-if="isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
              <img v-else src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
              <span id="upload-text">Bild hochladen</span>
            </label>
            <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*">
          </div>
        </div>
        <div id="name-description">
          <div class="name-description-input">
            <label class="description">Eventnamen hinzufügen:</label>
            <input class="header-input" type="text" placeholder="z.B. UNI PARTY"><br>
          </div>
          <div class="name-description-input">
            <label class="description">Kurze Beschreibung hinzufügen:</label>
            <input class="header-input" type="text" placeholder="z.B. Minden">
          </div>
        </div>
      </div>
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
                                <EventCard v-if="(serviceProvider?.name ?? '') != ''" :label="serviceProvider?.name" :imagePath="serviceProvider?.details?.profilbild" @click="openModalService(index)" @remove="removeProvider(index)" />
                                <dish-form v-else @click="openModalService(index)" @remove="removeProvider(index)"></dish-form>
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
                                <div v-if="!location">
                                    <img v-if=isDarkMode src="../assets/addlocation.png" alt="Bild hochladen" id="add-location-icon" />
                                    <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-location-icon" />
                                </div>
                                <div v-else>
                                    <LocationCard :label="location?.name" :imagePath="location?.bild" />
                                </div>
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
                    <button class="create-button" @click="createEvent">Jetzt erstellen</button>
                </div>
            </div>
        </div>

        <div v-if = "isLocationModalVisible" id ="modal-overlay">
            <div id="modal-content-location">
                <div id="headline">
                    <label>Location Auswählen</label>
                </div>
                <!--  Auflistung der Events--> 
                <div class="event-div" v-if="searchLocation">
                    <SearchComponent :mutable="false" startValue="1" locationButtonText="Zum Event hinzufügen" :locationButtonFunction="setTmpLocationId" :locationTitleFunction="(info) => {}"/>
                </div>
                <div class="event-div" v-else>
                    <SearchComponent :allowedSearchTypes="['2', '3']" artistButtonText="Zum Event hinzufügen" catererButtonText="Zum Event hinzufügen" :artistButtonFunction="setCurrentProvider" :catererButtonFunction="setCurrentProvider" :locationTitleFunction="(info) => {}"/>
                </div>
                <div id="action-buttons">
                    <button id="cancel-button" @click="closeModalLocation">abbrechen</button>
                    <button v-if="searchLocation" class="create-button" @click="selectLocation" >Location auswählen</button>
                    <button v-else class="create-button" @click="selectService" >Service auswählen</button>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import axios from 'axios';
    import SearchComponent from '../components/SearchComponent.vue';
    import DishForm from '../components/ArtistComponent.vue';
    import LocationCard from '../components/EventComponenet.vue'
    import EventCard from '../components/EventCardComponent.vue';

    export default {
        components: {
            DishForm,
            EventCard,
            SearchComponent,
            LocationCard,
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
                serviceProvider: [{ name: '', ingredients: [] }],
                isModalVisible: false,
                isLocationModalVisible : false,
                selectedEventType: null,
                location: null,
                tmpLocation: null,
                searchLocation: true,
                currentProviderIndex: -1,
                currentProvider: {},
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
                this.searchLocation = true;
                this.isLocationModalVisible = true;
            },
            openModalService(index) {
                this.currentProviderIndex = index;
                this.searchLocation = false;
                this.isLocationModalVisible = true;
            },
            closeModalLocation() {
                this.isLocationModalVisible = false;
                this.currentProviderIndex = -1;
                this.currentProvider = null;
                this.tmpLocation = null;
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
                if (!this.eventName || !this.shortDescription || !this.longDescription || !this.eventDate || !this.eventStartTime 
                    || !this.eventEndTime || !this.eventSize || !this.price || !this.ageLimit
                    || !this.selectedEventType || !this.location) {
                    alert('Please fill in all required fields.');
                    return;
                }

                let formData = {};
                formData.name = this.eventName;
                formData.kurzbeschreibung = this.shortDescription;
                formData.beschreibung = this.longDescription;
                formData.datum = this.eventDate;
                formData.startuhrzeit = this.eventStartTime;
                formData.enduhrzeit = this.eventEndTime;
                formData.eventgroesse = this.eventSize;
                formData.preis = this.price;
                formData.altersfreigabe = this.ageLimit;
                formData.openair = this.openAir;
                formData.privat = this.selectedEventType === "private"; 
                formData.locationid = this.location.id;
                formData.serviceProviders = [];
                this.serviceProvider.forEach(sp => {
                    if (sp.name != "") {
                        formData.serviceProviders.push(sp);
                    }
                });

                if (this.imagePreview) {
                    formData.bild = this.imagePreview;
                }

                const token = localStorage.getItem('authToken');

                try {
                    const response = await axios.post('/createEvent', formData, {
                        headers: {
                            "auth": token,
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
            },
            setTmpLocationId(info) {
                this.tmpLocation = info;
            },
            setCurrentProvider(info) {
                this.currentProvider = { name: "",  details: [] };
                for (const key in info) {
                    if (key == "name") {
                        this.currentProvider.name = info.name;
                    } else {
                        this.currentProvider.details[key] = info[key];
                    }
                }
            },
            selectLocation() {
                this.location = this.tmpLocation;
                this.closeModalLocation();
            },
            selectService() {
                this.serviceProvider[this.currentProviderIndex] = this.currentProvider;
                this.closeModalLocation();
                console.log(this.serviceProvider);
            },
        },
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

#CreateEventView {
    min-height: 100vh;
    background-color: var(--create-page-background);
}
</style>
