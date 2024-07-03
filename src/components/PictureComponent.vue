<template>
    <div id="file-upload" :style="fileDivStyle">
        <label id="image-text" for="fileToUpload">
            <img v-if="!imagePreview && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
            <img v-else-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
            <span id="upload-text" v-if="!imagePreview">Bild hochladen</span>
        </label>
        <input v-if="mutable" type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChange">
    </div>
</template>

<script>
  export default {
      data() {
        return {
            imagePreview: null,
            eventImage: null,
        }
      },
      props: {
          imageGrabber: {
              type: Function,
              default: () => {},
          },
          imagePath: {
              type: String,
              default: null,
          },
          mutable: {
              type: Boolean,
              default: true,
          }
      },
      computed: {
          isDarkMode() {
              return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
          },
          fileDivStyle() {
              return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
          },
      },
      methods: {
          onFileChange(event) {
              const file = event.target.files[0];
              if (file) {
                  this.eventImage = file;
                  const reader = new FileReader();
                  reader.onload = e => {
                      this.imagePreview = e.target.result;
                      this.imageGrabber(this.imagePreview);
                  };
                  reader.readAsDataURL(file);
              }
          },
          getImage() {
              return this.imagePreview;
          }
      },
      created() {
          this.imagePreview = this.imagePath;
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

