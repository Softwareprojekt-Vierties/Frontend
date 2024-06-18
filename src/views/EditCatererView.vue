<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img alt="Filer" class="icon" src="../assets/home.jpg" @click="goToHomePage">
        </div>
        <div id="picture-name">
          <div id="file-div" :style="fileDivStyle">
            <div id="file-upload">
              <label id="image-text" for="fileToUpload">
                <img v-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
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
                          <img v-if="!dish.imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon-comp" />
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
                <div class="add-dish-button" @click="addDish"><img src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
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
            this.originalData = { ...response.data["caterer"].rows[0] };
            this.setFormData(response.data);
            console.log('Caterer data received:', this.dishes);
        } 
        catch (error) {
            console.error('Error with sending Caterer ID to DB :', error);
        }
    },

    computed: {
  
        fileDivStyle() {
            return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
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
          this.dishes[index].imagePreview = URL.createObjectURL(file);
          this.dishes[index].uploadedImage = file;
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
        this.setFormData(this.originalData);
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
:root html, body {
  width: 100%;
  height: 100%;
  background-color: rgb(242, 242, 242);
}

#header {
  background-color: rgb(213, 213, 213);
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
  background-color: white;
  margin-left: 10px;
}

.icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

#name-description {
  border-radius: 10px;
  background-color: white;
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
  background-color: white;
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
  color: #999999;
  margin-top: 0; /* Remove any top margin to bring it closer to the image */
}

#main {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  background-color: rgb(242, 242, 242);
  padding-top: 30px;;
  gap: 20px;
}

.long-description {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  display: grid;
  grid-template-columns: 580px;
  justify-content: left;
  font-weight: bold;
}

#right-side-info {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
}

.infos {
  display: grid;
  grid-template-columns: 180px;
  margin-top: 20px;
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
}

#break {
  background-color: rgb(254, 68, 77);
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
  background-color: rgb(146, 208, 80);
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
  background-color: rgb(242, 242, 242);
}

#dish-form {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding-left: 12px;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 15px;
  margin-left: 5px;
}

#file-div-comp {
  width: 120px;
  height: 108px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 5px;
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

.upload-icon-comp {
  max-width: 50%;
  max-height: 50%;
  margin-bottom: -10px; /* Adjust margin to bring the text closer */
  margin-left: 5px;
  margin-top: -5px;
}

#upload-text-comp {
  color: rgb(209, 209, 209);
  padding-top: 5px;
  font-size: 7px;
}

#right {
  display: grid;
  grid-template-columns: auto;
}

#text-component {
text-align: left;
font-size: 11px;
margin-top: 5px;
}

.input-comp {
width: 130px;
border-radius: 5px;
border: 1px solid #000;
margin-top: 5px;
font-size: 10px;
padding: 3px;
padding-left: 10px;
}

#ingredients {
text-align: left;
font-size: 10px;
margin-top: 5px;
border-top: 1px solid rgb(200, 200, 200);
padding-top: 5px;
}
</style>