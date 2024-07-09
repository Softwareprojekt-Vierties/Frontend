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
              <label class="description">Aktuelle Gerichte:</label>
              <Caterer v-if="id" :idFromFather="id"/>
            </div>
        </div>
        <br>
          <div class="long-description">
          <label class="description">Bewertungen:</label>
            <DishForm v-if="idSent" :idFromFather="idSent" :typeOfReview="reviewType"/>
        </div>
        </div>
        <div id="right-side">
            <Info v-model:hasBookmark="hasBookmark" type="caterer" :region="region" :category="kategorie" :experience="erfahrung" :price="preis" />
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
  import Caterer from '../components/CatererComponent.vue';
  import Header from '../components/ViewHeader.vue';
  import LongDescription from '../components/LongDescription.vue';
  import Info from '../components/RightSideInfo.vue';
  import axios from 'axios'; 


  export default {
    components: {
      DishForm,
      ArtistCard,
      Caterer,
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
        userId:'',
        reviewType :0,
        events: [],
        idSent:'',
        isOwner:'',
          hasBookmark: false,
        
      };
    },

    computed: {
      buttonLabel() {
      return this.isOwner ? 'Edit Caterer' : 'Event Erstellen';
    }
    },

    async created(){
    this.idSent = this.$route.params.id;
    const token = localStorage.getItem('authToken');

      try {
          const response = await axios.get(`/getCatererById/${this.idSent}`,{headers: {'auth':token}});
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
        this.isOwner = data['isOwner'];
        this.hasBookmark = data.caterer.rows[0].favorit;
        console.log("my events",this.events);
      },
      
      goToAnotherPage() {
        this.$router.push('/search');
      }, 
      weiter(){
      if(this.isOwner === false){
        this.$router.push('/createevent');
      } else{
        this.$router.push({ name : 'EditCatererType', params: {id : this.idSent}});
      }
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
  
  .description {
      text-align: left;
      font-size: 12px;
      margin-bottom: 3px;
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
  
