<template>
  <div id="artist-div">
    <img class="user-avatar" src="../assets/left.jpg" width="20px" height="20px" @click="previousMusic">
    <div id="dish-form">
      <img :alt="currentSong.songName" src="../assets/music.jpg" id="music-image">
      <div id="right">
        <div id="text">{{ currentSong.songName }}</div>
        <div id="ingredients">Infos:</div>
        <div id="info">Länge: {{ currentSong.songLength }} min</div>
        <div id="info">Jahr: {{ formattedYear }}</div>
      </div>
    </div>
    <img class="user-avatar" src="../assets/right.jpg" width="20px" height="20px" @click="nextMusic">
  </div>
</template>


<script>
export default {
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      songsIndex: 0
    };
  },
  computed: {
    currentSong() {
      if (this.songs.length > 0) {
        return this.songs[this.songsIndex];
      } else {
        return {};
      }
    },
    formattedYear() {
      if (this.currentSong.songYear) {
        return this.currentSong.songYear.split('-')[0];
      } else {
        return '';
      }
    }
  },
  methods: {
    previousMusic() {
      if (this.songsIndex > 0) {
        this.songsIndex -= 1;
      }
    },
    nextMusic() {
      if (this.songsIndex < this.songs.length - 1) {
        this.songsIndex += 1;
      }
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