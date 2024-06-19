<template>
  <div id="dish-form">
    <div id="file-div-comp" :style="fileDivStyleComponent">
      <div id="file-upload">
        <label id="image-text" for="fileToUpload">
          <img v-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon-comp" />
          <span id="upload-text-comp" v-if="!imagePreview">Bild hochladen</span>
        </label>
        <input class="input-comp" type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChangeComponent">
      </div>
    </div>
    <div id="right">
      <div id="text">
        Gericht 
      </div>
      <input class="input-comp"  v-model="dishName" id="input" placeholder="z.B. Kuchen">
      <div id="ingredients">
        Hauptzutaten:
      </div>
      <input class="input-comp" v-model="info1" id="input" placeholder="z.B. Erdbeeren">
      <input class="input-comp" v-model="info2" id="input" placeholder="z.B. Sahne">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { 
      dishName : '',
      info1 : '',
      info2: '',
      imagePreview : null,
      uploadedImage : null

    };
  },
  computed: {
    fileDivStyleComponent() {
      return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
    }
  },
  methods: {
    onFileChangeComponent(event) {
        const file = event.target.files[0];
        if (file) {
          this.uploadedImage = file;
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
    },

    getData() {
      return {
        dishName: this.dishName,
        info1: this.info1,
        info2: this.info2,
        imagePreview : this.imagePreview
      };
    },
    clearFields() {
      this.dishName = '';
      this.info1 = '';
      this.info2 = '';
      this.uploadedImage = null;
      this.imagePreview = null;
    }
   }
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

#file-div-comp {
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

.upload-icon-comp {
    max-width: 50%;
    max-height: 50%;
    margin-bottom: -10px; /* Adjust margin to bring the text closer */
    margin-left: 5px;
    margin-top: -5px;
}

#upload-text-comp {
    color: rgb(209, 209, 209);
    padding-top: 5px;
    font-size: 7px;
}

#right {
    display: grid;
    grid-template-columns: auto;
}

#text-component {
  text-align: left;
  font-size: 11px;
  margin-top: 5px;
}

.input-comp {
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