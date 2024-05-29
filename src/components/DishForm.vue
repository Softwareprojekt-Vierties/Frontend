<template>
    <div class="dish-form">
        <img src="../assets/addlocation.jpg" alt="Bild hochladen" id ="add-location-icon" />
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      uploadImage() {
        // Öffnen Sie einen Datei-Dialog, um das Bild zu wählen (erfordert zusätzliche Logik)
        console.log("Bild wird hochgeladen...");
      }
    }
  }
  </script>
  
<style scoped>
.dish-form {
    display: flex;
    flex-direction: column;
    margin: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    padding: 10px;
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
    background-color: white;
    width: 30px;
    height: 30px;
}
</style>
