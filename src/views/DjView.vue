<template>
    <div id="app">
        <Header :imagePreview="imagePreview" :name="name" :sterne="sterne" :kurzbeschreibung="kurzbeschreibung" />
  
      <div id="main">
        <div id="left-side">
          <LongDescription :description="beschreibung" />
        <div id="event-dish">
            <div id="event">
              <label class="description">Nächste Events:</label>
              <ArtistCard v-if="events" :eventsFromFather="events"/>
            </div>
            <div id="dish">
              <label class="description">Aktuelle Playlist:</label>
              <Dj v-if="idSent" :idFromFather="idSent" />
            </div>
        </div>
        <br>
          <div class="long-description">
          <label class="description">Bewertungen:</label>
            <DishForm v-if="userid" :idFromFather="userid" :typeOfReview="reviewType"/>
        </div>
        </div>
        <div id="right-side">
            <Info v-model:hasBookmark="hasBookmark" :region="region" :category="kategorie" :experience="erfahrung" :price="preis" />
          <div id="ticket" @click="weiter">
            {{ buttonLabel }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/ReviewComponent.vue';
  import ArtistCard from '../components/ArtistCardComponent.vue';
  import Dj from '../components/DjComponent.vue';
  import Header from '../components/ViewHeader.vue';
  import LongDescription from '../components/LongDescription.vue';
  import Info from '../components/RightSideInfo.vue';
  import axios from 'axios'; 


  export default {
    components: {
      DishForm,
      ArtistCard,
      Dj,
        Header,
        LongDescription,
        Info,
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
        userid:'',
        idSent : '',
        isOwner: '',
        hasBookmark: false,
      };
    },

    computed: {
      headerStyle() {
        return {
          backgroundImage: `url(${this.imagePreview})`,
          backgroundPosition: 'center center',
            backgroundSize: 'cover',
          //filter:flur(8px);
        };
      },
      fileDivStyle() {
        return this.imagePreview
          ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {};
      }, 
      buttonLabel() {
        return this.isOwner ? 'Edit DJ' : 'Event Erstellen';
      }
    },

    async created(){
    this.idSent = this.$route.params.id;
    const token = localStorage.getItem('authToken');
      try {
          const response = await axios.get(`/getArtistById/${this.idSent}`, {headers: {'auth':token}});
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
        this.isOwner = data['isOwner'];
      },
      
      goToAnotherPage() {
        this.$router.push('/search');
      }, 
      weiter(){
        if(this.isOwner === false){
          this.$router.push('/createevent');
        } else{
          this.$router.push({ name : 'EditDjType', params: {id : this.idSent}});
        }
      }
    }, 


  }
  </script>
  
  <style scoped>

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
  
