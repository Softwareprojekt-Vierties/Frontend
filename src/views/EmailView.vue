<template>
    <div id="header">
      <div id="icon-div">
        <img alt="Filer" class="icon" src="../assets/home.jpg">
      </div>
    </div>
    <div id="Eventure-Logo-Text">
      <img alt="Eventure Logo" id="logo" :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')">
      <t1 id="Überschrift">Eventure-Postfach</t1>
    </div>
    <div id="mails">
      <div id="left">
        <div id="search">
          <div id="search-div">
            <div id="search-field">
              <input placeholder="suchen">
              <img alt="Filer" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
            </div>
          </div>
        </div>
        <div id="mails-info">
          <dish-form @click="updateText('Text für Dish 1', 'Auftrag: Dish 1')"></dish-form>
          <dish-form @click="updateText('Text für Dish 2', 'Auftrag: Dish 2')"></dish-form>
          <dish-form @click="updateText('Text für Dish 3', 'Auftrag: Dish 3')"></dish-form>
          <dish-form @click="updateText('Text für Dish 4', 'Auftrag: Dish 4')"></dish-form>
          <dish-form @click="updateText('Text für Dish 5', 'Auftrag: Dish 5')"></dish-form>
          <dish-form @click="updateText('Text für Dish 6', 'Auftrag: Dish 6')"></dish-form>
          <dish-form @click="updateText('Text für Dish 7', 'Auftrag: Dish 7')"></dish-form>
          <dish-form @click="updateText('Text für Dish 8', 'Auftrag: Dish 8')"></dish-form>
          <dish-form @click="updateText('Text für Dish 9', 'Auftrag: Dish 9')"></dish-form>
          <dish-form @click="updateText('Text für Dish 10', 'Auftrag: Dish 10')"></dish-form>
          <dish-form @click="updateText('Text für Dish 11', 'Auftrag: Dish 11')"></dish-form>
          <dish-form @click="updateText('Text für Dish 12', 'Auftrag: Dish 12')"></dish-form>
          <dish-form @click="updateText('Text für Dish 13', 'Auftrag: Dish 13')"></dish-form>
          <dish-form @click="updateText('Text für Dish 14', 'Auftrag: Dish 14')"></dish-form>
          <dish-form @click="updateText('Text für Dish 15', 'Auftrag: Dish 15')"></dish-form>
          <dish-form @click="updateText('Text für Dish 16', 'Auftrag: Dish 16')"></dish-form>
        </div>
      </div>
      <div id="right">
        <div id="text-div">
          <label id="mail-headline">{{ mailHeadline }}</label>
          <div id="text">
            <pre id="formatted-text">
              {{ formattedText }}
            </pre>
          </div>
          <div id="buttons">
            <div id="ablehnen">
              ablehnen
            </div>
            <div id="annehmen">
              annehmen
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DishForm from '../components/MailComponent.vue';
  
  export default {
    components: {
      DishForm
    },
    data() {
      return {
        mailHeadline: '',
        formattedText: ''
      };
    },
    methods: {
      updateText(newText, newHeadline) {
        this.formattedText = newText;
        this.mailHeadline = newHeadline;
      }
    }
  }
  </script>
  
  <style scoped>
  #icon-div {
      width: 40px;
      padding: 15px;
      padding-bottom: 12px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      border-radius: 10px;
      cursor: pointer;
      background-color: var(--textfield-background);
      margin-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
  }
  
  .icon {
      width: 35px;
      height: 35px;
      cursor: pointer;
  }
  
  #Eventure-Logo-Text {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      gap: 20px;
      background-color: var(--background);
  }
  
  #logo {
      width: 80px; /* Bestimmt eine feste Breite für das Logo */
  }
  
  #Überschrift {
      font-size: 60px; /* Legt die Schriftgröße für die Überschrift fest */
      @media (prefers-color-scheme: dark) {
          color: #ddd; /* Dunkelgraue Textfarbe */
      }
      @media (prefers-color-scheme: light) {
          color: #333; /* Dunkelgraue Textfarbe */
      }
  }
  
  #mails {
      display: grid;
      grid-template-columns: auto auto;
      align-items: top;
      justify-content: center;
      gap: 15px;
      margin-top: 50px;
  }
  
  #right {
      width: 1200px;
  }
  
  #search-div {
      padding: 6px;
      border: 1px solid black;
      border-radius: 7px;
      margin-bottom: 10px;
  }
  
  #search-field {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: space-between;
      border: 1px solid black;
      border-radius: 5px;
  }
  
  #magnifying-glass {
      width: 20px;
      margin: 2px;
      margin-right: 5px;
  }
  
  #text-div {
      border: 1px solid black;
      padding: 20px;
      border-radius: 7px;
      padding-bottom: 10px;
      height: 650px;
  }
  
  #text {
      border: 1px solid black;
      padding: 20px;
      height: 535px; /* Passt diese Höhe nach Bedarf an */
      overflow-y: auto;
      border-radius: 10px;
      display: flex;
      text-align: left;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  #buttons {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
  }
  
  #ablehnen {
      border: 1px solid black;
      width: 125px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 7px;
      background-color: var(--red);
  }
  
  #annehmen {
      border: 1px solid black;
      width: 125px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 7px;
      background-color: var(--green);
  }
  
  #mails-info {
      border: 1px solid black;
      max-height: 600px; /* Passt diese Höhe nach Bedarf an */
      overflow-y: auto;
      border-radius: 7px;
      padding: 15px;
  }
  
  #mail-headline {
      display: block;
      text-align: left;
      font-weight: bold;
      margin-bottom: 10px;
  }
  
  #buttons {
      display: flex;
      justify-content: right;
  }
  
  input {
      border: none;
      outline: none;
      padding-left: 10px;
      margin-right: -200px
  }
  
  #formatted-text {
      white-space: pre-wrap; /* Behandelt Leerzeichen und Zeilenumbrüche */
      font-family: Arial, sans-serif; /* Legt die Schriftart fest */
      font-size: 16px; /* Legt die Schriftgröße fest */
  }
  </style>
  