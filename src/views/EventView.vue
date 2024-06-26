<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
          <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
        </div>
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
            </div>
          </div>
        </div>
        <div id="maps-div">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9761.28464057027!2d8.919081382044633!3d52.29202508832965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba741a148fc0fd%3A0x8b85d34e7d7adcb1!2sHSBI%20Campus%20Minden!5e0!3m2!1sde!2sde!4v1718673701082!5m2!1sde!2sde" id="maps" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <div id="info-bookmark">
                <label id="info-headline">Infos</label>
                <div id="div-bookmark">
                  <img v-if="isFavorit && isDarkMode" src="../assets/bookmark-filled.png" id="bookmark">
                  <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
                  <img v-else-if="isFavorit" src="../assets/bookmark-gray.jpg" id="bookmark">
                  <img v-else src="../assets/bookmark-white.jpg" id="bookmark">
                </div>
            </div>
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
  import DishForm from '../components/EventComponenet.vue';

  export default {
    components: {
      DishForm
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
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
      }
  }
  </script>
  
  <style scoped>
@import "../css/overviewPages.css"

  </style>
  
