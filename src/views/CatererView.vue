<template>
    <div id="app">
      <div id="header" :style="headerStyle">
          <div id="header-inner">
              <HomeButton :isLoggedIn="true" />
        <div id="picture-name">
          <Image :url="imagePreview" width="250px" height="180px" marginLeft="-225px" borderRadius="10px" boxShadow="0 0 10px rgba(0, 0, 0, 0.8)" />
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
              <label class="description">Aktuelle Gerichte:</label>
              <Caterer v-if="id" :idFromFather="id"/>
            </div>
        </div>
        <br>
          <div class="long-description">
          <label class="description">Bewertungen:</label>
            <DishForm v-if="id" :idFromFather="userId" :typeOfReview="reviewType"/>
        </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
              <Bookmark :isFavorite="false" :id="id" type="caterer" />
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
            Caterer buchen
          </div>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/ReviewComponent.vue';
  import ArtistCard from '../components/ArtistCardComponent.vue';
  import Caterer from '../components/CatererComponent.vue';
  import Bookmark from '../components/ViewPageBookmark.vue';
  import HomeButton from '../components/HomeButton.vue';
  import Image from '../components/ImageComponent.vue';
  import axios from 'axios'; 


  export default {
    components: {
      DishForm,
      ArtistCard,
      Caterer,
        Bookmark,
        HomeButton,
        Image,
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
        userId:'',
        reviewType :0,
        events: []
        
      };
    },

    computed: {
      headerStyle() {
        return {
          backgroundImage: `url(${this.imagePreview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
          //filter:flur(8px);
        };
      },
    },

    async created(){
    let id = 14;
      try {
          const response = await axios.get(`/getCatererById/${id}`);
          console.log(response);
          this.setFormData(response.data);
          console.log('dj data received:', response.data);
      } catch (error) {
          console.error('Error with sending Caterer ID for caterer page to DB :', error);
        }
    },

    methods: {

      setFormData(data){

        const myVar =data['caterer'].rows[0].region.split(',');
        console.log(myVar[0]);
        console.log(myVar[1]);

        this.name = data['caterer'].rows[0].profilname;
        this.kurzbeschreibung = data['caterer'].rows[0].kurzbeschreibung;
        this.beschreibung = data['caterer'].rows[0].beschreibung ;
        this.region =myVar[1] ;
        this.kategorie = data['caterer'].rows[0].kategorie;
        this.erfahrung = data['caterer'].rows[0].erfahrung;
        this.preis = data['caterer'].rows[0].preis;
        this.imagePreview = data['caterer'].rows[0].profilbild;
        this.sterne = data['caterer'].rows[0].sterne;
        this.userId = data['caterer'].rows[0].userid;
        this.id = data['caterer'].rows[0].id;
        this.events = data['events'].rows;
        console.log("my events",this.events);
      },
      
      goToAnotherPage() {
        this.$router.push('/search');
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
  
  #name-description {
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
  
  #main {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    background-color: rgb(242, 242, 242);
    padding-top: 30px;
    gap: 20px;
  }

  #left-side {
    margin-left: -20px;
  }
  
  .long-description {
    border-radius: 10px;
    background-color: white;
    padding: 10px;
    display: grid;
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
    background-color: white;
  }
  
  #info-headline {
    display: block; /* Als Block-Element anzeigen */
    text-align: left; /* Text links ausrichten */
    font-family: Arial, sans-serif; /* Schriftart festlegen */
    font-size: 18px; /* Schriftgröße festlegen */
    font-weight: bold;
  }
  
  #ticket {
    background-color: rgb(146, 208, 80);
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

#add-icon {
  width: 24px;
  height: 24px;
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

#maps {
  border-radius: 8px;
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
  </style>
  
