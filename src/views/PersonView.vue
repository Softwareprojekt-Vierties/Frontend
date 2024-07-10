<template>
    <div id="app">
        <Header :imagePreview="profilePicture" :name="userName" :sterne="-1" :kurzbeschreibung="shortDescription" />
      <div id="main">
        <div id="left-side">
          <LongDescription :description="longDescription" :events="favoriteEventTypes" :song="favoriteSong" :dish="favoriteDish" />
          <br>
          <div class="long-description">
            <label class="description">Bilder:</label>
            <div id="addcreator" ref="addCreator" class="scroll-container">
              <div class="dish-container">
                  <dish-form v-for="picture in pictures" :imagePath="picture.partybild_data" :mutable="false" :key="picture" />
              </div>
            </div>
          </div>
          <div id="event-dish">
            <div id="event" v-if="myEventsLocations.length">
              <label class="description">Meine Events/Locations:</label>
              <UserCard :name="myEventsLocations[eventsLocationsIndex].header" :line1="myEventsLocations[eventsLocationsIndex].line1" :line2="myEventsLocations[eventsLocationsIndex].line2" :line3="myEventsLocations[eventsLocationsIndex].line3" :isBookmarked="myEventsLocations[eventsLocationsIndex].favorit" :info="myEventsLocations[eventsLocationsIndex].info" :rightFunction="increaseEventLocationsIndex" :leftFunction="decreaseEventLocationsIndex" />
            </div>
            <div id="dish" v-if="myIntrests.length">
              <label class="description">Meine Interessen:</label>
              <UserCard :name="myIntrests[intrestsIndex].header" :line1="myIntrests[intrestsIndex].line1" :line2="myIntrests[intrestsIndex].line2" :line3="myIntrests[intrestsIndex].line3" :isBookmarked="myIntrests[intrestsIndex].favorit" :info="myIntrests[intrestsIndex].info" :rightFunction="increaseIntrestsIndex" :leftFunction="decreaseIntrestsIndex" />
            </div>
        </div>
        </div>
        <div id="right-side">
            <Info v-model:hasBookmark="hasBookmark" :region="region" :age="age" :gender="gender" />
          <div id="break" v-if="isFriend" @click="unfriend">Freundschaft beenden</div>
          <div id="continue" v-else @click="sendFriendRequest">Freundschaftsanfrage</div>
        </div>
      </div>
  
      <PopupModal :show="isModalVisible" @close="closeModal"/>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/PictureComponent.vue';
  import PopupModal from '../components/PopupModal.vue'; // Importiere die neue Komponente
  import UserCard from '../components/UserCardComponent.vue';
  import Header from '../components/ViewHeader.vue';
  import LongDescription from '../components/LongDescription.vue';
  import Info from '../components/RightSideInfo.vue';
  import axios from 'axios';
  
  export default {
    components: {
      DishForm,
      PopupModal,
      UserCard,
        Header,
        LongDescription,
        Info,
    },
    data() {
      return {
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
            axios.get("/friendrequest/" + this.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => console.log("Success: ", res))
                .catch(err => console.log("Error: ", err));
        },
        unfriend() {
            axios.get("/unfriend/" + this.id, { headers: { auth: localStorage.getItem("authToken") }})
                .then(res => console.log("Success: ", res))
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
  :root html, body {
  width: 100%;
  height: 100%;
  background-color: var(--create-page-background);
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
  background-color: var(--create-page-background);
  padding-top: 30px;;
  gap: 20px;
}

.long-description {
  border-radius: 10px;
  background-color: var(--textfield-background);
  color: var(--textfield-font-color);
  padding: 10px;
  display: grid;
  grid-template-columns: 580px;
  justify-content: left;
  font-weight: bold;
}

.long-description::placeholder {
    color: var(--placeholder-color);
}

#buttons {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  color: var(--simple-font-color);
}

#break {
  background-color: var(--red);
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
  background-color: var(--green);
  width: 170px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
}

#addcreator {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  align-items: center;
  padding: 20px 0;
}

.dish-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 38px;
  margin-left: 30px;
  margin-right: 25px;
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

#dish-form {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      border-radius: 15px;
      padding-left: 12px;
      padding-top: 7px;
      padding-bottom: 10px;
      padding-right: 12px;
      margin-left: 5px;
  }

  </style>
