<template>
    <div id="header">
        <div id="header-inner">
            <div id="picture-name">
                <Image :url="imagePreview" width="125px" height="110px" margin-bottom="20px" borderRadius="15px" boxShadow="0 0 10px rgba(0, 0, 0, 0.8)" :onFileChange="onFileChange" />
                <div id="name-description">
                    <div id="name-input">
                        <label class="description">Name:</label>
                        <input :value="name" @input="$emit('update:name', $event.target.value)" class="header-input" type="text" placeholder="z.B. Name"><br>
                    </div>
                    <div id="description-input">
                        <label class="description">Kurze Beschreibung hinzufügen:</label>
                        <input :value="kurzbeschreibung" @input="$emit('update:kurzbeschreibung', $event.target.value)" class="header-input" type="text" placeholder="z.B. 24/7">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Image from '../components/MobileChangeableImageComponent.vue';

export default {
    components: {
        Image,
    },
    data() {
        return {
        }
    },
    props: {
        imagePreview: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        kurzbeschreibung: {
            type: String,
            default: "",
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        "update:name",
        "update:kurzbeschreibung",
        "update:imagePreview",
    ],
    computed: {
        imageURL() {
            return `url(${this.imagePreview})`;
        },
        brightnessFilter() {
            return this.imagePreview ? .5 : 1.0;
        },
    },
    methods: {
        onFileChange(event) {
            console.log("V", event.srcElement);
            console.log(document.getElementById("fileToUpload"));
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    this.$emit('update:imagePreview', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
    },
}
</script>


<style scoped>
#header {
    background-color: var(--create-page-header-background);
    background-image: v-bind("imageURL");
    background-size: cover;
    background-postion: center;
    height: 160px;
}

  #header-inner {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: end;
    gap: 8px;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    @media (prefers-color-scheme: dark) {
        backdrop-filter: brightness(50%) blur(10px);
        -webkit-backdrop-filter: brightness(50%) blur(10px);
    }
  }

  #picture-name {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: end;
      gap: 8px;
      margin-bottom: 20px;
      margin-left: 10px;
  }

  #name-description {
    display: grid;
    grid-template-columns: auto;
    justify-content: left;
    align-items: end;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
  }

  #name-input {
      display: grid;
      grid-template-columns: 140px;
      justify-content: left;
      margin-bottom: -10px;
  }

  #description-input {
      display: grid;
      grid-template-columns: 140px;
      justify-content: left;
  }

  .header-input {
      height: 15px;
      border-radius: 5px;
      border: 1px solid #000000;
      text-align: center;
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  .header-input::placeholder {
      color: var(--placeholder-color);
  }

  .description {
      text-align: left;
      font-size: 9.69px;
      margin-bottom: 1px;
  }
</style>
