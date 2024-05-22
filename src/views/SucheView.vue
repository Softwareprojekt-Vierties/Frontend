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
            <select v-model="searchType" class="options"  @change="updateFilterContent">
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
                <input v-model="searchInput" id="searchbar" type="search" name="searchInput" placeholder="Hier suchen... "/>
            </div>
            <div>
                <button @click="search" class="searchButton">
                    <img alt="Magnifying Glass" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
                </button>
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
    import axios from 'axios'

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
                },
                searchInput : "",
                searchType : '0'
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
                            return `<div class="filter-item">Region: <input class ="filter-region" type="text" placeholder="z.B. 32427 Minden"></div>`;
                        case 'date':
                            return `<div class="filter-item">Datum: <input class="filter-date" type="date" placeholder="z.B. 17.08.2024"></div>`;
                        case 'distance':
                            return `<div class="filter-item">Entfernung: <input class="filter-distance" type="range" min="0" max="100"> <span></span></div>`;
                        case 'capacity':
                            return `<div class="filter-item">Kapazität: <div class = kapazitaet> <input class="filter-capacity" type="number" min="0"  placeholder="10 Personen"> - <input class="filter-capacity" type="number" min="0" placeholder="50 Personen"> </div></div>`;
                        case 'rating':
                            return `<div class="filter-item">Bewertung: <input class="filter-rating" type="number" min="0" max="5" placeholder="3" step="1"></div>`;
                        case 'startTime':
                            return `<div class="filter-item">Startzeit: <div class = "time"> <input class="filter-time" type="time"> - <input class="filter-time" type="time" > </div></div>`;
                        case 'duration':
                            return `<div class="filter-item">Dauer: <div class = "duration"> <input class="filter-duration" type="number" min="0" placeholder="5 Stunden"> - <input class="filter-duration" type="number" min="0" placeholder="7 Stunden"> </div></div>`;
                        case 'openAir':
                            return `<div class="filter-item">Open Air: <label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label> </div>`;
                        case 'price':
                            return `<div class="filter-item">Preis: <div class = "price"> <input class="filter-price" type="number" min="0"  placeholder="50 €"> - <input class="filter-price" type="number" min="0" placeholder="500 €"> </div> </div>`;
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
            },
            search() {
                axios.post("/search", {
                    search: this.searchInput,
                    searchType: this.searchType
                })
                    .then(response => {
                        console.log("Successful search:", response.data);
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                    })
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

::v-deep .switch {
    position: relative;
    display: inline-block;
    width: 40px; /* Angepasst an die neue Höhe */
    height: 20px;
    margin-left: 37%;
}

::v-deep .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

::v-deep .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 20px; /* Angepasst an die neue Höhe */
}

::v-deep .slider:before {
    position: absolute;
    content: "";
    height: 16px; /* Angepasst an die neue Höhe */
    width: 16px; /* Angepasst an die neue Höhe */
    left: 2px; /* Angepasst an die neue Höhe */
    bottom: 2px; /* Angepasst an die neue Höhe */
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

::v-deep input:checked + .slider {
    background-color: #2196F3;
}

::v-deep input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

::v-deep input:checked + .slider:before {
    -webkit-transform: translateX(20px); /* Angepasst an die neue Höhe */
    -ms-transform: translateX(20px); /* Angepasst an die neue Höhe */
    transform: translateX(20px); /* Angepasst an die neue Höhe */
}

::v-deep .filter-region {
    margin-left: 15%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-gender {
    margin-left: 10%;
    width: 305px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-experience {
    margin-left: 11.2%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-openair {
    margin-left: 20px;
}

::v-deep .filter-age {
    margin-left: 18.3%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-event-size {
    margin-left: 9.3%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-ticket-price {
    margin-left: 10.5%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-category {
    margin-left: 11.8%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-rating {
    margin-left: 10%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-duration {
    width: 125px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-price {
    width: 125px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-time {
    width: 128px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}


::v-deep .filter-capacity {
    width: 124px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-date {
    margin-left: 15.8%;
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-distance{
    margin-left: 10.2%;
    width: 300px;
    height: 20px;
    border: 1px solid #ccc;
    text-align: center;
}


.filter-tooltip {
    display: none;
    position: absolute;
    top: 120%;
    transform: translateX(-1%);
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    width: 555px;
    padding-left: 40px;
}

::v-deep .filter-item {
    display: flex;
    justify-content: start; 
    align-items: center;
    margin-bottom: 8px; 
}

::v-deep .kapazitaet {
    margin-left: 12%;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .time {
    margin-left: 13.2%;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .duration {
    margin-left: 16%;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .price{
    margin-left: 17.2%;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
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

.searchButton {
    display: inline-flex;
    border: none;
    background-color: white;
}
</style>
