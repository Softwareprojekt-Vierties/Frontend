<template>
    <div class="event-card">
        <div class="event-image-container">
            <img :alt="name" :src="imagePath" class="event-image">
        </div>
        <div class="event-details">
            <h3>{{name}}</h3>
            <p>Location: {{locationName}}</p>
            <p>Date: {{locationName}}</p>
            <p>Time: {{startTime}} Uhr - {{endTime}} Uhr</p>
            <button>Ticket buchen</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: "UNI PARTY"
            }, 
            locationName: {
                type: String,
                default: "Campus Minden"
            },
            date: {
                type: String,
                default: "17.9.2024"
            },
            startTime: {
                type: String,
                default: "19:00"
            },
            endTime: {
                type: String,
                default: "02:00"
            },
            imagePath: {
                type: String,
                default : require("@/assets/bild-hsbi.jpg")
            }
        },
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

