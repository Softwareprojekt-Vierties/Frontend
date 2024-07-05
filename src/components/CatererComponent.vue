<template>
    <div id="artist-div">
        <img class="user-avatar" src="../assets/left.jpg" width="20px" height="20px" @click="previousDish">
        <div id="dish-form">
            <img :src="imagePreview" id="music-image">
            <div id="right">
                <div id="text">{{dishName}}</div>
                <div id="ingredients">Zutaten:</div>
                <div id="info"> {{beschreibung1}} </div>
                <div id="info"> {{beschreibung2}}</div>
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
        dishes: [],
        dishesSize : '',
        dishesIndex : 0,
        imagePreview: null,
        sname:'',
        dishName : '',
        dishDescription1: '',
        dishDescription2: '',
        beschreibung1:'',
        beschreibung2:'',
        id:''
      };
    },
  
    async created(){
    let id = this.idFromFather;
    const token = localStorage.getItem('authToken');

      try {
          const response = await axios.get(`/getCatererById/${id}`,{headers: {'auth':token}});
          console.log(response);
          this.setFormData(response.data);
          console.log('caterer dishes data received:', response.data);
      } catch (error) {
          console.error('Error with sending caterer ID for dishes to DB :', error);
        }
    },
  
    methods: {
      
      previousDish(){
        if(this.dishesIndex>0){
            this.dishesIndex -= 1;
        } else{
            this.dishesIndex = 0;
        } 
        this.refreshDishes(this.dishes[this.dishesIndex]);
      },
  
      nextMusic(){
        if(this.dishesIndex >= 0 && this.dishesIndex < this.dishesSize -1){
            this.dishesIndex += 1;
        } else{
            this.dishesIndex = this.dishesSize - 1;
        }
        this.refreshDishes(this.dishes[this.dishesIndex]);
      },
  
      setFormData(data) {
        data['gerichte'].rows.forEach(dish => {
          let myvar = dish['beschreibung'].split(",")  
          this.dishes.push({
            id: dish['id'],
            dishName: dish['name'], 
            dishDescription1: myvar[0],
            dishDescription2 :myvar[1],
            imagePreview :dish['bild']
          })
        });
        console.log("dishes ->",this.dishes);
        this.dishesSize = this.dishes.length;   
        
        if (this.dishes.length > 0) {
          this.refreshDishes(this.dishes[this.dishesIndex]);
        } 
      },
      refreshDishes(data){
        this.dishName = data.dishName;
        this.beschreibung1 = data.dishDescription1;
        this.beschreibung2= data.dishDescription2;
        this.imagePreview = data.imagePreview;

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