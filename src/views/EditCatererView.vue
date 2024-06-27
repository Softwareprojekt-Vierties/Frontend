<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png" @click="goToHomePage">
          <img alt="Filer" class="icon" v-else src="../assets/home.jpg" @click="goToHomePage">
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
              <label class="description">Name:</label>
              <input v-model="catererName" class="header-input" type="text" placeholder="z.B. Name"><br>
            </div>
            <div class="name-description-input">
              <label class="description">Kurze Beschreibung hinzufügen:</label>
              <input v-model="shortDescription" class="header-input" type="text" placeholder="z.B. 24/7">
            </div>
          </div>
        </div>
      </div>
  
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung hinzufügen:</label>
            <textarea v-model="longDescription" id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
          </div>
          <br>
          <div class="long-description">
            <label class="description">Gerichte:</label>
            <div id="addcreator" ref="addCreator" class="scroll-container">
              <div class="dish-container">
                <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                  <div id="dish-form">
                    <div id="file-div-comp" :style="fileDivStyleComponent(dish)">
                      <div id="file-upload">
                        <label id="image-text" for="fileToUpload">
                          <img v-if="!dish.imagePreview && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon-comp" />
                          <img v-else-if="!dish.imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon-comp" />
                          <span id="upload-text-comp" v-if="!dish.imagePreview">Bild hochladen</span>
                        </label>
                        <input class="input-comp" type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChangeComponent($event, index)">
                      </div>
                    </div>
                    <div id="right">
                      <div id="text-component">
                        Gericht 
                      </div>
                      <input class="input-comp" v-model="dish.dishName" id="input" placeholder="z.B. Kuchen">
                      <div id="ingredients">
                        Hauptzutaten:
                      </div>
                      <input class="input-comp" v-model="dish.info1" id="input" placeholder="z.B. Erdbeeren">
                      <input class="input-comp" v-model="dish.info2" id="input" placeholder="z.B. Sahne">
                    </div>
                  </div>
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
              <label  class="info-subheadline">Region:</label>
              <input v-model="region" class="input" type="text" placeholder="z.B. 32427 Minden">
            </div>
            <div class="infos">
              <label class="info-subheadline">Kategorie:</label>
              <input v-model="category" class="input" type="text" placeholder="z.B. Desserts">
            </div>
            <div class="infos">
              <label class="info-subheadline">Erfahrung:</label>
              <input v-model="experience" class="input" type="number" min="0" placeholder="z.B. 10 Jahre">
            </div>
            <div class="infos">
              <label class="info-subheadline">Preis:</label>
              <input v-model="price" class="input" type="number" min="0" placeholder="z.B. 50€ pro Person">
            </div>
          </div>
          <div id="buttons">
            <div id="break"  @click="default_values">
              abbrechen
            </div>
            <div id="continue" @click="createCaterer">
              anlegen
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
<script>
  import axios from 'axios'; 
  
  
  export default {
    components: {
    },
  
    data() {
        return {
        catererName : '',
        shortDescription : '',
        longDescription : '',
        region : '',
        category : '',
        experience : '',
        price : '',
        imagePreview: null,
        uploadedImage: null,
        street : null,
        dishes: [
          { id: '',dishName: '', info1: '', info2: '', imagePreview: null }
        ],
        originalData : {}
  
        };
    },
  
    async created(){
        let id = 14;
        try {
            const response = await axios.get(`/getCatererById/${id}`);
            console.log(response);
            this.originalData = { ...response.data };
            this.setFormData(response.data);
            console.log('Caterer data received:', response.data);
        } 
        catch (error) {
            console.error('Error with sending Caterer ID to DB :', error);
        }
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
  
      goToHomePage() {
      this.$router.push('/search');
      },

      fileDivStyleComponent(dish) {
      return dish.imagePreview ? { backgroundImage: `url(${dish.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
      },

      onFileChangeComponent(event, index) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => {
            this.dishes[index].imagePreview = e.target.result;
            this.dishes[index].uploadedImage = file; // Manter a referência ao arquivo, se necessário
          };
          reader.readAsDataURL(file);
        }
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
      async createCaterer(){
        if (!this.catererName || !this.shortDescription || !this.longDescription || !this.region || !this.category || !this.experience || !this.price || !this.uploadedImage) {
          alert('Please fill in all required fields.');
          return;
        }


  
        let formData = {};
          //formData.benutzername = this.catererName;
          formData.profilname = this.catererName;
          formData.email = this.catererName;
          //formData.password = this.catererName;
          formData.profilbild = this.imagePreview;
          formData.kurzbeschreibung = this.shortDescription;
          formData.beschreibung = this.longDescription;
          formData.region = this.street +','+ this.region; 
          formData.preis = this.price;
          formData.kategorie = this.category;
          formData.erfahrung = this.experience;
          formData.gerichte = this.dishes;
  
          console.log('FormData:', formData); 
  
  
        //const token = localStorage.getItem('authToken'); 
  
        try {
            const response = await axios.post('/updateCaterer', formData);
            console.log('Caterer updated:', response.data);
            alert('Caterer updated successfully!');
          } catch (error) {
            console.error('Error with Caterer update:', error);
            alert('Error updating Caterer. Please try again.');
        }
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
      }
    }
  }
  
</script>
  
<style scoped>
@import "../css/editPages.css"
</style>
