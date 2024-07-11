<template>
    <div id="app">
        <MobileEditHeader v-model:name="personName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" />
        <div class="description-headline-div">
            <div class="description-headline">
                Infos hinzufügen:
            </div>
        </div>
        <div id="infos">
            <div class="info">
                <div id="left">
                    <div class="input-headline">Addresse:</div>
                    <input v-model="region" class="infos" placeholder="z.B. 32427 Minden"/>
                </div>
                <div id="right">
                    <div class="input-headline">Alter:</div>
                    <input v-model="age" type="number" class="infos" placeholder="z.B. 18 Jahre"/>
                </div>
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline-more-infos">
                Lieblings Eventarten hinzufügen:
            </div>
            <input v-model="favoriteEventTypes" class="more-infos" placeholder="z.B. Techno, Geburtstagsfeier"/>
            <div class="description-headline-more-infos">
                Lieblings Lieder hinzufügen:
            </div>
            <input v-model="favoriteSong" class="more-infos" placeholder="z.B. Party-Song, Disco-Song"/>
            <div class="description-headline-more-infos">
                Lieblings Gerichte hinzufügen:
            </div>
            <input v-model="favoriteDish" class="more-infos" placeholder="z.B. Kuchen, Eis"/>
        </div>
        <div id="description"> 
            <div id="description-headline">
                <div class="description-headline">
                    Beschreibung hinzufügen:
                </div>
            </div>
          <textarea v-model="longDescription" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
        </div>
        <div id="songs-headline">Bilder hinzufügen:</div>
        <div id="songs">
            <div id="addcreator" ref="addCreator" class="scroll-container">
                <div class="dish-container">
                    <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                        <MobilePictureComponent :dish="dish" @remove="removeDish(index)" :imageGrabber="image => {dishes[index] = image;}" />
                    </div>
                <div class="add-dish-button" @click="addDish"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
                </div>
            </div>
        </div>
        <div id="button-div">
            <div id="button-reset" @click="reset">
              zurücksetzten
            </div>
            <div id="button-create" @click="createPerson">
              erstellen
            </div>
        </div>
        <div id="home-button" v-if="menu" @click="$router.push('/')">
            <img id="home-mobile" src="../assets/home-mobile.png" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>
  
  <script>
  import MobileEditHeader from '../components/MobileEditHeader.vue';
  import MobilePictureComponent from '../components/MobilePictureComponent.vue'
  import axios from 'axios';
  
  export default {
    components: {
        MobileEditHeader,
        MobilePictureComponent
    },
    data() {
      return {
        menu: '',
        dishes: [null],
        personName: "",
        shortDescription: "",
        longDescription: "",
        region: "",
        favoriteEventTypes: "",
        favoriteDish: "",
        favoriteSong: "",
        imagePreview: null,
        age: 0,
        isModalVisible: false
      };
    },
      methods: {
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
            async createPerson() {
                if (!this.personName || !this.shortDescription || !this.longDescription || !this.region
                    || !this.favoriteEventTypes || !this.favoriteDish || !this.favoriteSong) {
                    alert('Please fill in all required fields.');
                    return;
                }

                let formData = {};
                formData.profilname = this.personName;
                formData.kurzbeschreibung = this.shortDescription;
                formData.beschreibung = this.longDescription;
                formData.region = this.region;
                formData.alter = this.age;
                formData.eventarten = this.favoriteEventTypes;
                formData.lieblingslied = this.favoriteSong;
                formData.lieblingsgericht = this.favoriteDish;
                formData.partybilder = [];
                this.dishes.forEach(image => {
                    if (image) {
                        formData.partybilder.push(image);
                    }
                });

                if (this.imagePreview) {
                    formData.profilbild = this.imagePreview;
                }

                const token = localStorage.getItem('authToken');

                try {
                    const response = await axios.post('/createEndnutzer', formData, {
                        headers: {
                            "auth": token,
                        }
                    });
                    console.log('Person created:', response.data);
                    localStorage.setItem('authToken', response.data);
                    this.closeModal(); 
                    alert("Ihr Account wurde erfolgreich erstellt.\nBitte melden sie sich jetzt an.");
                    this.$router.push("/");
                } catch (error) {
                    console.error('Error with Person creation:', error);
                }
            },
          reset() {
              this.$router.go();
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
      computed: {
          isDarkMode() {
              return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
          },
      }
  }
  </script>

<style scoped>
#main {

}

.description-headline-div {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

#description-headline {
    display: grid;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.description-headline {
    width: 287px;
    text-align: left;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 3px;
}

.description-headline-more-infos {
    width: 287px;
    text-align: left;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 3px;
}

#infos {
    margin-top: 5px;
    margin-top: -10px;
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

#more-input-headline {
    font-size: 15px;
    font-weight: bold;
}

.infos {
    width: 125px;
    height: 20px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #000000;
    font-size: 11px;
}

.more-infos {
    width: 265px;
    height: 20px;
    border-radius: 5px;
    text-align: left;
    border: 1px solid #000000;
    font-size: 11px;
    margin-bottom: 25px;
    padding-left: 20px
}

#headline-text {
    width: 220px;
    font-size: 15px;
    font-weight: bold;
    height: 15px;
    margin-top: 30px;
    margin-right: 100px;
    margin-bottom: 3px;
}

#songs-headline {
    font-size: 15px;
    font-weight: bold;
    height: 15px;
    margin-top: 30px;
    margin-right: 155px;
    margin-bottom: -2px;
}

#songs {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;
    width: 300px;
    margin: 0 auto;
}

#addcreator {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  padding: 7px;
}

.dish-item {
  display: inline-block;
  margin-right: 10px;
  flex: 0 0 auto;
}

.add-dish-button {
  display: inline-flex;
  align-items: center;
  justify-content: left;
  cursor: pointer;
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

  #long-description-input {
  width: 267px;
  height: 150px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 8px;
  resize: none;
}

  input {
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  input::placeholder {
      color: var(--placeholder-color);
  }

  textarea {
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  textarea::placeholder {
      color: var(--placeholder-color);
  }

#button-div {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 30px;
  padding-bottom: 20px;
}

#button-reset {
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

#button-create {
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
  
  #button {
      background-color: var(--green);
      width: 285px;
      height: 30px;
      border-radius: 5px;
      border: 1.5px solid #000000;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
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
</style>
