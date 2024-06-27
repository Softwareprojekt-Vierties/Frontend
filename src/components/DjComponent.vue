<template>
  <div id="artist-div">
      <img class="user-avatar" src="../assets/left.jpg" width="20px" height="20px" @click="previousMusic">
      <div id="dish-form">
          <img :alt="name" src="../assets/music.jpg" id="music-image">
          <div id="right">
              <div id="text">{{sName}}</div>
              <div id="ingredients">Infos:</div>
              <div id="info">Länge: {{slength}} min</div>
              <div id="info">Jahr: {{sYear}}</div>
          </div>
      </div>
      <img class="user-avatar" src="../assets/right.jpg" width="20px" height="20px" @click="nextMusic">
  </div>
</template>

<script>
import axios from 'axios'; 

export default {
  
  props:{
        idFromFather:{
            type:Number
        }
  },
  
  data() {
    return {
      songs: [],
      songsSize : '',
      songsIndex : 0,
      sname:'',
      slength : '',
      sYear: '',
    };
  },

  async created(){
  let id = this.idFromFather;
    try {
        const response = await axios.get(`/getArtistById/${id}`);
        console.log(response);
        this.setFormData(response.data);
        console.log('dj songs data received:', response.data);
    } catch (error) {
        console.error('Error with sending dj ID for songs to DB :', error);
      }
  },

  methods: {
    
    previousMusic(){
      if(this.songsIndex>0){
          this.songsIndex -= 1;
      } else{
          this.songsIndex = 0;
      } 
      this.refreshSong(this.songs[this.songsIndex]);
    },

    nextMusic(){
      if(this.songsIndex >= 0 && this.songsIndex < this.songsSize -1){
          this.songsIndex += 1;
      } else{
          this.songsIndex = this.songsSize - 1;
      }
      this.refreshSong(this.songs[this.songsIndex]);
    },

    setFormData(data) {
      data['lieder'].rows.forEach(lied => {
        this.songs.push({
          id: lied['id'],
          songName: lied['name'], 
          songLength: lied['laenge'], 
          songYear: lied['erscheinung'].substring(0, 10)
        })
      });
      console.log("songs ->",this.songs);
      this.songsSize = this.songs.length;   
      
      if (this.songs.length > 0) {
        this.refreshSong(this.songs[this.songsIndex]);
      } 
    },

    refreshSong(data){
      this.sName = data.songName;
      this.slength = data.songLength;
      let myVar = data.songYear.split('-');
      this.sYear = myVar[0];
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
  
  #info {
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

  #music-image {
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