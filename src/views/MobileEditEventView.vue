<template>
    <Header :isLoggedIn="true" :sterne="-1" v-model:name="eventName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />    
    <div class="description-headline-div">
        <div class="description-headline">
            Infos hinzufügen:
        </div>
    </div>
    <div id="infos">
        <div id="info">
            <div id="info-left">

                <label class="info-subheadline"><strong>Location:</strong>{{location}}</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Datum:</strong> {{ formattedEventDate }}</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Startzeit:</strong> {{ eventStartTime }} Uhr</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Eventgröße:</strong> {{eventSize}} Personen</label>
            </div>
            <div id="info-right">
                <label class="info-subheadline"><strong>Preis:</strong> {{price}}€</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Altersfreigabe:</strong> {{ageLimit}}+</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Open Air:</strong> {{openAir ? 'Ja' : 'Nein'}}</label>
            </div>
        </div>
    </div>
    <div class="description-headline-div">
        <div class="description-headline">
            Beschreibung:
        </div>
    </div>
    <div id="description-div">
        <div id="description">
            {{longDescription}}
        </div>
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
                            <EventCard :scaleFactor=".67" :name="serviceProvider?.name" :line1="serviceProvider?.details?.line1" :line2="serviceProvider?.details?.line2" :line3="serviceProvider?.details?.line3" :info="serviceProvider?.details" :buttonText="serviceProvider.details.immutable ? '' : 'Entfernen'" :buttonClickFunction="serviceProvider.details.immutable ? () => {} : () => {serviceProviders.splice(index, 1)}" :imagePath="serviceProvider?.details?.profilbild" :isBookmarked="serviceProvider?.details?.favorit ?? 0" :buttonColor="serviceProvider.details.immutable ? 'var(--textfield-background)' : 'var(--red)'" @remove="removeProvider(index)" />
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
        <div id="continue" @click="createEvent">
            anlegen
        </div>
    </div>
    <!-- Integrated PopupModal functionality -->
    <div v-if = "isLocationModalVisible" id ="modal-overlay">
        <div id="modal-content-location">
            <div id="headline">
                <label>Service Provider Auswählen</label>
                <br v-if="currentProvider">
                <label v-if="currentProvider">{{currentProvider.name}}</label>
            </div>
            <!--  Auflistung der Events--> 
            <div class="event-div">
                <SearchComponent :allowedSearchTypes="['2', '3']" artistButtonText="Zum Event hinzufügen" catererButtonText="Zum Event hinzufügen" :artistButtonFunction="setCurrentProvider" :catererButtonFunction="setCurrentProvider" :locationTitleFunction="(info) => {}"/>
            </div>
            <div id="action-buttons">
                <button id="cancel-button" @click="closeModalLocation">abbrechen</button>
                <button v-if="searchLocation" class="create-button" @click="selectLocation" >Location auswählen</button>
                <button v-else class="create-button" @click="selectService" >auswählen</button>
            </div>
        </div>
    </div>
    <div id="home-button" v-if="menu" @click="$router.push('/search')">
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
      import EventCard from '../components/CardComponent.vue';
      import Header from '../components/MobileHeaderComponent.vue';
  
      export default {
          components: {
              DishForm,
              EventCard,
              SearchComponent,
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
                  serviceProviders: [],
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
              },
              formattedEventDate() {
                  return this.formatDate(this.eventDate);
              }, 
          },
          async created(){

              let id = this.$route.params.id;
              const token = localStorage.getItem('authToken');
              const response = await axios.get(`/getEventById/${id}`,{headers: {'auth':token}});
              console.log("where i am ??",response.data);

              this.setFormData(response.data);
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
              formatDate(dateString) {
                  const date = new Date(dateString);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
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
                  this.$router.push();
              },
              async createEvent() {
                  let formData = {};
                  formData.eventid = this.$route.params.id;
                  formData.serviceProviders = [];
                  this.serviceProviders.forEach(sp => {
                      if (sp.name != "") {
                          formData.serviceProviders.push({id: sp.details.id, type: sp.details.type, userid: sp.details.app_user_id});
                      }
                  });

                  const token = localStorage.getItem('authToken');

                  try {
                      const response = await axios.post('/updateEvent', formData, {
                          headers: {
                              "auth": token,
                          }
                      });
                      console.log('Event created:', response.data);
                      this.closeModal(); 
                      this.$router.push(`/event/${this.$route.params.id}`);
                  } catch (error) {
                      console.error('Error with Event creation:', error);
                      alert("Das Event conte nicht aktualisiert werden!");
                  }
              },
              setFormData(data){
                  this.eventName = data.event.rows[0].name;
                  this.shortDescription = data.event.rows[0].kurzbeschreibung;
                  this.imagePreview = data.event.rows[0].bild;
                  this.longDescription = data.event.rows[0].beschreibung;
                  this.price = data.event.rows[0].preis;
                  this.ageLimit = data.event.rows[0].altersfreigabe;
                  this.eventStartTime = data.event.rows[0].startuhrzeit;
                  this.eventEndTime = data.event.rows[0].enduhrzeit;
                  this.location = data.event.rows[0].locationname;
                  this.eventSize = data.event.rows[0].eventgroesse;
                  this.eventDate = new Date(data.event.rows[0].datum).toISOString().split("T")[0];
                  console.log(this.eventDate);
                  this.openair = data.event.rows[0].openair;
                  this.addresse = data.event.rows[0].adresse;
                  this.hasBookmark = data.event.rows[0].favorit;
                  data['caterers'].rows.forEach(caterer =>{
                      let provider = { name: "",  details: [] };
                      Object.keys(caterer).forEach(key => {
                          if (key == "profilname") {
                              provider.name = caterer.profilname;
                          } else {
                              provider.details[key] = caterer[key];
                          }
                      });
                      provider.details.line1 = `Stadt: ${provider.details.region}`;
                      provider.details.line2 = `Kategorie: ${provider.details.kategorie}`;
                      provider.details.line3 = `Preis: ${provider.details.preis}€/h`;
                      provider.details.type = "caterer";
                      provider.details.immutable = true;
                      provider.details.app_user_id = -1;
                      this.serviceProviders.push(provider);
                  });

                  data['artists'].rows.forEach(artist =>{
                      let provider = { name: "",  details: [] };
                      Object.keys(artist).forEach(key => {
                          if (key == "profilname") {
                              provider.name = artist.profilname;
                          } else {
                              provider.details[key] = artist[key];
                          }
                      });
                      provider.details.line1 = `Stadt: ${provider.details.region}`;
                      provider.details.line2 = `Kategorie: ${provider.details.kategorie}`;
                      provider.details.line3 = `Preis: ${provider.details.preis}€/h`;
                      provider.details.type = "artist";
                      provider.details.immutable = true;
                      provider.details.app_user_id = -1;
                      this.serviceProviders.push(provider);
                  });

                  this.addProvider();

                  console.log("the serviceProviders", this.serviceProviders);
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
    margin-bottom: 10px;
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

#info {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: top;
    gap: 10px;
    height: 120px;
}

#info-left {
    text-align: left;
    font-size: 10px;
    width: 155px;
}

#info-right {
    text-align: left;
    font-size: 10px;
    width: 105px;
    margin-right: 15px;
}

  </style>
  
