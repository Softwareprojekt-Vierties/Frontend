<template>
    <Header :isLoggedIn="true" v-model:name="eventName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />    
    <div class="description-headline-div">
        <div class="description-headline">
            Infos hinzufügen:
        </div>
    </div>
    <div id="infos">
        <div class="info">
            <div id="left">
                <div class="input-headline">Location:</div>
                <div id="location-div">
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
                <div class="input-headline">Datum:</div>
                <input type="date" placeholder="z.B. 17.08.2024"/>
                <div class="input-headline">Kapazität:</div>
                <input type="number" min="0" :max="2**32" placeholder="z.B. 200 Personen"/>
                <div class="input-headline">Zeit:</div>
                <div id="time-div"><input type="time" class="time" placeholder="z.B. 17 Uhr"/> - 
                    <input type="time" class="time" placeholder="z.B. 20 Uhr"/>
                </div>
            </div>
            <div id="right">
                <div class="input-headline">Eventgröße: </div>
                <input type="number" min="0" placeholder="z.B. 200 Personen"/>
                <div class="input-headline">Preis: </div>
                <input type="number" min="0" placeholder="z.B. 20€"/>
                <div class="input-headline">Altersfreigabe: </div>
                <input type="number" min="0" placeholder="z.B. 18 Jahre"/>
                <div class="input-headline">Open Air:</div>
                <div id="switch-div"><label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label></div>
            </div>
        </div>
    </div>
    <div id="description">
        <div class="description-headline-div">
            <div class="description-headline">
                Beschreibung hinzufügen:
            </div>
        </div>
        <textarea v-model="longDescription" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
    </div>
    <div class="description-headline-div">
        <div class="description-headline">
            Dienstleister hinzufügen:
        </div>
    </div>
    <div class="songs">
        <div id="addcreator" ref="addCreator" class="scroll-container">
            <div class="dish-container">
                <div v-for="(serviceProvider, index) in serviceProviders" :key="index" class="dish-item">
                    <div v-if="(serviceProvider?.name ?? '') != ''" id="artist-div">
                        <div id="background">
                            <EventCard :scaleFactor=".67" :name="serviceProvider?.name" :line1="serviceProvider?.details?.line1" :line2="serviceProvider?.details?.line2" :line3="serviceProvider?.details?.line3" :info="serviceProvider?.details" buttonText="Entfernen" :buttonClickFunction="() => {serviceProviders.splice(index, 1)}" :imagePath="serviceProvider?.details?.profilbild" :isBookmarked="serviceProvider?.details?.favorit ?? 0" buttonColor="var(--red)" @remove="removeProvider(index)" />
                        </div>
                    </div>
                    <dish-form v-else @click="openModalService(index)" @remove="removeProvider(index)"></dish-form>
                </div>
                <div class="add-dish-button" @click="addProvider">
                    <img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" />
                    <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" />
                </div>
            </div>
        </div>
    </div>
    <div id="buttons">
        <div id="break" @click="resetForm">
            zurücksetzten  
        </div>
        <div id="continue" @click="openModal">
            anlegen
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
                <label>Auswählen</label>
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
    <div id="home-button" v-if="menu">
            <img id="home-mobile" src="../assets/home-mobile.png" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
</template>
  
  
  <script>
      import axios from 'axios';
      import SearchComponent from '../components/MobileSearchComponent.vue';
      import DishForm from '../components/MobileArtistComponent.vue';
      import LocationCard from '../components/MobileAddLocationComponent.vue';
      import EventCard from '../components/CardComponent.vue';
      import Header from '../components/MobileEditHeader.vue';
  
      export default {
          components: {
              DishForm,
              EventCard,
              SearchComponent,
              LocationCard,
              Header,
          },
          data() {
              return {
                  menu: false,
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
                  serviceProviders: [{ name: '', details: null }],
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
                  this.serviceProviders.push({ name: '', details: null });
                  this.$nextTick(() => {
                      const container = this.$refs.addCreator;
                      container.scrollLeft = container.scrollWidth - container.clientWidth;
                  });
              },
              removeProvider(index) {
                  this.serviceProviders.splice(index, 1);
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
                  this.serviceProviders = [{ name: '', details: null }];
                  this.selectedEventType= null; 
                  this.location = null;
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
                  this.serviceProviders.forEach(sp => {
                      if (sp.name != "") {
                          formData.serviceProviders.push({id: sp.details.id, type: sp.details.type});
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
                  Object.keys(info).forEach(key => {
                      if (key == "name") {
                          this.currentProvider.name = info.name;
                      } else {
                          this.currentProvider.details[key] = info[key];
                      }
                  });
                  this.currentProvider.details.line1 = `Stadt: ${this.currentProvider.details.region}`;
                  this.currentProvider.details.line2 = `Kategorie: ${this.currentProvider.details.kategorie}`;
                  this.currentProvider.details.line3 = `Preis: ${this.currentProvider.details.preis}€/h`;
              },
              selectLocation() {
                  this.location = this.tmpLocation;
                  this.closeModalLocation();
              },
              selectService() {
                  this.serviceProviders[this.currentProviderIndex] = this.currentProvider;
                  this.closeModalLocation();
                  console.log(this.serviceProviders);
              },
              handleClick() {
                if(this.menu) {
                    this.menu = false;
                }
                else {
                    this.menu = true;
                }
            }
          },
      }
  </script>
  
  <style scoped>

#time-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-between;
    align-items: center;
}

.time {
    width: 40px;
    font-size: 8px;
}

  #infos {
    margin-top: 5px;
    margin-top: -10px;
    margin-bottom: 30px;
}

.info {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: start;
    gap: 27px;
}

#left {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    text-align: left;
    font-size: 13px;
    font-weight: bold;
}

#right {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    text-align: left;
    font-weight: bold;
}

.input-headline {
    font-size: 12px;
    font-weight: bold;
    height: 15px;
    margin-top: 15px
}

input {
    width: 125px;
    height: 20px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #000000;
    font-size: 11px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

.input::placeholder {
    color: var(--placeholder-color);
}

#switch-div {
    margin-left: 25px;
}

.switch {
      position: relative;
      display: inline-block;
      width: 40px; /* Angepasst an die neue Höhe */
      height: 20px;
      margin-left: 37%;
  }

.switch input { 
      opacity: 0;
      width: 0;
      height: 0;
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
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 50%;
  }

input:checked + .slider {
      background-color: var(--cyan);
  }

input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
  }

input:checked + .slider:before {
      -webkit-transform: translateX(20px); /* Angepasst an die neue Höhe */
      -ms-transform: translateX(20px); /* Angepasst an die neue Höhe */
      transform: translateX(20px); /* Angepasst an die neue Höhe */
  }

.description-headline-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
}

.description-headline {
    width: 287px;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 3px;
}

#location-div {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;
    width: 131px;
    margin: 0 auto;
    text-align: center;
}

.songs {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;
    width: 305px;
    margin: 0 auto;
    margin-top: -30px
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
    width: 20px;
    height: 20px;
    margin-top: 1px;
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
    gap: 50px;
    margin-top: 20px;
    padding-bottom: 20px;
    color: var(--simple-font-color);
  }
  
  .description {
      text-align: left;
      margin-bottom: 3px;
      font-size: 13px;
      font-weight: bold;
  }
  
  #break {
    background-color: var(--red);
    width: 115px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  
  #continue {
    background-color: var(--green);
    width: 115px;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  
  #addcreator {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    align-items: center;
    padding: 20px 0;
    padding-left: 10px;
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
    width: 20px;
    height: 50px;
    margin-top: 5px;
  }
  
  #add-icon {
    margin-top: 5px;
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
      background: var(--background);
      color: var(--font-color);
      padding: 30px;
      padding-top: 20px;
      padding-bottom: 12.5px;
      border-radius: 20px;
      text-align: center;
      width: 800px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  }
  
  #modal-content-location{
      background: var(--background);
      color: var(--font-color);
      border-radius: 20px;
      text-align: center;
      width: 90vw;
      height: 80vh;
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
      margin-top: 20px;
  }
  
  #cancel-button {
      background-color: var(--red);
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
  
  .create-button {
      background-color: var(--green);
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
      background-color: var(--blue); 
      color: var(--white); 
  }
  
  .event-div{
      width: 90vw;
      height: 60vh;
      overflow-y: scroll;
  }

  .description-headline-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
}

.description-headline {
    width: 287px;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 3px;
}

#long-description-input {
  width: 265px;
  height: 150px;
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

#home-button {
      position: fixed;
      bottom: 70px; /* Abstand vom unteren Rand */
      right: 20px; /* Abstand vom rechten Rand */
      color: white; /* Button Textfarbe */
      border: none; /* Keine Rahmen */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
      cursor: pointer; /* Zeiger ändern bei Hover */
      z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
      border-radius: 30px;
      background-color: var(--textfield-background);
  }
  
  #home-mobile {
      margin-bottom: -3px;
      width: 35px;
      height: 35px;
  }
  
  #menu-button {
      position: fixed;
      bottom: 20px; /* Abstand vom unteren Rand */
      right: 20px; /* Abstand vom rechten Rand */
      color: white; /* Button Textfarbe */
      border: none; /* Keine Rahmen */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
      cursor: pointer; /* Zeiger ändern bei Hover */
      z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
      border-radius: 30px;
      padding: 7.5px;
      background-color: var(--textfield-background);
  }
  
  #menu-mobile {
      margin-bottom: -3px;
      width: 20px;
      height: 20px;
  }

#artist-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

#background {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 7px;
    background-color: var(--textfield-background);
}

  </style>
  
