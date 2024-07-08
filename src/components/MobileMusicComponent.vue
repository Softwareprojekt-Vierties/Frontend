<template>
    <div id="dish-form">
      <div id="right">
        <div id="text">
          Titel:
        </div>
        <input v-model="songName" class="input" placeholder="z.B. Party-Song">
        <div id="infos">
          Infos:
        </div>
        <input v-model="songLength" class="input" placeholder="z.B. Länge: 3,41 min">
        <input v-model="songYear" class="input" placeholder="z.B. Jahr: 2024">
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        songName: '',
        songLength: '',
        songYear: ''
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
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        width: 130px;
        padding-bottom: 7px;
    }
    
    #upload-text {
        color: rgb(209, 209, 209);
        padding-top: 5px;
        font-size: 7px;
    }
    
    #right {
        display: grid;
        grid-template-columns: auto;
    }
    
    #text {
      text-align: left;
      font-size: 11px;
      margin-top: 5px;
    }
    
    .input {
      width: 100px;
      border-radius: 5px;
      border: 1px solid #000;
      margin-top: 5px;
      font-size: 10px;
      padding: 3px;
      padding-left: 10px;
      height: 11px;
    }
    
    #infos {
      text-align: left;
      font-size: 10px;
      margin-top: 5px;
      border-top: 1px solid rgb(200, 200, 200);
      padding-top: 5px;
    }
    </style>