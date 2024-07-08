<template>
    <div id="app">
        <MobileHeaderComponent :imagePreview="imagePreview" :name="name" :kurzbeschreibung="kurzbeschreibung" :sterne ="sterne" />
        <div>
            <div id="info-bookmark">
                <div id="info-headline">Infos</div>
                <div id="div-bookmark">
                    <Bookmark v-model:hasBookmark="hasBookmark" :id="$route.params.id" type="location" width="10px" height="17px" margin-left="1px" wrappingDiv="div-bookmark" />
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-left">
                
                <label class="info-subheadline"><strong>Stadt:</strong> {{region}}</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Straße:</strong> {{addresse}} </label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Kapazität:</strong>{{ kapazitaet }} Personen</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Preis:</strong> {{preis}} € </label>
   
            </div>
            <div id="info-right">
                <label class="info-subheadline"><strong>Fläche:</strong> {{ flaeche }} ha.</label>
                <br>
                <br>
                <label class="info-subheadline"><strong>Open Air:</strong> {{openair ? "Ja" : "Nein"}}</label>

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
                Karte:
            </div>
            <div id="maps-div" style="height: 200px;"></div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Bewertungen:
            </div>
        </div>
        <div id="review-div">
            <MobileReviewComponent 
                v-for="(review, index) in reviews" 
                :key="index" 
                :userName="review.userName" 
                :rating="review.rating" 
                :reviewText="review.reviewText"
            />
        </div>
        <div id="button-div">
            <div id="button" @click="weiter">
                {{ buttonLabel }}
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
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileHeaderComponent from '@/components/MobileHeaderComponent.vue';
import MobileReviewComponent from '@/components/MobileReviewComponent.vue'
import Bookmark from '@/components/BookmarkComponent.vue';

  
export default {
    components: {
        MobileHeaderComponent,
        MobileReviewComponent,
        Bookmark,
    },
    data() {
        return {
        menu : false,
        name: '',
        kurzbeschreibung: '',
        beschreibung: '',
        region: '',
        addresse: '',
        kapazitaet: '',
        preis: '',
        flaeche: '',
        openair: false,
        imagePreview: null,
        bild: null,
        sterne: '',
        map: null,
        marker: null,
        id:'',
        idSent: '',
        reviewType : 1,
        isOwner: '',
        reviews : [],
        hasBookmark: false,
        };
    },

    async created() {
        this.idSent = this.$route.params.id;
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`/getLocation/${this.idSent}`, {headers: {'auth':token}});
            console.log(response.data);
            this.setFormData(response.data);
            this.geocodeAddress();
        } catch (error) {
            console.error('Error with sending location ID to DB :', error);
        }
        this.getReview();
    },

    computed: {
        fileDivStyle() {
            return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
        },
        headerStyle() {
            return {
                backgroundImage: `url(${this.imagePreview})`,
                backgroundSize: '340%',
                backgroundPosition: 'center center'
            };
        }, 
        buttonLabel() {
            return this.isOwner ? 'Edit Location' : 'Event Erstellen';
        }
    },
    methods: {

        async getReview() {
            try {
                const response = await axios.get(`/getLocationReview/${this.idSent}`);
                this.reviews = response.data.rows;
                console.log("Review data received:", this.reviews);
                this.setFormDataReview(this.reviews);
            } catch (error) {
                console.error('Error with sending review ID to DB:', error);
            }
        },

        setFormDataReview(data) {
            if (data.length > 0) {
                this.reviews=[];
                data.forEach(content => {this.reviews.push({

                    userName : content.profilname,
                    rating: content.sterne,
                    reviewText : content.inhalt
                });
            
            });
            }
        },

        goToHomePage(){
            this.$router.push('/search');
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

        handleClick() {
            if(this.menu) {
                this.menu = false;
            }
            else {
                this.menu = true;
            }
        },

        setFormData(data) {
            const myVar = data['result'].rows[0].adresse.split(',');
            this.name = data['result'].rows[0].name;
            this.kurzbeschreibung = data['result'].rows[0].kurzbeschreibung;
            this.beschreibung = data['result'].rows[0].beschreibung;
            this.region = myVar[1];
            this.addresse = myVar[0];
            this.kapazitaet = data['result'].rows[0].kapazitaet;
            this.preis = data['result'].rows[0].preis;
            this.flaeche = data['result'].rows[0].flaeche;

            if (data['result'].rows[0].openair == true) {
                this.openair = 'Ja';
            } else {
                this.openair = 'Nein';
            }
            this.imagePreview = data['result'].rows[0].bild;     
            this.bild = data['result'].rows[0].bild;
            this.sterne = data['result'].rows[0].sterne;
            this.id = data['result'].rows[0].id;
            this.isOwner = data['isOwner'];
        },

        goToAnotherPage() {
            this.$router.push('/search');
        },
        
        async geocodeAddress() {
            const address = `${this.addresse}, ${this.region}`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

            try {
                const response = await axios.get(url);
                if (response.data.length > 0) {
                    const location = response.data[0];
                    this.showMap(location.lat, location.lon);
                } 
                else {
                    console.error('No location found for this address');
                }
            } 
            catch (error) {
                console.error('Failed to fetch coordinates:', error);
            }
        },
        showMap(lat, lon) {
            if (this.map) this.map.remove();
                this.map = Leaflet.map('maps-div').setView([lat, lon], 16);
                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
                var customIcon = Leaflet.icon({
                    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
            });
            this.marker = Leaflet.marker([lat, lon], { icon: customIcon }).addTo(this.map);
        },
        weiter(){
            if(this.isOwner === false){
                this.$router.push('/createevent');
            } else{
                this.$router.push({ name : 'EditLocationType', params: {id : this.idSent}});
            }
        }
    }
};
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



#review-div {
    display: flex;
    overflow-x: auto;
    width: 280px;
    margin: 0 auto;
    gap: 10px;
    padding: 10px;
    margin-bottom: 20px;
}

#maps-div {
  border: 1px solid #000000;
  border-radius: 8px;
  margin-top: 3px;
  margin-bottom: 20px;
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

.info-subheadline {
  text-align: left;
  font-size: 12px;
}
  </style>
  
  
