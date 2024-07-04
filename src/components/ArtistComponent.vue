<template>
    <div class="dish-form">
        <img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id ="add-location-icon" />
        <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id ="add-location-icon" />
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      uploadImage() {
        // Öffnen Sie einen Datei-Dialog, um das Bild zu wählen (erfordert zusätzliche Logik)
        console.log("Bild wird hochgeladen...");
      }
    },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    },
  }
  </script>
  
<style scoped>
.dish-form {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    padding: 10px;
    border-radius: 10px;
}

input[type="text"] {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

#add-location-icon {
    border-radius: 5px;
    background-color: var(--textfield-background);
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 70px;
    margin-left: 70px;
}
</style>
