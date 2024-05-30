<template>
    <div class="artist-card">
        <div class="artist-image-container">
            <img :alt="name" :src="computedImagePath" class="artist-image">
        </div>
        <div class="artist-details">
            <h3>{{name}}</h3>
            <p>Region: {{region}}</p>
            <p>Preis: {{price}}</p>
            <p>Erfahrung: {{experience}}</p>
            <p>Kategorie: {{category}}</p>
            <button>Buchen</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: "DJ BLACK"
            }, 
            region: {
                type: String,
                default: "Minden"
            },
            price: {
                type: String,
                default: "free"
            },
            experience: {
                type: String,
                default: "none"
            },
            category: {
                type: String,
                default: "Pop",
            },
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
.artist-card {
    display: flex;
    background: rgb(239, 242, 240);
    margin: 21px;
    width: 320px;
    height: 130px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
}
  .artist-image-container {
      flex: 5;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .artist-image {
      max-width: 80%;
      max-height: 80%;
      border-radius: 10%;
  }

  .artist-details {
      flex: 2;
      background-color: #fff; 
      padding: 15px; 
      border-top-right-radius: 10px; 
      border-bottom-right-radius: 10px; 
      font-family: Arial, sans-serif; 
      font-size: 9;
  }

  .artist-details h3, .artist-details p, .artist-details button {
      color: #333;
      margin-top: 0;
      font-size: 9px;
  }
  .artist-details button {
      background-color: #4CAF50; 
      color: white;
      border: none; 
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 10px;
      cursor: pointer;
      border-radius: 5px; 
      width: 100px;
      height: 20px;
      margin: 4px 2px;
  }
</style>

