<template>
  <div id="dish-form">
    <div id="file-div-comp" :style="fileDivStyleComponent">
      <div id="file-upload">
        <label id="image-text" for="fileToUpload">
          <img v-if="!localDish.imagePreview && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon-comp" />
          <img v-else-if="!localDish.imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon-comp" />
          <span id="upload-text-comp" v-if="!localDish.imagePreview">Bild hochladen</span>
        </label>
        <input class="input-comp" type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChangeComponent">
      </div>
    </div>
    <div id="right">
      <div id="text">
        Gericht:
      </div>
      <input class="input-comp" v-model="localDish.dishName" id="input" placeholder="z.B. Kuchen" @input="emitDishUpdate">
      <div id="ingredients">
        Hauptzutaten:
      </div>
      <input class="input-comp" v-model="localDish.info1" id="input" placeholder="z.B. Erdbeeren" @input="emitDishUpdate">
      <input class="input-comp" v-model="localDish.info2" id="input" placeholder="z.B. Sahne" @input="emitDishUpdate">
    </div>
  </div>
</template>


<script>
export default {
  props: {
    dish: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localDish: { ...this.dish }
    };
  },
  watch: {
    dish: {
      handler(newDish) {
        this.localDish = { ...newDish };
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    fileDivStyleComponent() {
      return this.localDish.imagePreview ? { backgroundImage: `url(${this.localDish.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
    },
    isDarkMode() {
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    }
  },
  methods: {
    emitDishUpdate() {
      this.$emit('update-dish', this.localDish);
    },
    onFileChangeComponent(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.localDish.imagePreview = e.target.result;
          this.$emit('update-dish', this.localDish);
        };
        reader.readAsDataURL(file);
      }
    },
    getData() {
      return {
        dishName: this.localDish.dishName,
        info1: this.localDish.info1,
        info2: this.localDish.info2,
        imagePreview: this.localDish.imagePreview
      };
    },
    clearFields() {
      this.localDish.dishName = '';
      this.localDish.info1 = '';
      this.localDish.info2 = '';
      this.localDish.imagePreview = null;
    }
  }
};
</script>


  
  <style scoped>
  #dish-form {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: center;
      gap: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      width: 245px;
      padding: 10px;
  }
  
  #file-div-comp {
      width: 120px;
      height: 107px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
      border-radius: 5px;
      background-color: var(--textfield-background);
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
      max-width: 60%;
      max-height: 60%;
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

  #text {
    text-align: left;
    font-size: 11px;
  }
  
  #text-component {
    text-align: left;
    font-size: 11px;
  }
  
  .input-comp {
    width: 100px;
    border-radius: 5px;
    border: 1px solid #000;
    margin-top: 4px;
    font-size: 10px;
    padding: 3px;
    padding-left: 10px;
    height: 11px;
  }
  
  #ingredients {
    text-align: left;
    font-size: 10px;
    margin-top: 5px;
    border-top: 1px solid rgb(200, 200, 200);
    padding-top: 5px;
  }
  </style>
  