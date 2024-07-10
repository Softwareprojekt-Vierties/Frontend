<template>
    <div id="app">
      <MobileEditHeader v-model:name="djName" v-model:kurzbeschreibung="shortDescription" v-model:imagePreview="imagePreview" :onFileChange="onFileChange" />
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
                    <input v-model="category" placeholder="z.B. Techno"/>
                </div>
                <div id="right">
                    <div class="input-headline">Erfahrung:</div>
                    <input v-model="experience" type="number" min ="0" placeholder="z.B. 10 Jahre"/>
                    <div class="input-headline">Preis:</div>
                    <input  v-model="price" type="number" min ="0"  placeholder="z.B. 50 €/h"/>
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
        <div id="songs-headline">Songs hinzufügen:</div>
        <div id="songs">
            <div id="addcreator" ref="addCreator" class="scroll-container">
                <div class="dish-container">
                <div v-for="(song, index) in songs" :key="index" class="dish-item">
                    <MobileMusicComponent :song="song" @update:song="updateSong(index, $event)" />
                </div>
                <div class="add-dish-button" @click="addSong"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
                </div>
            </div>
        </div>
        <div id="button-div">
            <div id="button-reset" @click="reset">
              zurücksetzten
            </div>
            <div id="button-create" @click="updateDJ">
              erstellen   
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
import axios from 'axios';
import MobileEditHeader from '@/components/MobileEditHeader.vue';
import MobileMusicComponent from '@/components/MobileMusicComponent.vue';

export default {
    components: {
        MobileEditHeader,
        MobileMusicComponent
    },
  data() {
    return {
      menu: '',
      djName: '',
      shortDescription: '',
      longDescription: '',
      region: '',
      category: '',
      experience: '',
      price: '',
      imagePreview: null,
      uploadedImage: null,
      songs: [
        { songName: '', songLength: '', songYear: '' }
      ],
      id:'',
      originalData : {}
    };
  },
  computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
  },
  methods: {

    handleClick() {
        if(this.menu) {
            this.menu = false;
        }
        else {
            this.menu = true;
        }
    },

    updateSong(index, updatedSong) {
        this.songs.splice(index, 1, updatedSong);
    },

    async updateDJ() {
      if (!this.djName || !this.shortDescription || !this.longDescription || !this.region || !this.category || !this.experience || !this.price || !this.imagePreview) {
          alert('Please fill in all required fields.');
          return;
      }

      let formData = {};
      formData.profilname = this.djName;
      formData.kurzbeschreibung = this.shortDescription;
      formData.beschreibung = this.longDescription;
      formData.region = this.region;
      formData.kategorie = this.category;
      formData.erfahrung = this.experience;
      formData.preis = this.price;
      formData.email = this.email;
      formData.profilbild = this.imagePreview;
      formData.songs = this.songs;
      formData.id = this.id;
      console.log('FormData:', formData); 

      const token = localStorage.getItem('authToken'); 

      try {
        const response = await axios.post('/updateArtist', formData, {headers: {'auth':token}});
        console.log('Artist updated:', response.data);
        alert('Artist updated successfully!');
      } catch (error) {
        console.error('Error with Artist update:', error);
        alert('Error with Artist update. Please try again.');
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
    addSong() {
      this.songs.push({ songName: '', songLength: '', songYear: '' });
        this.$nextTick(() => {
          const container = this.$refs.addCreator; // Verwendet ref, um den Container zu referenzieren
          container.scrollLeft = container.scrollWidth - container.clientWidth; // Scrollt zum rechten Ende des Containers
        });
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    reset() {
      this.djName = this.originalData["artist"].rows[0]["benutzername"];
      this.shortDescription =this.originalData["artist"].rows[0]["kurzbeschreibung"];
      this.longDescription = this.originalData["artist"].rows[0]["beschreibung"] ;
      this.region = this.originalData["artist"].rows[0]["region"];
      this.category = this.originalData["artist"].rows[0]["kategorie"];
      this.experience =  this.originalData["artist"].rows[0]["erfahrung"];
      this.price = this.originalData["artist"].rows[0]["preis"];
      this.imagePreview = this.originalData["artist"].rows[0]["profilbild"];
      this.uploadedImage = this.originalData["artist"].rows[0]["profilbild"];
      this.email = this.originalData["artist"].rows[0]["emailfk"];
      this.songs  =[];
      this.originalData["lieder"].rows.forEach(lied => {
        this.songs.push({
          id: lied['id'],
          songName: lied['name'], 
          songLength: lied['laenge'], 
          songYear: lied['erscheinung'].substring(0, 10)
        })
      });
    },

    setFormData(data) {
      this.djName = data['artist'].rows[0].benutzername;
      this.shortDescription = data['artist'].rows[0].kurzbeschreibung;
      this.longDescription = data['artist'].rows[0].beschreibung ;
      this.region = data['artist'].rows[0].region;
      this.category = data['artist'].rows[0].kategorie;
      this.experience =  data['artist'].rows[0].erfahrung;
      this.price = data['artist'].rows[0].preis;
      this.imagePreview = data['artist'].rows[0].profilbild;
      this.uploadedImage = data['artist'].rows[0].profilbild;
      this.email = data['artist'].rows[0].emailfk;
      this.songs = []; // use empty Array to remove example container
      data['lieder'].rows.forEach(lied => {
        this.songs.push({
          id: lied['id'],
          songName: lied['name'], 
          songLength: lied['laenge'], 
          songYear: lied['erscheinung'].substring(0, 10)
        })
      });
    },

    goToHomePage() {
      this.$router.push('/search');
    },
    
  }
  ,
  async created(){
    this.id = this.$route.params.id;
    const token = localStorage.getItem('authToken'); 

      try {
        console.log("i'm here");
          const response = await axios.get(`/getArtistById/${this.id}`,{headers: {'auth':token}});
          console.log(response);
          this.originalData = { ...response.data };
          this.setFormData(response.data);
          console.log('dj data received:', response.data);
      } catch (error) {
          console.error('Error with sending dj ID to DB :', error);
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
