<template>
    <div id="app">
        <MobileEditHeader v-model:name="locationName" v-model:kurzbeschreibung="smallDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />
        <div class="description-headline-div">
            <div class="description-headline">
                Infos hinzufügen:
            </div>
        </div>
        <div id="infos">
            <div class="info">
                <div id="left">
                    <div class="input-headline">Stadt:</div>
                    <input v-model="region" type="text" placeholder="z.B. 32427 Minden"/>
                    <div class="input-headline">Straße:</div>
                    <input v-model="address" type="text" placeholder="z.B. Artilleriestraße 9"/>
                    <div class="input-headline">Kapazität:</div>
                    <input v-model="quantityPersons" type="number" min="0" placeholder="z.B. 200 Personen"/>
                </div>
                <div id="right">
                    <div class="input-headline">Preis:</div>
                    <input v-model="price" class="input" type="number" min="0" placeholder="z.B. 50 €/h"/>
                    <div class="input-headline">Größe:</div>
                    <input v-model="size" type="number" min ="0" placeholder="z.B. 50 ha"/>
                    <div class="input-headline">Open Air:</div>
                    <label class="switch"> <input v-model="openAir" type="checkbox"> <span class="slider round"> </span> </label>
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
        <div id="button-div">
            <div id="button-reset" @click="reset">
             zurücksetzten
            </div>
            <div id="button-create" @click="editLocation">
             aktualisieren               
            </div>
        </div>
        <div id="home-button" v-if="menu">
            <img id="home-mobile" src="../assets/home-mobile.png" @click="goToAnotherPage" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import MobileEditHeader from '@/components/MobileEditHeader.vue';

export default {
    components: {
        MobileEditHeader,
    },

    data() {
      return {
        menu: '',
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
        originalData: {},
        id : null          
      };
    },

    async created(){
      this.id = this.$route.params.id;
      const token = localStorage.getItem('authToken');

      console.log("received id", this.id);
      try {
          const response = await axios.get(`/getLocation/${this.id}`, {headers: {'auth':token}});
          const dbLocation = response.data;
          console.log(dbLocation);
          this.originalData = { ...dbLocation };
          this.setFormData(dbLocation);
          console.log('Location data received:', response.data);
        } catch (error) {
          console.error('Error with sending location ID to DB :', error);

        }
    },

    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    },

    methods: {

        setFormData(data) {

            const myVar = data['result'].rows[0].adresse.split(',');
            this.locationName = data['result'].rows[0].name;
            this.smallDescription = data['result'].rows[0].kurzbeschreibung;
            this.longDescription = data['result'].rows[0].beschreibung;
            this.region = myVar[1];
            this.address = myVar[0];
            this.quantityPersons = data['result'].rows[0].kapazitaet;
            this.price = data['result'].rows[0].preis;
            this.size = data['result'].rows[0].flaeche;
            this.openAir = data['result'].rows[0].openair;
            this.imagePreview = data['result'].rows[0].bild;

        },  

       reset(){
        this.setFormData(this.originalData);
       },

      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      goToAnotherPage() {
        this.$router.push("/search");
      },

      async editLocation() {
        if (!this.locationName || !this.smallDescription || !this.longDescription || !this.region || !this.address 
            || !this.quantityPersons || !this.price || !this.size || !this.imagePreview) {
          alert('Please fill in all required fields.');
          return;
        }

        let formData = {};
            formData.name = this.locationName;
            formData.kurzbeschreibung = this.smallDescription;
            formData.beschreibung = this.longDescription;
            formData.adresse =this.address + ',' + this.region;
            formData.kapazitaet = this.quantityPersons;
            formData.preis = +this.price;
            formData.flaeche = this.size;
            formData.openair = this.openAir;
            formData.bild = this.imagePreview;
            formData.locationid = this.id;
            formData.privat = true;
            console.log(formData);
            console.log("this ist sent to db");

            const token = localStorage.getItem('authToken');

        try {
          const response = await axios.post('/updateLocation', formData, {headers: {'auth':token}});
          console.log('Location edited:', response.data);
          alert('Location edited successfully!');
          //this.reset();
        } catch (error) {
          console.error('Error with Location editing:', error);
          alert('Error editing location. Please try again.');
        }
      },
      handleClick() {
        if(this.menu) {
            this.menu = false;
        }
        else {
            this.menu = true;
        }
      }
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
    margin-top: 25px;
}

.description-headline {
    width: 287px;
    text-align: left;
    font-size: 15px;
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
}

::v-deep .switch {
      position: relative;
      display: inline-block;
      width: 40px; /* Angepasst an die neue Höhe */
      height: 20px;
      margin-left: 37%;
  }

  ::v-deep .switch input { 
      opacity: 0;
      width: 0;
      height: 0;
  }

  ::v-deep .slider {
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

  ::v-deep .slider:before {
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

  ::v-deep input:checked + .slider {
      background-color: var(--cyan);
  }

  ::v-deep input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
  }

  ::v-deep input:checked + .slider:before {
      -webkit-transform: translateX(20px); /* Angepasst an die neue Höhe */
      -ms-transform: translateX(20px); /* Angepasst an die neue Höhe */
      transform: translateX(20px); /* Angepasst an die neue Höhe */
  }

  #headline-text {
    font-size: 15px;
    font-weight: bold;
    height: 15px;
    margin-top: 30px;
    margin-right: 100px;
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
      background-color: white;
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
      background-color: white;
  }
  
  #menu-mobile {
      margin-bottom: -3px;
      width: 20px;
      height: 20px;
  }
</style>
  
