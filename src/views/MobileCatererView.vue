<template>
    <div id="app">
        <MobileHeaderComponent :imagePreview="imagePreview" :name="eventName" :kurzbeschreibung="kurzbeschreibung" />
        <div>
            <div id="info-bookmark">
                <div id="info-headline">Infos</div>
                <div id="div-bookmark" @click="changeBookmark">
                    <img v-if="isDarkMode && hasBookmark" src="../assets/bookmark-filled.png" id="bookmark">
                    <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
                    <img v-else-if="hasBookmark" src="../assets/bookmark-white.jpg" id="bookmark">
                    <img v-else src="../assets/bookmark-gray.jpg" id="bookmark">
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-left">
                <pre>
Location: {{location}}

Datum: {{datum}}

Zeit: {{startuhrzeit}}Uhr - {{enduhrzeit}}Uhr

Eventgröße: {{anzahlPersonen}} Personen
                </pre>
            </div>
            <div id="info-right">
                <pre>
Preis: {{preis}} €

Altersfreigabe: {{alter}}+

Open Air: {{openAir ? "Ja" : "Nein"}}
                </pre>
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Beschreibung:
            </div>
        </div>
        <div id="description-div">
            <div id="description">
                {{beschreibung}}
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Nächste Events:
            </div>
        </div>
        <div id="event-container">
            <MobileEventCardComponent/><MobileEventCardComponent/><MobileEventCardComponent/><MobileEventCardComponent/><MobileEventCardComponent/>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Gerichte:
            </div>
        </div>
        <div id="palylist-container">
            <MobileCatererComponenet/><MobileCatererComponenet/><MobileCatererComponenet/><MobileCatererComponenet/><MobileCatererComponenet/><MobileCatererComponenet/>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Bewertungen:
            </div>
        </div>
        <div id="review-div">
            <MobileReviewComponent/><MobileReviewComponent/><MobileReviewComponent/><MobileReviewComponent/><MobileReviewComponent/><MobileReviewComponent/><MobileReviewComponent/>
        </div>
        <div id="button-div">
            <div id="button">
                Ticket buchen (20/50)
            </div>
        </div>
        <div id="home-button" v-if="menu">
            <img id="home-mobile" src="../assets/home-mobile.png" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import MobileHeaderComponent from '@/components/MobileHeaderComponent.vue';
import MobileEventCardComponent from '@/components/MobileEventCardComponent.vue';
import MobileReviewComponent from '@/components/MobileReviewComponent.vue';
import MobileCatererComponenet from '@/components/MobileCatererComponenet.vue';

  
export default {
    components: {
        MobileHeaderComponent,
        MobileEventCardComponent,
        MobileReviewComponent,
        MobileCatererComponenet
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
        isOwner:''
        
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
  #main {
  
  }
  
  #info-bookmark {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: center;
      gap: 200px;
      margin-top: 20px;
  }
  
  #info-headline {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
  }
  
  #div-bookmark {
      border-radius: 30px;
      padding: 2px;
      width: 25px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      padding-left: 1px;
      padding-top: 5px;
      cursor: pointer;
      margin-right: 10px;
  }
  
  #bookmark {
      width: 10px;
      height: 17px;
      margin-left: 2px;
  }
  
  #info {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: top;
      gap: 10px;
      height: 120px;
  }
  
  #info-left {
      text-align: left;
      font-size: 10px;
      width: 155px;
  }
  
  #info-right {
      text-align: left;
      font-size: 10px;
      width: 105px;
      margin-right: 15px;
  }
  
  .description-headline-div {
      display: grid;
      grid-template-columns: auto;
      justify-content: center;
      align-items: center;
  }
  
  .description-headline {
      width: 287px;
      text-align: left;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 3px;
  }
  
  #description-div {
      display: grid;
      grid-template-columns: auto;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
  }
  
  #description {
      width: 287px;
      text-align: left;
      font-size: 13px;
  }
  
  #event-container {
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      width: 280px; /* Feste Breite, die du anpassen kannst */
      margin: 0 auto; /* Zentriert den Container horizontal */
      gap: 15px;
      padding: 10px;
      margin-top: -15px;
      margin-bottom: 20px;
  }

  #palylist-container {
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      width: 280px; /* Feste Breite, die du anpassen kannst */
      margin: 0 auto; /* Zentriert den Container horizontal */
      gap: 10px;
      padding: 10px;
      margin-top: -15px;
      margin-bottom: 20px;
  }
  
  #review-div {
      display: flex;
      overflow-x: auto;
      width: 280px;
      margin: 0 auto;
      gap: 10px;
      padding: 10px;
      margin-bottom: 20px;
      margin-top: -7px;
  }
  
  #button-div {
      display: grid;
      grid-template-columns: auto;
      justify-content: center;
      align-items: center;
      padding-bottom: 20px;
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
    
  
