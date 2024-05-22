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
          <input class="header-input" type="text" id="event-name" name="event-name" placeholder="z.B. UNI PARTY"><br>
        </div>
        <div class="name-description-input">
          <label class="description">Kurze Beschreibung hinzufügen:</label>
          <input class="header-input" type="text" id="event-description" name="event-description" placeholder="z.B. Minden">
        </div>
      </div>
    </div>
  </div>

  <div>
    <div id="right-side">
      <div class="long-description">
        <label class="description">Eventnamen hinzufügen:</label><br>
        <input class="long-description-input" type="text" id="event-name" name="event-name" placeholder="Hier einfügen…">
      </div>
      <diV>
        <label class="description">Dienstleister hinzufügen:</label><br>
        <input class="creator-input" type="text" id="event-name" name="event-name" placeholder="Hier einfügen…">
      </diV>
    </div>

    <div>
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
  padding-bottom: 20px;
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
</style>