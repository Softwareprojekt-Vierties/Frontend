<template>
    <div id="header">
        <div id="header-inner">
            <HomeButton :isLoggedIn="true" />
            <div id="picture-name">
                <Image :url="imagePreview" width="250px" height="180px" marginLeft="-225px" borderRadius="10px" boxShadow="0 0 10px rgba(0, 0, 0, 0.8)" :onFileChange="onFileChange" />
                <div id="name-description">
                    <div class="name-description-input">
                        <label class="description">Name:</label>
                        <input :value="name" @input="$emit('update:name', $event.target.value)" class="header-input" type="text" placeholder="z.B. Name"><br>
                    </div>
                    <div class="name-description-input">
                        <label class="description">Kurze Beschreibung hinzufügen:</label>
                        <input :value="kurzbeschreibung" @input="$emit('update:kurzbeschreibung', $event.target.value)" class="header-input" type="text" placeholder="z.B. 24/7">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HomeButton from '../components/HomeButton.vue';
    import Image from '../components/ChangeableImageComponent.vue';

    export default {
        components: {
            HomeButton,
            Image,
        },
        data() {
            return {
            }
        },
        props: {
            onFileChange: {
                type: Function,
                default: () => {},
            },
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
        },
        emits: [
            "update:name",
            "update:kurzbeschreibung",
        ],
        computed: {
            imageURL() {
                return `url(${this.imagePreview})`;
            }
        },
    }
</script>


<style scoped>
#header {
    background-color: var(--create-page-header-background);
    background-image: v-bind("imageURL");
    background-size: cover;
    background-postion: center;
}

  #header-inner {
      width: 100%;
      height: 100%;
      padding-bottom: 40px;
      padding-top: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding-bottom: 40px;
      padding-top: 10px;
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
      gap: 20px;
  }

  #name-description {
      border-radius: 10px;
      background-color: var(--textfield-background);
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
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  .header-input::placeholder {
      color: var(--placeholder-color);
  }

  .description {
      text-align: left;
      font-size: 12px;
      margin-bottom: 3px;
  }
</style>
