<template>
    <div id="app">
      <Header v-model:name="personName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung hinzufügen:</label>
            <textarea v-model="longDescription" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
            <label class="description-info">Eventarten hinzufügen:</label>
            <input v-model="favoriteEventTypes" class="description-info-input" type="text" placeholder="z.B. Party-Song">
            <label class="description-info">Lieblings Lied:</label>
            <input v-model="favoriteSong" class="description-info-input" type="text" placeholder="z.B. Techno">
            <label class="description-info">Lieblings Gericht hinzufügen:</label>
            <input v-model="favoriteDish" class="description-info-input" type="text" placeholder="z.B. Kuchen">
          </div>          
          <br>
          <div class="long-description">
            <label class="description">Bilder hinzufügen:</label>
            <div id="addcreator" ref="addCreator" class="scroll-container">
              <div class="dish-container">
                <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                    <dish-form :dish="dish" @remove="removeDish(index)" :imageGrabber="image => {dishes[index] = image;}" />
                </div>
                <div class="add-dish-button" @click="addDish"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
              </div>
            </div>
          </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <label id="info-headline">Infos hinzufügen:</label>
            <div class="infos">
              <label class="info-subheadline">Region:</label>
              <input v-model="region" class="input" type="text" placeholder="z.B. 32427 Minden">
            </div>
            <div class="infos">
              <label class="info-subheadline">Alter:</label>
              <div id="age">
                <img v-if="isDarkMode" @click="decreaseAge" src="../assets/minus_dark.png"/>
                <img v-else @click="decreaseAge" src="../assets/minus.png"/>
                <label id="age-input" type="text">{{this.age}}{{this.age == 99 ? "+" : ""}}</label>
                <img v-if="isDarkMode" @click="increaseAge" src="../assets/plus_dark.png"/>
                <img v-else @click="increaseAge" src="../assets/plus.png"/>
              </div>
            </div>
            <div class="infos">
              <label class="info-subheadline">Geschlecht:</label>
              <input v-model="gender" class="input" type="text" placeholder="z.B. M">
            </div>
          </div>
          <div id="buttons">
            <div id="break" @click="reset">
              zurücksetzen
            </div>
            <div id="continue" @click="openModal">
              anlegen
            </div>
          </div>
        </div>
      </div>
  
      <PopupModal :onCreate="createPerson" privateText="privates Profil" publicText="öffentliches Profil" :show="isModalVisible" @close="closeModal"/>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/PictureComponent.vue';
  import PopupModal from '../components/PopupModal.vue'; // Importiere die neue Komponente
  import Header from '../components/EditHeader.vue';
  import axios from 'axios';
  
  export default {
    components: {
      DishForm,
      PopupModal,
        Header,
    },
    data() {
      return {
        dishes: [null],
          personName: "",
          shortDescription: "",
          longDescription: "",
          region: "",
          gender: "",
          favoriteEventTypes: "",
          favoriteDish: "",
          favoriteSong: "",
          imagePreview: null,
          age: 0,
        isModalVisible: false
      };
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
          addDish() {
        this.dishes.push(null);
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
          console.log(this.dishes);
      },
      closeModal() {
        this.isModalVisible = false;
      },
        decreaseAge() {
            if (this.age > 0) {
                this.age--;
            }
        },
          increaseAge() {
              if (this.age < 99) {
                  this.age++;
              }
          },
            async createPerson(isPrivate) {
                if (!this.personName || !this.shortDescription || !this.longDescription || !this.region || !this.gender 
                    || !this.favoriteEventTypes || !this.favoriteDish || !this.favoriteSong) {
                    alert('Please fill in all required fields.');
                    return;
                }

                let formData = {};
                formData.benutzername = this.personName;
                formData.kurzbeschreibung = this.shortDescription;
                formData.beschreibung = this.longDescription;
                formData.region = this.region;
                formData.alter = this.age;
                formData.eventarten = this.favoriteEventTypes;
                formData.lieblingslied = this.favoriteSong;
                formData.lieblingsgericht = this.favoriteDish;
                formData.geschlecht = this.gender;
                formData.bilder = [];
                formData.privat = isPrivate;
                this.dishes.forEach(image => {
                    if (image) {
                        formData.bilder.push(image);
                    }
                });

                if (this.imagePreview) {
                    formData.bild = this.imagePreview;
                }

                const token = localStorage.getItem('authToken');

                try {
                    const response = await axios.post('/createPerson', formData, {
                        headers: {
                            "auth": token,
                        }
                    });
                    console.log('Person created:', response.data);
                    localStorage.setItem('authToken', response.data);
                    this.closeModal(); 
                    this.$router.push("/search");
                } catch (error) {
                    console.error('Error with Person creation:', error);
                }
            },
          reset() {
              this.$router.go();
          },
    },
      computed: {
          isDarkMode() {
              return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
          },
      }
  }
  </script>
  
  <style scoped>
  :root html, body {
  width: 100%;
  height: 100%;
  background-color: var(--create-page-background);
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
  font-weight: bold;
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
  height: 100px;
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
  flex: 0 0 auto;
}

.add-dish-button {
  display: inline-flex;
  align-items: center;
  justify-content: left;
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
  gap: 25px;
  margin-left: 16px;
}

footer {
  background-color: var(--create-page-background);
}

.description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: bold;
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
    margin-top: 30px;
  }
  
  .description-info-input {
    width: 200px;
    height: 8px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 10px;
    border: 1px solid #000000;
    border-radius: 5px;
    resize: none;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
  }

  #info-headline {
  display: block; /* Als Block-Element anzeigen */
  text-align: left; /* Text links ausrichten */
  font-family: Arial, sans-serif; /* Schriftart festlegen */
  font-size: 14px; /* Schriftgröße festlegen */
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

#age img {
    cursor: pointer;
}

  </style>
  
