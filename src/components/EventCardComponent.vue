<template>
    <div class="event-card">
      <div class="event-image-container">
        <img alt="UNI PARTY" src="../assets/bild-hsbi.jpg" class="event-image">
      </div>
      <div class="event-details">
        <h3>UNI PARTY</h3>
        <p>Location: Campus Minden</p>
        <p>Date: 17.8.2024</p>
        <p>Time: 19 Uhr - 2Uhr</p>
        <button>Ticket buchen</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {

  }
  </script>
  
  <style scoped>
  .event-card {
      display: flex;
      background: rgb(239, 242, 240);
      margin: 21px;
      width: 320px;
      height: 130px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
  }
  .event-image-container {
      flex: 5;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  .event-image {
      max-width: 80%;
      max-height: 80%;
      border-radius: 10%;
  }
  
  .event-details {
      flex: 2;
      background-color: #fff; 
      padding: 15px; 
      border-top-right-radius: 10px; 
      border-bottom-right-radius: 10px; 
      font-family: Arial, sans-serif; 
      font-size: 9;
  }
  
  .event-details h3, .event-details p, .event-details button {
      color: #333;
      margin-top: 0;
      font-size: 9px;
  }
  .event-details button {
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
  