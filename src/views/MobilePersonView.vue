<template>
    <div id="app">
        <MobileHeaderComponent :imagePreview="profilePicture" :name="userName" :kurzbeschreibung="shortDescription" :sterne="-1" />
        <div>
            <div id="info-bookmark">
                <div id="info-headline">Infos</div>
                <div id="div-bookmark">
                    <BookmarkComponent v-model:hasBookmark="hasBookmark" :id="$route.params.id" type="caterer" width="10px" height="17px" margin-left="1px" wrappingDiv="div-bookmark" />
                </div>
            </div>
        </div>
        <div id="info">
            <div id="info-left">
                <label class="info-subheadline"><strong>Region:</strong> {{region}}</label>
            </div>
            <div id="info-right">
                <label class="info-subheadline"><strong>Alter:</strong> {{age}} Jahre</label>
            </div>
        </div>
        <div class="description-headline-div">
            <div class="description-headline-more-infos">
                Lieblings Eventarten:
            </div>
            <div class="description-headline-more-infos-infos">
                {{favoriteEventTypes}}
            </div>
            <br>
            <div class="description-headline-more-infos">
                Lieblings Lieder:
            </div>
            <div class="description-headline-more-infos-infos">
                {{favoriteSong}}
            </div>
            <br>
            <div class="description-headline-more-infos">
                Lieblings Gerichte:
            </div>
            <div class="description-headline-more-infos-infos">
                {{favoriteDish}}
            </div>
            <br>
        </div>
        <div class="description-headline-div">
            <div class="description-headline">
                Beschreibung:
            </div>
        </div>
        <div id="description-div">
            <div id="description">
                {{longDescription}}
            </div>
        </div>
        <div class="description-headline-div" v-if="pictures.length > 0">
            <div class="description-headline">
                Bilder:
            </div>
        </div>
        <div id="pictures">
            <div id="addcreator" ref="addCreator" class="scroll-container">
                <div class="dish-container">
                    <MobilePictureComponent v-for="picture in pictures" :imagePath="picture.partybild_data" :mutable="false" :key="picture" />
                </div>
            </div>
        </div>
        <div class="description-headline-div" v-if="myEventsLocations.length > 0" >
            <div class="description-headline">
                Meine Events/Locations:
            </div>
        </div>
        <div id="event-container">
            <div id="artist-div" v-for="(event, index) in myEventsLocations" :key="index">
                <div id="background">
                    <CardComponent
                    :name="event.header" 
                    :line1="event.line1" 
                    :line2="event.line2"
                    :line3="event.line3"
                    :info="event.info"
                    :hasBookmark="event.info.favorit"
                    :scaleFactor=".67"
                    :imagePath="event.bild"
                    :buttonClickFunction="event.info.type === 'events' ? () => $router.push(`/event/${event.info.id}`) : () => $router.push(`/location/${event.info.id}`)"
                    buttonText="Mehr Infos"
                    />
                </div>
            </div>
        </div>
        <div class="description-headline-div" v-if="myIntrests.length > 0">
            <div class="description-headline">
                Meine Interessen:
            </div>
        </div>
        <div id="event-container">
            <div id="artist-div" v-for="(event, index) in myIntrests" :key="index">
                <div id="background">
                    <CardComponent
                    :name="event.header" 
                    :line1="event.line1" 
                    :line2="event.line2"
                    :line3="event.line3"
                    :info="event.info"
                    :scaleFactor=".67"
                    :imagePath="event.bild"
                    :buttonClickFunction="() => $router.push(`/event/${event.info.id}`)"
                    buttonText="Mehr Infos"
                    />
                </div>
            </div>
        </div>
        <div id="button-div">
            <div v-if="!isFriend" id="button" @click="isMe ? $router.push('/editPerson') : sendFriendRequest()">
                {{ buttonLabel }}
            </div>
            <div v-else id="break" @click="unfriend">
                {{ buttonLabel }}
            </div>
        </div>
        <div id="home-button" v-if="menu">
            <img v-if="isDarkMode" id="home-mobile" src="../assets/home-mobile.png" @click="goToHomePage" />
            <img v-else id="home-mobile" src="../assets/home-mobile.png" @click="goToHomePage" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  import MobileHeaderComponent from '@/components/MobileHeaderComponent.vue'
  import BookmarkComponent from '@/components/BookmarkComponent.vue'
  import CardComponent from '@/components/CardComponent.vue'
  import MobilePictureComponent from '@/components/MobilePictureComponent.vue';
  
  export default {
    components: {
        MobileHeaderComponent,
        BookmarkComponent,
        CardComponent,
        MobilePictureComponent
    },
    data() {
      return {
          menu: "",
          userName: "",
          longDescription: "",
          shortDescription: "",
          isModalVisible: false,
          profilePicture: null,
          favoriteEventTypes: "",
          favoriteSong: "",
          favoriteDish: "",
          region: "",
          age: 0,
          gender: "",
          pictures: [],
          myEventsLocations: [],
          eventsLocationsIndex: 0,
          myIntrests: [],
          intrestsIndex: 0,
          isFriend: false,
          hasBookmark: false,
          isMe: false,
          buttonLabel: "Freundschaftsanfrage",
      };
    },
    methods: {
      addDish() {
        this.dishes.push({ name: '', ingredients: [] });
        this.$nextTick(() => {
          const container = this.$refs.addCreator; // Verwendet ref, um den Container zu referenzieren
          container.scrollLeft = container.scrollWidth - container.clientWidth; // Scrollt zum rechten Ende des Containers
        });
      },
      goToHomePage(){
        this.$router.push('/search');
      },
      handleClick() {
        if(this.menu) {
          this.menu = false;
        }
        else {
        this.menu = true;
        }
      },
      removeDish(index) {
        this.dishes.splice(index, 1);
      },
      openModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
        sendFriendRequest() {
            console.log(this.id);
            axios.post("/setFriend",{ freundid: this.id }, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => {
                    console.log("Success: ", res);
                    this.isFriend = true;
                })
                .catch(err => console.log("Error: ", err));
        },
        unfriend() {
            axios.get("/deleteFriend/" + this.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => {
                    console.log("Success: ", res);
                    this.isFriend = false;
                })
                .catch(err => console.log("Error: ", err));
        },
        getInfo() {
            const destination = (this.$route.name === "MyPage") ? "/me" : ("/getUserById/" + this.$route.params.id);
              axios.get(destination, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => {
                    console.log("Success: ", res);
                    this.userName = res.data.user.rows[0].profilname;
                    this.shortDescription = res.data.user.rows[0].kurzbeschreibung;
                    this.longDescription = res.data.user.rows[0].beschreibung;
                    this.favoriteEventTypes = res.data.user.rows[0].arten;
                    this.favoriteSong = res.data.user.rows[0].lied;
                    this.favoriteDish = res.data.user.rows[0].gericht;
                    this.region = res.data.user.rows[0].region;
                    this.age = res.data.user.rows[0].alter;
                    this.gender = res.data.user.rows[0].geschlecht;
                    this.profilePicture = res.data.user.rows[0].profilbild;
                    this.hasBookmark = res.data.isFavorite;
                    this.isMe = res.data.isMe;
                    this.isFriend = res.data.isFriend;
                    res.data.owenevents.rows?.forEach(event => {
                        event.type = "events";
                        this.myEventsLocations.push({header: event.name, line1: "Location: " + event.locationname, line2: "Datum: " + event.datum, line3: "Zeit: " + event.uhrzeit, info: event});
                    });
                    res.data.locations.rows?.forEach(event => {
                        event.type = "location";
                        this.myEventsLocations.push({header: event.name, line1: "Addresse: " + event.addresse, line2: "Kapazität: " + event.kapazitaet, line3: "Preis: " + event.preis, info: event});
                    });
                    res.data.tickets.rows?.forEach(event => {
                        event.type = "events";
                        this.myIntrests.push({header: event.name, line1: "Location: " + event.locationname, line2: "Datum: " + event.datum, line3: "Zeit: " + event.uhrzeit, info: event});
                    });

                    if (this.isMe) {
                        this.buttonLabel = "Bearbeiten";
                    }
                    if (this.isFriend) {
                        this.buttonLabel = "Freundschaft beenden";
                    }

                    // to be implemented
                    this.isFriend = false;
                })
                .catch(err => console.log("Error: ", err));
            axios.get("/getPartybilder/" + this.$route.params.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => {
                    console.log("Bilder: ", res);
                    res.data.rows?.forEach(bild => {
                        this.pictures.push(bild);
                    })
                })
                .catch(err => console.log("Error: ", err));
        },
        increaseEventLocationsIndex() {
            if (this.eventsLocationsIndex < this.myEventsLocations.length - 1) {
                this.eventsLocationsIndex++;
            }
        },
        decreaseEventLocationsIndex() {
            if (this.eventsLocationsIndex > 0) {
                this.eventsLocationsIndex--;
            }
        },
        increaseIntrestsIndex() {
            if (this.intrestsIndex < this.myIntrests.length - 1) {
                this.intrestsIndex++;
            }
        },
        decreaseIntrestsIndex() {
            if (this.intrestsIndex > 0) {
                this.intrestsIndex--;
            }
        },
    },
      computed: {
          isDarkMode() {
              return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
          },
          id() {
              return this.$route.params.id;
          },
      },
      created() {
          this.getInfo();
      },
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
      height: 60px;
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

    #add-icon {
    width: 24px;
    height: 24px;
    }

  .description-headline {
      width: 287px;
      text-align: left;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 3px;
  }

.description-headline-more-infos {
    width: 287px;
    text-align: left;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 3px;
}

.description-headline-more-infos-infos {
    width: 287px;
    text-align: left;
    font-size: 12px;
    margin-bottom: 3px;
}

  #pictures {
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: center;
    width: 300px;
    margin: 0 auto;
    margin-bottom: 20px;
}
    #addcreator {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        align-items: center;
        padding: 7px;
    }

  .dish-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
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
      overflow-wrap: break-word;
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

#break {
    background-color: var(--red);
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
      background-color: var(--textfield-background);
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
      background-color: var(--textfield-background);
  }
  
  #menu-mobile {
      margin-bottom: -3px;
      width: 20px;
      height: 20px;
  }

#background {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 7px;
    background-color: var(--textfield-background);
}

#artist-div {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

    </style>
