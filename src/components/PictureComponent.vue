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
  border-radius: 15px;
  border: 2px solid #000;
  padding: 7px;
  min-width: 85px;
  min-height: 85px;
  max-width: 85px;
  max-height: 85px;
}

#file-upload label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 13px;
}

#file-upload input[type="file"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 80px;
}

.upload-icon {
  max-width: 55px;
  max-height: 55px;
  margin-left: 8px;
}

#upload-text {
  color: var(--upload-text-color);
  margin-top: 0; /* Remove any top margin to bring it closer to the image */
  font-size: 9px;
  color: rgb(180, 180, 180);
  margin-bottom: 15px;
  margin-top: -5px;
}
</style>

