<template>
  <div id="header">
    <div id="icon-div">
      <img alt="Filer" class="icon" src="../assets/home.jpg">
    </div>
    <div id="picture-name">
      <div id="file-div">
        <div id="file-upload">
          <label id="image-text" for="fileToUpload">
            <img src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
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

  <div id = "main">
    <div id="left-side">
      <div class="long-description">
        <label class="description">Beschreibung hinzufügen:</label>
        <textarea id="long-description-input" type="text" placeholder="Hier einfügen…"></textarea>
      </div>
      <br>
      <div class="long-description">
        <label class="description">Dienstleister hinzufügen:</label>
        <input class="creator-input" type="text" placeholder="Hier einfügen…">
      </diV>
    </div>
    <div id = "right-side">
      <div id="right-side-info">
        <label id="info-headline">Infos hinzufügen:</label>
        <div class = "infos">
          <label class="info-subheadline">Location:</label>
          <div>
            <div id="add-location">
              <img src="../assets/addlocation.jpg" alt="Bild hochladen" id ="add-location-icon" />
            </div>
          </div>
        </div>
        <div class = "infos">
          <label class="info-subheadline">Datum:</label>
          <input class="input" type="text" placeholder="z.B. 17.08.2024">
        </div>
        <div class = "infos">
          <label class="info-subheadline">Zeit:</label>
          <div class="time"> 
            <input class="time-value-left" placeholder="z.B. 17Uhr"> - <input class="time-value-right" placeholder="z.B. 20Uhr">
          </div>
        </div>
        <div class = "infos">
          <label class="info-subheadline">Datum:</label>
          <input class="input" type="text" placeholder="z.B. 50 Personen">
        </div>
        <div class = "infos">
          <label class="info-subheadline">Preis:</label>
          <input class="input" type="text" placeholder="z.B. 50€">
        </div>
        <div class = "infos">
          <label class="info-subheadline">Datum:</label>
          <input class="input" type="text" placeholder="z.B. 18 Jahre">
        </div>
        <div id = "open-air">
          <label class="info-subheadline">Open Air:</label>
          <label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label>
        </div>
      </div>
      <div id="buttons">
        <div id="break">
          abbrechen
        </div>
        <div id="continue">
          anlegen
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateEvent'
};
</script>

<style scoped>

html, body {
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
  border-radius: 10px;
  background-color: white;
  padding: 10px;
}

.name-description-input {
  display: grid;
  grid-template-columns: 300px;
  justify-content: left;
}

.header-input {
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  text-align: center;
}

.description {
  text-align: left;
  font-size: 12px;
  margin-bottom: 3px;
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

#file-upload {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

#file-upload label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

#file-upload input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-icon {
  max-width: 50%;
  max-height: 50%;
  margin-bottom: -10px; /* Adjust margin to bring the text closer */
  margin-left: 10px;
  margin-top: -10px;
}

#upload-text {
  color: #999999;
  margin-top: 0; /* Remove any top margin to bring it closer to the image */
}

.switch {
    position: relative;
    display: inline-block;
    width: 40px; /* Angepasst an die neue Höhe */
    height: 20px;
    margin-left: 20px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
    margin-left: 70px;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 20px; /* Angepasst an die neue Höhe */
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px; /* Angepasst an die neue Höhe */
    width: 16px; /* Angepasst an die neue Höhe */
    left: 2px; /* Angepasst an die neue Höhe */
    bottom: 2px; /* Angepasst an die neue Höhe */
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: rgb(0, 217, 217);
}

input:focus + .slider {
    box-shadow: 0 0 1px rgb(0, 217, 217);
}

input:checked + .slider:before {
    -webkit-transform: translateX(20px); /* Angepasst an die neue Höhe */
    -ms-transform: translateX(20px); /* Angepasst an die neue Höhe */
    transform: translateX(20px); /* Angepasst an die neue Höhe */
}

#main {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  background-color: rgb(242, 242, 242);
  padding-top: 30px;;
  gap: 20px;
}

.long-description {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  display: grid;
  grid-template-columns: 580px;
  justify-content: left;
}

#right-side-info {
  border-radius: 10px;
  background-color: white;
  padding: 10px;
}

.infos {
  display: grid;
  grid-template-columns: 180px;
  margin-top: 20px;
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

.input {
  text-align: center;
  border: 1px solid #000000; /* Rahmenstil */
  border-radius: 5px; /* Abgerundete Ecken */
  height: 25px;
}

#long-description-input {
  width: 558px;
  height: 398px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #000000; 
  border-radius: 8px;
  resize: none;
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
  font-size: 14px; /* Schriftgröße festlegen */
}

#open-air {
  display: block;
  text-align: left;
  margin-top: 20px;
}

#buttons {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

#break {
  background-color: rgb(254, 68, 77);
  width: 88px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  font-size: 12px;
  display: flex; /* Flexbox-Modell verwenden */
  justify-content: center; /* Horizontales Zentrieren */
  align-items: center; /* Vertikales Zentrieren */
}

#continue {
  background-color: rgb(146, 208, 80);
  width: 88px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #000000;
  font-size: 12px;
  display: flex; /* Flexbox-Modell verwenden */
  justify-content: center; /* Horizontales Zentrieren */
  align-items: center; /* Vertikales Zentrieren */
}
</style>