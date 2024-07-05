<template>
    <div id="app">
        <div id="header" :style="headerStyle">
            <div id="header-inner">
                <HomeButton :isLoggedIn="true" />
                <div id="picture-name">
                    <div id="file-div">
                    </div>
                    <div id="name-description">
                        <div class="name-description-input">
                            <label id="name">Uni Party</label>
                        </div>
                        <div class="name-description-input">
                            <label id="description-short">Minden</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="main">
            <div id="left-side">
                <div class="long-description">
                    <label class="description">Beschreibung:</label>
                    <div id="long-description-text">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer</div>
                </div>
                <br>
                <div class="long-description">
                    <label class="description">Dienstleister:</label>
                    <div id="addcreator" ref="addCreator" class="scroll-container">
                        <div class="dish-container">
                            <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                                <dish-form :dish="dish" label="DJ Black" @remove="removeDish(index)"></dish-form>
                            </div>
                            <img class="user-avatar" src="../assets/right.jpg" width="20px" height="20px">
                        </div>
                    </div>
                    <div id="maps-div">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9761.28464057027!2d8.919081382044633!3d52.29202508832965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba741a148fc0fd%3A0x8b85d34e7d7adcb1!2sHSBI%20Campus%20Minden!5e0!3m2!1sde!2sde!4v1718673701082!5m2!1sde!2sde" id="maps" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
            <div id="right-side">
                <div id="right-side-info">
                        <Bookmark :isFavorite="false" :id="id" type="events" />
                        <div class="infos">
                            <label class="info-subheadline"><strong>Location:</strong> Campus Minden</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Datum:</strong> 17.08.2024</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Zeit:</strong> 19Uhr - 2Uhr</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Eventgröße:</strong> 50 Personen</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Preis:</strong> 10€</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Altersfreigabe:</strong> 18+</label>
                        </div>
                        <div class="infos">
                            <label class="info-subheadline"><strong>Open Air:</strong> Nein</label>
                        </div>
                    </div>
                    <div id="ticket">
                        Ticket buchen (20/50)
                    </div>
                </div>
            </div>
        </div>
</template>
  
  <script>
  import DishForm from '../components/MailComponent.vue';
  import Bookmark from '../components/ViewPageBookmark.vue';
  import HomeButton from '../components/HomeButton.vue';

  export default {
    components: {
      DishForm,
        Bookmark,
        HomeButton,
    },
    data() {
      return {
        dishes: [
          { name: '', ingredients: [] }
        ],
          isFavorit: false,
        isModalVisible: false
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
      }
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
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
      }
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

#dish-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

#artist {
  display: flex;
  grid-template-columns: auto auto auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
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
  </style>
  
