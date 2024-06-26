<template>
    <div id="file-upload">
      <label id="image-text" for="fileToUpload">
        <img v-if="isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
        <img v-else src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
        <span id="upload-text">Bild hochladen</span>
      </label>
      <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*">
    </div>
</template>

<script>
  export default {
      props: {
          imagePath: {
              type: String,
              default : require("@/assets/bild-hsbi.jpg")
          }
      },
      computed: {
          computedImagePath() {
              if (this.imagePath === null) {
                  return require("@/assets/bild-hsbi.jpg");
              }
              return this.imagePath;
          }
      },
  }
</script>

<style scoped>

#file-upload {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 2px solid #000;
  padding: 7px;
  width: 80px;
  height: 80px;
}

#file-upload label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#file-upload input[type="file"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.upload-icon {
  width: 60px;
  height: 60px;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: -5px;
}

#upload-text {
  color: var(--upload-text-color);
  margin-top: 0; /* Remove any top margin to bring it closer to the image */
  font-size: 10px;
  color: rgb(180, 180, 180);
  margin-bottom: 15px;
}
</style>

