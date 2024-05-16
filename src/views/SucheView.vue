<template>
    <div id="header">
        <div id="profile-mail">
            <div class = "icon-div">
                <img alt="Filer" class="icon" src="../assets/profile-icon.png">
            </div>
            <div class = "icon-div">
                <img alt="Filer" class="icon" src="../assets/mail-icon.png">
            </div>
        </div>
        <div id= "new-event">
            <button id="new-event-button">Event erstellen</button>
        </div>
    </div>

    <div id="login-component">
        <LoginComponent />
    </div>
    
    <div id="selct-filter-searchbar">
        <div id="select-filter">
            <select class="options"  @change="updateFilterContent">
                <option value="0">Kategorie wählen</option>
                <option value="1">Location</option>
                <option value="2">DJ/Band</option>
                <option value="3">Caterer</option>
                <option value="4">Event</option>
                <option value="5">Person</option>
                <option value="6">Meine Events</option>
                <option value="7">Meine Tickets</option>
                <option value="8">Meine Freunde</option>
                <option value="9">Meine Locations</option>
            </select>
    </div>
    
        <div id="searchbar-and-icons">
            <div class="filter-container">
                <img alt="Filter" id="filter" src="../assets/filter.jpg" @click="toggleTooltip">
                <span class="filter-tooltip" id="dynamic-tooltip" v-html="filterContent"></span>
            </div>
            <div>
                <input id="searchbar" type="search" name="seach" placeholder="Hier suchen... "/>
            </div>
            <div>
                <img alt="Magnifying Glass" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
            </div>
        </div>
    </div>

  <div class="events-outside-div">
    <div id="bookmark-arrow">
        <div class="bookmark-arrow-div">
            <img alt="Bookmark White" id="bookmark-white" src="../assets/bookmark-white.jpg">
        </div>
        <div id="select-sort">
            <select class="options">
                <option value="1">Location</option>
                <option value="2">DJ/Band</option>
                <option value="3">Caterer</option>
                <option value="4">Event</option>
                <option value="5">Person</option>
                <option value="6">Meine Events</option>
                <option value="7">Meine Tickets</option>
                <option value="8">Meine Freunde</option>
                <option value="9">Meine Locations</option>
            </select>
        </div>
        <div class="bookmark-arrow-div">
            <img alt="Normal Arrow" id="normal-arrow" src="../assets/normal-arrow.jpg">
        </div>
    </div>
    <div class="events">
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />
      <EventCardComponent />          
    </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent';
import EventCardComponent from '@/components/EventCardComponent';

export default {
  components: {
    LoginComponent,
    EventCardComponent
  },
  data() {
    return {
      filterContent: '',
      filterOptions: {
        '1': {name: 'location', filters: ['region', 'date', 'distance', 'capacity', 'rating', 'startTime', 'duration', 'openAir', 'price']},
        '2': {name: 'djBand', filters: ['region', 'date', 'distance', 'category', 'rating', 'startTime', 'duration', 'experience', 'price']},
        '3': {name: 'caterer', filters: ['region', 'date', 'distance', 'category', 'rating', 'startTime', 'duration', 'experience', 'price']},
        '4': {name: 'event', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir']},
        '5': {name: 'person', filters: ['region', 'age', 'gender']},
        '6': {name: 'myEvents', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir']},
        '7': {name: 'myTickets', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir']},
        '8': {name: 'myFriends', filters: ['region', 'age', 'gender']},
        '9': {name: 'myLocation', filters: ['region', 'date', 'distance', 'capacity', 'rating', 'startTime', 'duration', 'openAir', 'price']}
      }
    };
  },
  methods: {
    toggleTooltip() {
      const tooltip = document.getElementById('dynamic-tooltip');
      tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
    },
    updateFilterContent(event) {
      const selectedValue = event.target.value;
      if (selectedValue === "0") {
                
                this.filterContent = "Wählen Sie eine Suchmodalität";
            } else {
               
                const selectedFilters = this.filterOptions[selectedValue].filters;
                this.filterContent = this.generateFilterContent(selectedFilters);
            }
    },
    generateFilterContent(filters) {
      return filters.map(filter => {
        switch (filter) {
          case 'region':
            return `<div class="filter-item">Region:  <input class ="filter-region" type="text" placeholder="z.B. 32427 Minden"></div>`;
          case 'date':
            return `<div class="filter-item">Datum: <input class="filter-date" type="date" placeholder="z.B. 17.08.2024"></div>`;
          case 'distance':
            return `<div class="filter-item">Entfernung: 0km<input class="filter-distance" type="range" min="0" max="100" value="30km"> <span> 5km</span></div>`;
          case 'capacity':
            return `<div class="filter-item">Kapazität: <input class="filter-capacity" type="number" min="0"  placeholder="10 Personen"> - <input class="filter-capacity-2" type="number" min="0" placeholder="50 Personen"></div>`;
          case 'rating':
            return `<div class="filter-item">Bewertung: <input class="filter-rating" type="number" min="0" max="5" placeholder="3" step="1"></div>`;
          case 'startTime':
            return `<div class="filter-item">Startzeit: <input class="filter-time" type="time"> - <input class="filter-time-2" type="time" ></div>`;
          case 'duration':
            return `<div class="filter-item">Dauer: <input  class="filter-duration-2" type="number" min="0" placeholder="5 Stunden"> - <input class="filter-duration" type="number" min="0" placeholder="7 Stunden"></div>`;
          case 'openAir':
            return `<div class="filter-item">Open Air: <input class="filter-openair " type="checkbox" ></div>`;
          case 'price':
            return `<div class="filter-item">Preis: <input class="filter-price" type="number" min="0"  placeholder="50 €"> - <input class="filter-price-2" type="number" min="0" placeholder="500 €"></div>`;
          case 'category':
            return `<div class="filter-item">Kategorie: <input class="filter-category" type="text"  placeholder="Kategorie"></div>`;
          case 'experience':
            return `<div class="filter-item">Erfahrung: <input class="filter-experience" type="number" min="0" placeholder="10 Jahren"></div>`;
          case 'eventSize':
            return `<div class="filter-item">Eventgröße: <input class="filter-event-size" type="number" min="0" placeholder="Nr. Personen"></div>`;
          case 'ticketPrice':
            return `<div class="filter-item">Ticketpreis: <input class="filter-ticket-price" type="number" min="0" placeholder="Ticketpreis"></div>`;
          case 'age':
            return `<div class="filter-item">Alter: <input class="filter-age" type="number" min="0"  placeholder="Alter"></div>`;
          case 'gender':
            return `<div class="filter-item">Geschlecht: <select class ="filter-gender"><option value="male">Männlich</option><option value="female">Weiblich</option></select></div>`;
          default:
            return '';
        }
      }).join('');
    }
  }
};
</script>

  

<style scoped>



#header {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}

.events-outside-div{
  display:flex;
  flex-direction: column;
  margin-top: 40px;
  display:flex;
  background-color: #e3e2e2;
  border: 0px solid #bebdbd;
  min-height: 300px;
}

.events{
  display:flex;
  flex:5;
  border-radius:10px; 
  flex-wrap: wrap;
  justify-content:flex-start;
}

.filter-container {
  position: relative;
  display: inline-block;
}

::v-deep .filter-region {
  margin-left: 27px;
  padding-left: 10px;
  width: 180px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-gender {
  margin-left: 1px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-experience {
  margin-left: 12px;
  padding-left: 10px;
  width:100px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-openair {
  margin-left: 20px;
}

::v-deep .filter-age {
  margin-left: 46px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-event-size {
  margin-left: 1px;
  width: 120px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-ticket-price {
  margin-left: 4px;
  width: 120px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-category {
  padding-left: 10px;
  margin-left: 10px;
  border-radius: 8px;
  width:100px;
  border: 0px solid #ccc;
}

::v-deep .filter-rating {
  padding-left: 10px;
  margin-left: 5px;
  border-radius: 8px;
  width:100px;
  border: 0px solid #ccc;
}

::v-deep .filter-price {
  margin-left: 46px;
  padding-left: 10px;
  margin-right: 4px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-price-2 {
  margin-left: 8px;
  padding-left: 10px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}


::v-deep .filter-duration {
  margin-left: 10px;
  padding-left: 10px;
  margin-right: 12px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-duration-2 {
  margin-left: 38px;
  padding-left: 10px;
  margin-right: 6px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-time {
  margin-left: 22px;
  padding-left: 12px;
  margin-right: 8px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-time-2 {
  margin-left: 8px;
  padding-left: 12px;
  margin-right: 8px;
  width: 80px;
  border-radius: 8px;
  border: 0px solid #ccc;
}


::v-deep .filter-capacity {
  margin-left: 15px;
  padding-left: 1px;
  margin-right: 8px;
  width: 90px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-capacity-2 {
  margin-left: 8px;
  padding-left: 1px;
  width: 90px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-date {
  margin-left: 32px;
  padding-left: 10px;
  width: 120px;
  border-radius: 8px;
  border: 0px solid #ccc;
}

::v-deep .filter-distance{
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 30px;
  width: 140px;
}


.filter-tooltip {
  display: none;
  position: absolute;
  top: 98%;
  left: 50%;
  transform: translateX(-5%);
  background-color: rgb(234, 230, 230);
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 100;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: max-content;
}

::v-deep .filter-item {
  display: flex;
  justify-content: start; 
  align-items: center;
  margin-bottom: 8px; 
}

#filter,
#magnifying-glass {
    cursor: pointer;
}



.icon-div {
  padding: 15px;
  padding-bottom: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  cursor: pointer;
}

.icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

#new-event-button {
  border-radius: 5px;
  width: 160px;
  height: 42.5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border: 1px solid #000000;
  cursor: pointer;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  margin-right: 100px;
}

#profile-mail {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-left: 50px;
}

#login-component {
  margin-top: 50px;
}

#selct-filter-searchbar {
  margin-top: 50px;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-right: 100px;
  margin-right: 0px;
}

#select-filter {
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  justify-content: end;
}

#searchbar-and-icons {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  justify-content: left;
  gap: 10px;
  border-radius: 20px;
  border: 1.0px solid #cccccc;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  height: 35px;
  width: 600px;
  padding-left: 10px;
}

.options {
  border-radius: 20px;
  border: 1.0px solid #cccccc;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 130px;
  height: 37px;
  border-radius: 45px;
  text-align: center;
}

#searchbar {
  width: 510px;
  height: 30px;
  border: 0px;
}

#searchbar:focus {
  outline: none;
}

#bookmark-arrow {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: left;
  gap: 10px;
  background-color: white;
}

.bookmark-arrow-div {
  border-radius: 20px;
  border: 1.0px solid #cccccc;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 40px;
  height: 35px;
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  justify-content: center;
  flex:1;
}

#bookmark-white {
  width: 15px;
  height: 30px;
}

#normal-arrow {
  width: 20px;
  height: 30px;
}
</style>