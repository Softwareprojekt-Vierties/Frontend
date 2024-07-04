<template>
    <div id="app">
      <div id="header" :style="headerStyle">
        <div id="icon-div">
          <img @click="goToAnotherPage" alt="Filer" class="icon" src="../assets/home.jpg">
        </div>
        <div id="picture-name">
          <div id="file-div" :style="fileDivStyle">
          </div>
          <div id="name-description">
            <div class="name-description-input">
                <div id="name-stars">
                    <label id="name">{{ name }}</label>
                    <div class="stars">
                      <span v-for="star in 5" :key="star" class="star" v-bind:class="{ 'filled': star <= sterne }">★</span>
                    </div>
                </div>
            </div>
            <div class="name-description-input">
              <label id="description-short">{{ kurzbeschreibung }}</label>
            </div>
          </div>
        </div>
      </div>
  
      <div id="main">
        <div id="left-side">
          <div class="long-description">
            <label class="description">Beschreibung:</label>
            <div id="long-description-text">{{ beschreibung }}</div>
          </div>
        <div id="event-dish">
            <div id="event">
              <label class="description">Nächste Events:</label>
              <ArtistCard v-if="events" :eventsFromFather="events"/>
            </div>
            <div id="dish">
              <label class="description">Aktuelle Playlist:</label>
              <Dj v-if="id" :idFromFather="id" />
            </div>
        </div>
        <br>
          <div class="long-description">
          <label class="description">Bewertungen:</label>
            <DishForm v-if="userid" :idFromFather="userid" :typeOfReview="reviewType"/>
        </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <div id="info-bookmark">
                <label id="info-headline">Infos</label>
                <div id="div-bookmark">
                  <img src="../assets/bookmark-white.jpg" id="bookmark">
                </div>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Region:</strong> {{region}}</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Kategorie:</strong> {{kategorie}}</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Erfahrung:</strong> {{erfahrung }} Jahre</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Preis:</strong> {{ preis }} €/h</label>
            </div>
          </div>
          <div id="ticket">
            DJ buchen (20/50)
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/ReviewComponent.vue';
  import ArtistCard from '../components/ArtistCardComponent.vue';
  import Dj from '../components/DjComponent.vue';
  import axios from 'axios'; 


  export default {
    components: {
      DishForm,
      ArtistCard,
      Dj
    },
    data() {
      return {
        name : '',
        sterne: '',
        kurzbeschreibung:'',
        beschreibung: '',
        region: '',
        kategorie : '',
        erfahrung  :'',
        preis : '',
        imagePreview : null,
        id:'',
        reviewType :0,
        events : [],
        userid:''
        
      };
    },

    computed: {
      headerStyle() {
        return {
          backgroundImage: `url(${this.imagePreview})`,
          backgroundSize: '340%',
          backgroundPosition: 'center center'
          //filter:flur(8px);
        };
      },
      fileDivStyle() {
        return this.imagePreview
          ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {};
      }
    },

    async created(){
    let id = 4;
      try {
          const response = await axios.get(`/getArtistById/${id}`);
          console.log(response);
          this.setFormData(response.data);
          console.log('dj data received:', response.data);
      } catch (error) {
          console.error('Error with sending dj ID to DB :', error);
        }
    },

    methods: {

      setFormData(data){

        const myVar =data['artist'].rows[0].region.split(',');
        console.log(myVar[0]);
        console.log(myVar[1]);

        this.name = data['artist'].rows[0].benutzername;
        this.kurzbeschreibung = data['artist'].rows[0].kurzbeschreibung;
        this.beschreibung = data['artist'].rows[0].beschreibung ;
        this.region =myVar[1] ;
        this.kategorie = data['artist'].rows[0].kategorie;
        this.erfahrung = data['artist'].rows[0].erfahrung;
        this.preis = data['artist'].rows[0].preis;
        this.imagePreview = data['artist'].rows[0].profilbild;
        this.sterne = data['artist'].rows[0].sterne;
        this.userid = data['artist'].rows[0].userid;
        this.id = data['artist'].rows[0].id;
        this.events = data['events'].rows;
      },
      
      goToAnotherPage() {
        this.$router.push('/search');
      }
    }
  }
  </script>
  
  <style scoped>

#header {
    background-color: var(--create-page-header-background);
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
    background-color: var(--textfield-background);
    margin-left: 10px;
}

.icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
}

#name-description {
    background-color: var(--create-page-header-background);
    padding: 10px;

    background-color: transparent;
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

.name-description-input {
    display: grid;
    grid-template-columns: 300px;
    justify-content: left;
}

.description {
    text-align: left;
    margin-bottom: 3px;
    font-size: 13px;
    font-weight: bold;
}

#file-div {
    width: 250px;
    height: 180px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    background-color: var(--textfield-background);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -225px;
}

#main {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    background-color: var(--create-page-background);
    padding-top: 30px;
    gap: 20px;
}

#left-side {
    margin-left: -20px;
}

.long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
    display: grid;
    justify-content: left;
    font-weight: bold;
}

#right-side-info {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
}

.infos {
    display: grid;
    margin-top: 20px;
    margin-right: 10px;
}

.time-value-left {
    width: 71.9px;
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    margin-right: 5px;
}

.time-value-right {
    width: 71.9px;
    text-align: center;
    border: 1px solid #000000; /* Rahmenstil */
    border-radius: 5px; /* Abgerundete Ecken */
    height: 25px;
    margin-left: 5px;
}

.info-subheadline {
    text-align: left;
    font-size: 12px;
}

#long-description-text {
    width: 580px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    border-radius: 8px;
    resize: none;
    text-align: left;
    text-decoration: none;
    font-weight: lighter;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
}

#add-location-icon {
    width: 25px;
    height: 25px;
    margin-top: 4px;
}

#add-location {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    cursor: pointer;
    background-color: var(--textfield-background);
}

#info-headline {
    display: block; /* Als Block-Element anzeigen */
    text-align: left; /* Text links ausrichten */
    font-family: Arial, sans-serif; /* Schriftart festlegen */
    font-size: 18px; /* Schriftgröße festlegen */
    font-weight: bold;
}

#ticket {
    background-color: var(--green);
    color: var(--simple-font-color);
    height: 30px;
    border-radius: 7px;
    border: 1px solid #000000;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 10px;
}

#info-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
}

#div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
}

#bookmark {
    width: 10px;
    height: 17px;
}

#addcreator {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    align-items: center;
    padding: 20px 0;
    margin-top: -25px;
}

.dish-item {
    display: inline-block;
    margin-right: 10px;
    flex: 0 0 auto;
    margin-left: 10px;
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

.long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    padding: 10px;
    display: grid;
    grid-template-columns: 580px;
    justify-content: left;
    font-weight: bold;
}

#maps {
    border-radius: 8px;
}

#maps-div {
    border: 1px solid #000000;
    border-radius: 8px;
    margin-top: 15px;
}


#event-dish {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
}

.stars{
    margin-bottom: 10px;
}

.star {
    color: #ccc; 
    font-size: 27px; 
}

.star.filled {
    color: #f5d130; 

}

#name-stars {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    align-items: center;
    gap: 10px;
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

#app {
    min-height: 100vh;
    background-color: var(--create-page-background);
}
  </style>
  
