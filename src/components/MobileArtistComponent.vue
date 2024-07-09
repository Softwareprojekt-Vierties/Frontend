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
    background-color: var(--textfield-background);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    margin-top: 10px;
    margin-right: 5px;
}

#add-location-icon {
    background-color: var(--textfield-background);
    width: 40px;
    height: 40px;
    margin-top: 42.905px;
    margin-bottom: 42.905px;
    margin-right: 107.985px;
    margin-left: 107.985px;
}
</style>
