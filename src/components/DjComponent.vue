<template>
    <div id="artist-div">
        <img class="user-avatar" src="../assets/left.jpg" width="20px" height="20px">
        <div id="dish-form">
            <img :alt="name" src="../assets/music.jpg" id="image">
            <div id="right">
                <div id="text">Party-Song</div>
                <div id="ingredients">Infos:</div>
                <div id="input">Länge: 3,41 min</div>
                <div id="input">Jahr: 2024</div>
            </div>
        </div>
        <img class="user-avatar" src="../assets/right.jpg" width="20px" height="20px">
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      getData() {
        return {
          songName: this.songName,
          songLength: this.songLength,
          songYear: this.songYear
        };
      },
      clearFields() {
        this.songName = '';
        this.songLength = '';
        this.songYear = '';
      }
    }
  }
  </script>
    
    <style scoped>
    #dish-form {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: center;
        align-items: center;
        gap: 15px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        padding-left: 12px;
        padding-top: 7px;
        padding-bottom: 10px;
        padding-right: 12px;
        margin-left: 2px;
        margin-right: 2px;
        background-color: white;
    }
    
    #right {
        display: grid;
        grid-template-columns: auto;
    }
    
    #text {
      text-align: left;
      font-size: 12px;
      margin-top: 5px;
      font-weight: bolder;
    }
    
    #input {
      width: 100px;
      margin-top: 5px;
      font-size: 10px;
      padding: 3px;
      text-align: left;
      padding-left: 0px;
    }
    
    #ingredients {
      text-align: left;
      font-size: 11px;
      margin-top: 5px;
      border-top: 1px solid rgb(200, 200, 200);
      padding-top: 5px;
      font-weight: bolder;
    }

    #image {
        width: 80px;
        height: 80px;
    }

    #artist-div {
        display: grid;
        grid-template-columns: auto auto auto;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }
    </style>