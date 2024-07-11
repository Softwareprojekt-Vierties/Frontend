<template>
    <div id="app">
        <MobileEditHeader v-model:name="catererName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />
        <div class="description-headline-div">
            <div class="description-headline">
                Infos hinzufügen:
            </div>
        </div>
        <div id="infos">
            <div class="info">
                <div id="left">
                    <div class="input-headline">Addresse:</div>
                    <input v-model="region" placeholder="z.B. 32427 Minden"/>
                    <div class="input-headline">Kategorie:</div>
                    <input v-model="category" placeholder="z.B. Desserts"/>
                </div>
                <div id="right">
                    <div class="input-headline">Erfahrung:</div>
                    <input v-model="experience" placeholder="z.B. 10 Jahre"/>
                    <div class="input-headline">Preis:</div>
                    <input v-model="price" placeholder="z.B. 50 €/Portion"/>
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
        <div id="songs-headline">Gerichte hinzufügen:</div>
        <div id="songs">
            <div id="addcreator" ref="addCreator" class="scroll-container">
                <div class="dish-container">
                  <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                    <MobileDishFrom 
                    ref="dishForm" 
                    :dish="dish" 
                    @remove="removeDish(index)" 
                    @update-dish="updateDish(index, $event)"
                />                
                </div>
                <div class="add-dish-button" @click="addDish"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
                </div>
            </div>
        </div>
        <div id="button-div">
            <div id="button-reset" @click="default_values">
              zurücksetzten
            </div>
            <div id="button-create" @click="updateCaterer">
              aktualisieren
            </div>
        </div>
        <div id="home-button" v-if="menu">
            <img id="home-mobile" src="../assets/home-mobile.png" @click="goToHomePage" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>

<script>
import MobileDishFrom from '../components/MobileDishFrom.vue';
import MobileEditHeader from '../components/MobileEditHeader.vue';
import axios from 'axios'; 


export default {
  components: {
    MobileDishFrom,
    MobileEditHeader,
  },

  data() {
      return {
        menu: '',
        catererName : '',
        shortDescription : '',
        longDescription : '',
        region : '',
        category : '',
        experience : '',
        price : '',
        imagePreview: null,
        uploadedImage: null,
        dishes: [
        { dishName: '', info1: '', info2: '', imagePreview: null }
        ],
        id:''
      };
  },

  computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
  },

  async created(){
        let id = this.$route.params.id;
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get(`/getCatererById/${id}`,{headers: {'auth':token}});
            console.log(response);
            this.originalData = { ...response.data };
            this.setFormData(response.data);
            console.log('Caterer data received:', response.data);
        } 
        catch (error) {
            console.error('Error with sending Caterer ID to DB :', error);
        }
    },

  methods: {

    updateDish(index, updatedDish) {
        this.dishes.splice(index, 1, updatedDish);
    },

    setFormData(data) {

        const myVar = data["caterer"].rows[0].region.split(',');


        this.catererName = data["caterer"].rows[0].profilname;
        this.imagePreview = data["caterer"].rows[0].profilbild;
        this.shortDescription = data["caterer"].rows[0].kurzbeschreibung;
        this.longDescription = data["caterer"].rows[0].beschreibung;
        this.region = myVar[1];
        this.street = myVar[0];
        this.category = data["caterer"].rows[0].kategorie;
        this.experience = data["caterer"].rows[0].erfahrung;
        this.price = data["caterer"].rows[0].preis;

        this.uploadedImage = data["caterer"].rows[0].profilbild;
        this.dishes = [];
        data['gerichte'].rows.forEach(gericht => {
            this.dishes.push({
            id: gericht['id'],
            dishName: gericht['name'], 
            info1: gericht['beschreibung'].split(", ")[0],
            info2: gericht['beschreibung'].split(", ")[1],  
            imagePreview: gericht['bild']
            })
    });
    },

    goToHomePage() {
    this.$router.push('/search');
    },

    onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.uploadedImage = file;
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
    },

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
    resetDishForm(index) {
      this.$refs.dishForm[index].clearFields();
    },

    default_values() {
        this.catererName = this.originalData["caterer"].rows[0]["profilname"] ;
        this.shortDescription = this.originalData["caterer"].rows[0]["kurzbeschreibung"];
        this.longDescription = this.originalData["caterer"].rows[0]["beschreibung"];
        const myVar = this.originalData["caterer"].rows[0].region.split(',');
        this.region = myVar[1];
        this.category = this.originalData["caterer"].rows[0]["kategorie"];
        this.experience = this.originalData["caterer"].rows[0]["erfahrung"];
        this.price = this.originalData["caterer"].rows[0]["preis"];
        this.imagePreview = this.originalData["caterer"].rows[0]["profilbild"];
        this.uploadedImage = this.originalData["caterer"].rows[0]["profilbild"];
        this.street = myVar[0];
        this.dishes = [];
        this.originalData['gerichte'].rows.forEach(gericht => {
            this.dishes.push({
              id: gericht['id'],
              dishName: gericht['name'], 
              info1: gericht['beschreibung'].split(", ")[0],
              info2: gericht['beschreibung'].split(", ")[1],  
              imagePreview: gericht['bild']
            })
        });
  
    },
    async updateCaterer(){
        if (!this.catererName || !this.shortDescription || !this.longDescription || !this.region || !this.category || !this.experience || !this.price || !this.imagePreview) {
          alert('Please fill in all required fields.');
          return;
        }


  
        let formData = {};
          //formData.benutzername = this.catererName;
          formData.profilname = this.catererName;
          //formData.email = this.catererName;
          //formData.password = this.catererName;
          formData.profilbild = this.imagePreview;
          formData.kurzbeschreibung = this.shortDescription;
          formData.beschreibung = this.longDescription;
          formData.region = this.street +','+ this.region; 
          formData.preis = +this.price;
          formData.kategorie = this.category;
          formData.erfahrung = this.experience;
          formData.gerichte = this.dishes;
  
          console.log('FormData:', formData); 
  
  
        const token = localStorage.getItem('authToken'); 
  
        try {
            const response = await axios.post('/updateCaterer', formData, {headers: {'auth':token}});
            console.log('Caterer updated:', response.data);
            alert('Caterer updated successfully!');
          } catch (error) {
            console.error('Error with Caterer update:', error);
            alert('Error updating Caterer. Please try again.');
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

#headline-text {
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
    width: 305px;
    margin: 0 auto;
}

#addcreator {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  padding: 7px;
  padding-left: 5px;
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
