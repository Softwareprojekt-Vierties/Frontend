<template>
  <div id="dish-form">
    <div id="file-div">
      <div id="file-upload">
        <label id="image-text" for="fileToUpload">
          <img src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
          <span id="upload-text">Bild hochladen</span>
        </label>
        <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*">
      </div>
    </div>
    <div id="right">
      <div id="text">
        Gericht 1
      </div>
      <input id="input" placeholder="z.B. Kuchen">
      <div id="ingredients">
        Hauptzutaten:
      </div>
      <input id="input" placeholder="z.B. Erdbeeren">
      <input id="input" placeholder="z.B. Sahne">
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
#dish-form {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    gap: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding-left: 12px;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-right: 15px;
    margin-left: 5px;
}

#file-div {
    width: 120px;
    height: 108px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    background-color: white;
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
    margin-left: 5px;
    margin-top: -5px;
}

#upload-text {
    color: rgb(209, 209, 209);
    padding-top: 5px;
    font-size: 7px;
}

#right {
    display: grid;
    grid-template-columns: auto;
}

#text {
  text-align: left;
  font-size: 11px;
  margin-top: 5px;
}

#input {
  width: 130px;
  border-radius: 5px;
  border: 1px solid #000;
  margin-top: 5px;
  font-size: 10px;
  padding: 3px;
  padding-left: 10px;
}

#ingredients {
  text-align: left;
  font-size: 10px;
  margin-top: 5px;
  border-top: 1px solid rgb(200, 200, 200);
  padding-top: 5px;
}
</style>