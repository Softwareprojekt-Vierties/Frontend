<template>
    <div id="header" :style="headerStyle">
        <div id="header-inner">
            <HomeButton :isLoggedIn="true" />
            <div id="picture-name">
                <Image :url="imagePreview" width="250px" height="180px" marginLeft="-225px" borderRadius="10px" boxShadow="0 0 10px rgba(0, 0, 0, 0.8)" />
                <div id="name-description">
                    <div class="name-description-input">
                        <div id="name-stars">
                            <label id="name">{{ name }}</label>
                            <div v-if="sterne != -1" class="stars">
                                <span v-for="star in 5" :key="star" class="star" v-bind:class="{ 'filled': star <= sterne }">★</span>
                            </div>
                        </div>
                    </div>
                    <div class="name-description-input">
                        <label id="description-short">{{ kurzbeschreibung }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HomeButton from '../components/HomeButton.vue';
    import Image from '../components/ImageComponent.vue';

    export default {
        components: {
            HomeButton,
            Image,
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
            sterne: {
                type: Number,
                default: 0,
            },
            kurzbeschreibung: {
                type: String,
                default: "",
            }
        },
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
  }

  #picture-name {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: center;
      align-items: end;
      gap: 20px;
  }

  #name-description {
      background-color: none;
      padding: 10px;
  }

  .name-description-input {
      display: grid;
      grid-template-columns: 300px;
      justify-content: left;
  }

  #name {
      text-align: left;
      font-size: 35px;
      color: white;
      margin-bottom: 10px;
  }

  #description-short {
      text-align: left;
      font-size: 18px;
      color: white;
      margin-bottom: -10px;
  }

  .name-description-input {
      display: grid;
      grid-template-columns: 300px;
      justify-content: left;
  }

  .stars{
      margin-bottom: 10px;
  }

  .star {
      color: var(--light-gray); 
      font-size: 27px; 
  }

  .star.filled {
      color: var(--yellow); 

  }

  #name-stars {
      display: grid;
      grid-template-columns: auto auto;
      justify-content: left;
      align-items: center;
      gap: 10px;
  }



</style>
