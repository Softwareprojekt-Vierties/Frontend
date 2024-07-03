<template>
    <div id="app">
      <div id="header" :style="fileHeaderStyle">
          <div id="header-inner">
        <div id="icon-div">
          <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
          <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
        </div>
        <div id="picture-name">
          <div id="file-div" :style="fileDivStyle">
          </div>
          <div id="name-description">
            <div class="name-description-input">
                <label id="name">{{userName}}</label>
            </div>
            <div class="name-description-input">
                <label id="description-short">{{shortDescription}}</label>
            </div>
          </div>
        </div>
        </div>
      </div>
  
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung:</label>
            <label id="long-description-input" type="text">{{longDescription}}</label>
            <label class="description-info">Eventarten:</label>
            <label id="long-description-input" type="text">{{favoriteEventTypes}}</label>
            <label class="description-info">Lieblings Lied:</label>
            <label id="long-description-input" type="text">{{favoriteSong}}</label>
            <label class="description-info">Lieblings Gericht:</label>
            <label id="long-description-input" type="text">{{favoriteDish}}</label>
          </div>          
          <br>
          <div class="long-description">
            <label class="description">Bilder:</label>
            <div id="addcreator" ref="addCreator" class="scroll-container">
              <div class="dish-container">
                  <dish-form v-for="picture in pictures" :key="picture" />
              </div>
            </div>
          </div>
          <div id="event-dish">
            <div id="event">
              <label class="description">Meine Events/Locations:</label>
              <ArtistCard v-if="myEventsLocations.length" :name="myEventsLocations[eventsLocationsIndex].header" :line1="myEventsLocations[eventsLocationsIndex].line1" :line2="myEventsLocations[eventsLocationsIndex].line2" :line3="myEventsLocations[eventsLocationsIndex].line3" :rightFunction="increaseEventLocationsIndex" :leftFunction="decreaseEventLocationsIndex" />
            </div>
            <div id="dish">
              <label class="description">Meine Interessen:</label>
              <ArtistCard v-if="myIntrests.length" :name="myIntrests[intrestsIndex].header" :line1="myIntrests[intrestsIndex].line1" :line2="myIntrests[intrestsIndex].line2" :line3="myIntrests[intrestsIndex].line3" :rightFunction="increaseIntrestsIndex" :leftFunction="decreaseIntrestsIndex" />
            </div>
        </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <label id="info-headline">Infos</label><div class="infos">
                <label class="info-subheadline"><strong>Region:</strong> {{region}}</label>
            </div>
            <div class="infos">
                <label class="info-subheadline"><strong>Alter:</strong> {{age}} Jahre</label>
            </div>
            <div class="infos">
                <label class="info-subheadline"><strong>Geschlecht:</strong> {{gender}}</label>
            </div>
          </div>
          <div id="break" v-if="isFriend" @click="unfriend">Freundschaft beenden</div>
          <div id="continue" v-else @click="sendFriendRequest">Freundschaftsanfrage</div>
        </div>
      </div>
  
      <PopupModal :show="isModalVisible" @close="closeModal"/>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/PictureComponent.vue';
  import PopupModal from '../components/PopupModal.vue'; // Importiere die neue Komponente
  import ArtistCard from '../components/ArtistCardComponent.vue';
  import axios from 'axios';
  
  export default {
    components: {
      DishForm,
      PopupModal,
      ArtistCard
    },
    data() {
      return {
          userName: "",
        isModalVisible: false,
          profilePicture: null,
          fileDivStyle: null,
          fileHeaderStyle: null,
          favoriteEventTypes: "",
          favoriteSong: "",
          favoriteDish: "",
          region: "",
          age: 0,
          gender: "",
          pictures: [],
          myEventsLocations: [],
          eventsLocationsIndex: 0,
          myIntrests: [],
          intrestsIndex: 0,
          isFriend: false,
      };
    },
    methods: {
      addDish() {
        this.dishes.push({ name: '', ingredients: [] });
        this.$nextTick(() => {
          const container = this.$refs.addCreator; // Verwendet ref, um den Container zu referenzieren
          container.scrollLeft = container.scrollWidth - container.clientWidth; // Scrollt zum rechten Ende des Containers
        });
      },
      removeDish(index) {
        this.dishes.splice(index, 1);
      },
      openModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
        sendFriendRequest() {
            console.log(this.id);
            axios.get("/friendrequest/" + this.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => console.log("Success: ", res))
                .catch(err => console.log("Error: ", err));
        },
        unfriend() {
            axios.get("/unfriend/" + this.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => console.log("Success: ", res))
                .catch(err => console.log("Error: ", err));
        },
        getInfo() {
              axios.get("/getUserById/" + this.$route.params.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => {
                    console.log("Success: ", res);
                    this.userName = res.data.user.rows[0].profilname;
                    this.shortDescription = res.data.user.rows[0].kurzbeschreibung;
                    this.longDescription = res.data.user.rows[0].beschreibung;
                    this.favoriteEventTypes = res.data.user.rows[0].arten;
                    this.favoriteSong = res.data.user.rows[0].lied;
                    this.favoriteDish = res.data.user.rows[0].gericht;
                    this.region = res.data.user.rows[0].region;
                    this.age = res.data.user.rows[0].alter;
                    this.gender = res.data.user.rows[0].geschlecht;
                    this.profilePicture = res.data.user.rows[0].profilbild;
                    res.data.owenevents.rows?.forEach(event => {
                        this.myEventsLocations.push({header: event.name, line1: "Location: " + event.locationname, line2: "Datum: " + event.datum, line3: "Zeit: " + event.uhrzeit, id: event.id});
                    });
                    res.data.locations.rows?.forEach(event => {
                        this.myEventsLocations.push({header: event.name, line1: "Addresse: " + event.addresse, line2: "Kapazität: " + event.kapazitaet, line3: "Preis: " + event.preis, id: event.id});
                    });
                    res.data.tickets.rows?.forEach(event => {
                        this.myIntrests.push({header: event.name, line1: "Location: " + event.locationname, line2: "Datum: " + event.datum, line3: "Zeit: " + event.uhrzeit, id: event.id});
                    });
                    this.fileDivStyle = this.profilePicture ? { backgroundImage: `url(${this.profilePicture})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                    this.fileHeaderStyle = this.profilePicture ? { backgroundImage: `url(${this.profilePicture})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

                    // to be implemented
                    this.pictures = [1, 2, 3, 4, 5, 6, 7, 8];
                    this.isFriend = false;
                })
                .catch(err => console.log("Error: ", err));
            console.log(this.fileDivStyle);
            //this.profilePicture = require("../assets/bild-hsbi.jpg");
            // get persons events
            // get persons Locations
            // get persons booked tickets?
        },
        increaseEventLocationsIndex() {
            if (this.eventsLocationsIndex < this.myEventsLocations.length - 1) {
                this.eventsLocationsIndex++;
            }
        },
        decreaseEventLocationsIndex() {
            if (this.eventsLocationsIndex > 0) {
                this.eventsLocationsIndex--;
            }
        },
        increaseIntrestsIndex() {
            if (this.intrestsIndex < this.myIntrests.length - 1) {
                this.intrestsIndex++;
            }
        },
        decreaseIntrestsIndex() {
            if (this.intrestsIndex > 0) {
                this.intrestsIndex--;
            }
        },
    },
      computed: {
          isDarkMode() {
              return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
          },
          id() {
              return this.$route.params.id;
          },
      },
      created() {
          this.getInfo();
      },
  }
  </script>
  
  <style scoped>
  :root html, body {
  width: 100%;
  height: 100%;
  background-color: var(--create-page-background);
}

#header {
  background-color: var(--create-page-header-background);
}

#header-inner {
    width: 100%;
    height: 100%;
  padding-bottom: 40px;
  padding-top: 10px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
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
  background-color: var(--create-page-background);
  margin-left: 10px;
}

.icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

#name-description {
    background-color: none;
    padding: 10px;
  }

.name-description-input {
  display: grid;
  grid-template-columns: 300px;
  justify-content: left;
}

#name {
  text-align: left;
  font-size: 35px;
  color: white;
  margin-bottom: 10px;
}

#description-short {
  text-align: left;
  font-size: 18px;
  color: white;
  margin-bottom: -10px;
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
  background-color: var(--create-page-background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -225px;
  background-color: white;
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
  grid-template-columns: 150px;
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
  width: 580px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 0px;
  border: none;
  resize: none;
  background-color: var(--textfield-background);
  color: var(--textfield-font-color);
  text-align: left;
  font-weight: normal;
  color: rgb(80, 80, 80);
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
  width: 170px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
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
  margin-top: 10px;
}

#add-icon {
  width: 24px;
  height: 24px;
}

.dish-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 38px;
  margin-left: 30px;
  margin-right: 25px;
}

#event-dish {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
}

#event {
    border-radius: 10px;
    background-color: white;
    padding: 10px;
    display: grid;
    justify-content: left;
    font-weight: bold;
}

#dish {
    border-radius: 10px;
    background-color: white;
    padding: 10px;
    display: grid;
    justify-content: left;
    font-weight: bold;
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

  .description-info {
    text-align: left;
    font-size: 12px;
    margin-bottom: 3px;
    margin-top: 20px;
  }

  #info-headline {
  display: block; /* Als Block-Element anzeigen */
  text-align: left; /* Text links ausrichten */
  font-family: Arial, sans-serif; /* Schriftart festlegen */
  font-size: 18px; /* Schriftgröße festlegen */
  font-weight: bold;
}

#age-input {
    border: 1px solid #000000;
    border-radius: 5px;
    width: 50px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: gray;
}

#age {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    gap: 15px;
}
  </style>
  
