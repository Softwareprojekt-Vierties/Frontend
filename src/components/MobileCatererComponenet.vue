<template>

    <div id="artist-div">
        <div id="dish-form">
            <img :alt="name" :src="imagePreview" id="music-image">
            <div id="right">
                <div id="text">{{dishName}}</div>
                <div id="info-one">1. {{ descriptionParts[0] }}</div>
                <div id="info-two">2. {{ descriptionParts[1] }}</div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  
  export default {
    
    props:{
      dishName:{
              type:String
          },
        dishDescription1:{
              type:String
          },
          dishDescription2:{
              type:String
          }, 
          imagePreview:{
              type:String
          }

    }, 

    computed: {
        descriptionParts() {
            const parts = this.dishDescription1.split(',');
            return [
                parts[0] || '',
                parts[1] || ''
            ];
        }
    }
  
  
  }
  </script>
    
    <style scoped>
  
    .user-avatar{
        cursor: pointer;
    }
  
  
    #dish-form {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: left;
        align-items: center;
        gap: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding-top: 7px;
        padding-bottom: 7px;
        padding-right: 12px;
        background-color: white;
        width: 125px;
    }
    
    #right {
        display: grid;
        grid-template-columns: auto;
    }
    
    #text {
      text-align: left;
      font-size: 12px;
      font-weight: bolder;
    }
    
    #info-one {
      width: 60px;
      font-size: 10px;
      padding: 3px;
      text-align: left;
      padding-left: 0px;
      border-top: 1px solid rgb(200, 200, 200);
      padding-top: 5px;
      padding-left: 2px;
    }

    #info-two {
      width: 50px;
      font-size: 10px;
      padding: 3px;
      text-align: left;
      padding-left: 0px;
      padding-left: 2px;
    }
  
    #music-image {
        width: 50px;
        height: 50px;
        margin-left: 8px;
    }
  
    #artist-div {
        display: grid;
        grid-template-columns: auto auto auto;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }
    </style>