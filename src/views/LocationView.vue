<template>
    <div id="app">
      <div id="header">
        <div id="icon-div">
          <img alt="Filer" class="icon" src="../assets/home.jpg">
        </div>
        <div id="picture-name">
          <div id="file-div">
          </div>
          <div id="name-description">
            <div class="name-description-input">
                <div id="name-stars">
                    <label id="name">Uni Party</label>
                    <div class="stars">
                        <span v-for="star in 5" :key="star" class="star" v-bind:class="{ 'filled': 3 <= 5 }">★</span>
                    </div>
                </div>
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
        <div id="maps-div">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9761.28464057027!2d8.919081382044633!3d52.29202508832965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47ba741a148fc0fd%3A0x8b85d34e7d7adcb1!2sHSBI%20Campus%20Minden!5e0!3m2!1sde!2sde!4v1718673701082!5m2!1sde!2sde" id="maps" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <br>
          <div class="long-description">
          <label class="description">Bewertungen:</label>
          <dish-form></dish-form>
        </div>
        </div>
        <div id="right-side">
          <div id="right-side-info">
            <div id="info-bookmark">
                <label id="info-headline">Infos</label>
                <div id="div-bookmark">
                  <img src="../assets/bookmark-white.jpg" id="bookmark">
                </div>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Stadt:</strong> 32427 Minden</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Straße:</strong> Artilleriestraße 9</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Kapazität:</strong> 200 Personen</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Preis:</strong> 1000 €/h</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Größe:</strong> 2 ha</label>
            </div>
            <div class="infos">
              <label class="info-subheadline"><strong>Open Air:</strong> Ja</label>
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
  import DishForm from '../components/ReviewComponent.vue';

  export default {
    components: {
      DishForm
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
    background-color: rgb(213, 213, 213);
    padding-bottom: 40px;
    padding-top: 10px;
  }
  
  #picture-name {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: end;
    gap: 20px;
  }
  
  #icon-div {
    width: 40px;
    padding: 15px;
    padding-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    cursor: pointer;
    background-color: white;
    margin-left: 10px;
  }
  
  .icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  
  #name-description {
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
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -225px;
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

  #info-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
  }

  #div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
  }

  #bookmark {
    width: 10px;
    height: 17px;
    margin-left: 2px;
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

#maps-div {
  border: 1px solid #000000;
  border-radius: 8px;
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
  </style>
  