<template>
  <div id="app">
    <div id="header">
      <div id="icon-div">
        <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
        <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
      </div>
      <div id="picture-name">
        <div id="file-div">
          <div id="file-upload">
            <label id="image-text" for="fileToUpload">
              <img v-if="isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
              <img v-else src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
              <span id="upload-text">Bild hochladen</span>
            </label>
            <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*">
          </div>
        </div>
        <div id="name-description">
          <div class="name-description-input">
            <label class="description">Eventnamen hinzufügen:</label>
            <input class="header-input" type="text" placeholder="z.B. UNI PARTY"><br>
          </div>
          <div class="name-description-input">
            <label class="description">Kurze Beschreibung hinzufügen:</label>
            <input class="header-input" type="text" placeholder="z.B. Minden">
          </div>
        </div>
      </div>
    </div>

    <div id="main">
      <div id="left-side">
        <div class="long-description">
          <label class="description">Beschreibung hinzufügen:</label>
          <textarea id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
        </div>
        <br>
        <div class="long-description">
          <label class="description">Dienstleister hinzufügen:</label>
          <div id="addcreator" ref="addCreator" class="scroll-container">
            <div class="dish-container">
              <div v-for="(dish, index) in dishes" :key="index" class="dish-item">
                <dish-form :dish="dish" @remove="removeDish(index)"></dish-form>
              </div>
              <div class="add-dish-button" @click="addDish"><img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" /><img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" /></div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-side">
        <div id="right-side-info">
          <label id="info-headline">Infos hinzufügen:</label>
          <div class="infos">
            <label class="info-subheadline">Location:</label>
            <div>
              <div id="add-location">
                <img v-if=isDarkMode src="../assets/addlocation.png" alt="Bild hochladen" id="add-location-icon" />
                <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-location-icon" />
              </div>
            </div>
          </div>
          <div class="infos">
            <label class="info-subheadline">Datum:</label>
            <input class="input" type="text" placeholder="z.B. 17.08.2024">
          </div>
          <div class="infos">
            <label class="info-subheadline">Zeit:</label>
            <div class="time">
              <input class="time-value-left" placeholder="z.B. 17Uhr"> - <input class="time-value-right" placeholder="z.B. 20Uhr">
            </div>
          </div>
          <div class="infos">
            <label class="info-subheadline">Eventgröße:</label>
            <input class="input" type="text" placeholder="z.B. 50 Personen">
          </div>
          <div class="infos">
            <label class="info-subheadline">Preis:</label>
            <input class="input" type="text" placeholder="z.B. 50€">
          </div>
          <div class="infos">
            <label class="info-subheadline">Alter:</label>
            <input class="input" type="text" placeholder="z.B. 18 Jahre">
          </div>
          <div id="open-air">
            <label class="info-subheadline">Open Air:</label>
            <label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label>
          </div>
        </div>
        <div id="buttons">
          <div id="break">
            abbrechen
          </div>
          <div id="continue" @click="openModal">
            anlegen
          </div>
        </div>
      </div>
    </div>

    <PopupModal :show="isModalVisible" @close="closeModal"/>
  </div>
</template>

<script>
import DishForm from '../components/ArtistComponent.vue';
import PopupModal from '../components/PopupModal.vue'; // Importiere die neue Komponente

export default {
  components: {
    DishForm,
    PopupModal
  },
  data() {
    return {
      dishes: [
        { name: '', ingredients: [] }
      ],
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
@import "../css/createPages.css"
</style>
