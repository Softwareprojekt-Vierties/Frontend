<template>
    <div id="app">
        <div id="header">
            <div id="profile-mail">
                <div class="icon-div">
                    <img @click="gotoProfilePage" alt="Filer" class="icon" src="../assets/profile-icon.png" />
                </div>
                <div class="icon-div">
                    <img @click="gotoMailPage" alt="Filer" class="icon" src="../assets/mail-icon.png" />
                </div>
            </div>
            <div id="new-event">
                <button @click="gotoEventCreation" id="new-event-button">Event erstellen</button>
            </div>
        </div>

        <div id="login-component">
            <LoginComponent />
        </div>

        <div id="selct-filter-searchbar">
            <div id="select-filter">
                <select v-model="searchType" class="options" @change="toggleSearchType">
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
                    <img alt="Filter" id="filter" src="../assets/filter.jpg" @click="toggleTooltip" />
                    <span class="filter-tooltip" id="dynamic-tooltip" v-html="filterContent" ref="filterContainer"></span>
                </div>
                <div>
                    <input v-model="searchInput" @keyup.enter="search" id="searchbar" type="search" name="search" placeholder="Hier suchen..." />
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
                <div @click="toggleBookmark" class="bookmark-arrow-div">
                    <img v-if="bookmarked" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-gray.jpg" />
                    <img v-else alt="Bookmark White" id="bookmark-white" src="../assets/bookmark-white.jpg" />
                </div>
                <div id="select-sort" @change="sortContent">
                    <select v-model="sortType" class="options">
                        <option v-for="option in sortingOptions[searchType]['filters']" :value="option" v-bind:key="option">{{translations[option]}}</option>
                    </select>
                </div>
                <div class="bookmark-arrow-div">
                    <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-bind:src="[sortAscending ? require('@/assets/arrow-up.jpg') : require('@/assets/normal-arrow.jpg')]" />
                </div>
            </div>
        </div>
        <div v-if="hasSearchResults" id="results">
            <CardComponent v-for="result in searchResults.events" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.uhrzeit?.[0] ?? '--:--'}Uhr - ${result.uhrzeit?.[1] ?? '-'}Uhr`" buttonText="Ticket buchen" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
            <CardComponent v-for="result in searchResults.location" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kapazität: ${result.capacity}`" :line3="`Preis: ${result.price}€/h`" buttonText="Event erstellen" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
            <CardComponent v-for="result in searchResults.artist" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.category}`" :line3="`Preis: ${result.price}€/h`" buttonText="Event erstellen" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
            <CardComponent v-for="result in searchResults.caterer" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.category}`" :line3="`Preis: ${result.price}€/h`" buttonText="Event erstellen" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
            <CardComponent v-for="result in searchResults.person" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Alter: ${result.age}`" :line3="`Geschlecht: ${result.gender}`" buttonText="Freundschaftsanfrage" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
            <CardComponent v-for="result in searchResults.tickets" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.uhrzeit?.[0] ?? '--:--'}Uhr - ${result.uhrzeit?.[1] ?? '-'}Uhr`" buttonText="Eventinfo" :imagePath="result.bild" :isBookmarked="result.leesezeichen ?? 0" :key="result.id"/>
        </div>
        <div v-else>
            <div v-if="searchError" class="events">
                <p>Seems there was an error :\</p>
            </div>
            <div v-else>
                <p>We couldn't find anything to suit you.<br>Maybe be less picky? ¯\_(ツ)_/¯</p>
            </div>
        </div>
    </div>
</template>

<script>
    import LoginComponent from "@/components/LoginComponent";
    import CardComponent from "@/components/CardComponent";
    import axios from 'axios'

    export default {
        components: {
            LoginComponent,
            CardComponent,
        },
        data() {
            return {
                filterContent: "",
                filterSelection: "",
                selectedFilters: [],
                filterOptions: {
                    '1': { name: 'location', filters: ['region', 'date', 'distance', 'capacity', 'rating', 'startTime', 'duration', 'openAir', 'price'] },
                    '2': { name: 'djBand', filters: ['region', 'date', 'distance', 'category', 'rating', 'startTime', 'duration', 'experience', 'price'] },
                    '3': { name: 'caterer', filters: ['region', 'date', 'distance', 'category', 'rating', 'startTime', 'duration', 'experience', 'price'] },
                    '4': { name: 'event', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '5': { name: 'person', filters: ['region', 'age', 'gender'] },
                    '6': { name: 'myEvents', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '7': { name: 'myTickets', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '8': { name: 'myFriends', filters: ['region', 'age', 'gender'] },
                    '9': { name: 'myLocation', filters: ['region', 'date', 'distance', 'capacity', 'rating', 'startTime', 'duration', 'openAir', 'price'] },
                },
                sortingOptions: {
                    "0": { name: "none", filters: ["name"] },
                    "1": { name: "location", filters: ["name", "region", "datum", "distance", "capacity", "rating", "uhrzeit", "duration", "preis"] },
                    "2": { name: "djBand", filters: ["name", "region", "datum", "distance", "category", "rating", "uhrzeit", "duration", "experience", "preis"] },
                    "3": { name: "caterer", filters: ["name", "region", "datum", "distance", "category", "rating", "uhrzeit", "duration", "experience", "preis"] },
                    "4": { name: "event", filters: ["name", "region", "eventgroesse", "preis", "distance", "altersfreigabe", "datum", "uhrzeit", "duration"] },
                    "5": { name: "person", filters: ["name", "region", "altersfreigabe", "gender"] },
                    "6": { name: "myEvents", filters: ["name", "region", "eventgroesse", "preis", "distance", "altersfreigabe", "datum", "uhrzeit", "duration"] },
                    "7": { name: "myTickets", filters: ["name", "region", "eventgroesse", "preis", "distance", "altersfreigabe", "datum", "uhrzeit", "duration"] },
                    "8": { name: "myFriends", filters: ["name", "region", "altersfreigabe", "gender"] },
                    "9": { name: "myLocation", filters: ["name", "region", "datum", "distance", "capacity", "rating", "uhrzeit", "duration", "preis"] },
                },
                translations: {
                    name: "Name",
                    region: "Region",
                    datum: "Datum",
                    distance: "Entfernung",
                    capacity: "Kapazität",
                    rating: "Bewertung",
                    uhrzeit: "Startzeit",
                    duration: "Dauer",
                    experience: "Erfahrung",
                    category: "Kategorie",
                    altersfreigabe: "Alter",
                    gender: "Geschlecht",
                    eventgroesse: "Eventgröße",
                    preis: "Preis",
                },
                searchInput: "",
                searchType: "0",
                sortType: "name",
                searchResults: [],
                searchError: false,
                hasSearchResults: false,
                sortAscending: false,
                bookmarked: false,
            };
        },
        methods: {
            toggleTooltip() {
                const tooltip = document.getElementById("dynamic-tooltip");
                tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
            },
            toggleSearchType(event) {
                this.updateFilterContent(event);
                this.sortType = "name";
                this.search();
            },
            updateFilterContent(event) {
                const selectedValue = event.target.value;
                if (selectedValue === "0") {
                    this.filterContent = "Wählen Sie eine Suchmodalität";
                } else {
                    const selectedFilters = this.filterOptions[selectedValue].filters;
                    this.selectedFilters = selectedFilters;
                    this.filterContent = this.generateFilterContent(selectedFilters);
                }
            },
            generateFilterContent(filters) {
                return filters
                    .map((filter) => {
                        switch (filter) {
                            case "region":
                                return `<div class="filter-item">Region: <input class="filter-region" type="text" placeholder="z.B. 32427 Minden"></div>`;
                            case "date":
                                return `<div class="filter-item">Datum: <input class="filter-date" type="date" placeholder="z.B. 17.08.2024"></div>`;
                            case "distance":
                                return `<div class="filter-item">Entfernung: <input class="filter-distance" type="range" min="0" max="100" oninput="rangeValue.innerText = this.value + 'Km'"><p id="rangeValue">50Km</p></div>`;
                            case "capacity":
                                return `<div class="filter-item">Kapazität: <div class="kapazitaet"> <input class="filter-capacity" type="number" min="0" placeholder="10 Personen"> - <input class="filter-capacity" type="number" min="0" placeholder="50 Personen"> </div></div>`;
                            case "rating":
                                return `<div class="filter-item">Bewertung: <input class="filter-rating" type="number" min="0" max="5" placeholder="3" step="1"></div>`;
                            case "startTime":
                                return `<div class="filter-item">Startzeit: <div class="time"> <input class="filter-time" type="time"> - <input class="filter-time" type="time"> </div></div>`;
                            case "duration":
                                return `<div class="filter-item">Dauer: <div class="duration"> <input class="filter-duration" type="number" min="0" placeholder="5 Stunden"> - <input class="filter-duration" type="number" min="0" placeholder="7 Stunden"> </div></div>`;
                            case "openAir":
                                return `<div class="filter-item">Open Air: <label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label> </div>`;
                            case "price":
                                return `<div class="filter-item">Preis: <div class="price"> <input class="filter-price" type="number" min="0" placeholder="50 €"> - <input class="filter-price" type="number" min="0" placeholder="500 €"> </div> </div>`;
                            case "category":
                                return `<div class="filter-item">Kategorie: <input class="filter-category" type="text" placeholder="Kategorie"></div>`;
                            case "experience":
                                return `<div class="filter-item">Erfahrung: <input class="filter-experience" type="number" min="0" placeholder="10 Jahren"></div>`;
                            case "eventSize":
                                return `<div class="filter-item">Eventgröße: <input class="filter-event-size" type="number" min="0" placeholder="Nr. Personen"></div>`;
                            case "ticketPrice":
                                return `<div class="filter-item">Ticketpreis: <input class="filter-ticket-price" type="number" min="0" placeholder="Ticketpreis"></div>`;
                            case "age":
                                return `<div class="filter-item">Alter: <input class="filter-age" type="number" min="0" placeholder="Alter"></div>`;
                            case "gender":
                                return `<div class="filter-item">Geschlecht: <select class="filter-gender"><option value="male">Männlich</option><option value="female">Weiblich</option></select></div>`;
                            default:
                                return "";
                        }
                    })
                    .join("");
            },
            submitFilters() {
                const filtersContainer = this.$refs.filterContainer;
                const filterValues = {};

                this.selectedFilters.forEach((filter) => {
                    switch (filter) {
                        case "region":
                            filterValues.region = filtersContainer.querySelector(".filter-region")?.value ?? "";
                            break;
                        case "date":
                                filterValues.date = filtersContainer.querySelector(".filter-date")?.value ?? "";
                            break;
                        case "distance":
                                filterValues.distance = filtersContainer.querySelector(".filter-distance")?.value ?? "";
                            break;
                        case "capacity":
                                filterValues.capacity = [
                                    filtersContainer.querySelectorAll(".filter-capacity")[0]?.value ?? "",
                                    filtersContainer.querySelectorAll(".filter-capacity")[1]?.value ?? "",
                                ];
                            break;
                        case "rating":
                                filterValues.rating = filtersContainer.querySelector(".filter-rating")?.value ?? "";
                            break;
                        case "startTime":
                                filterValues.startTime = [
                                    filtersContainer.querySelectorAll(".filter-time")[0]?.value ?? "",
                                    filtersContainer.querySelectorAll(".filter-time")[1]?.value ?? "",
                                ];
                            break;
                        case "duration":
                                filterValues.duration = [
                                    filtersContainer.querySelectorAll(".filter-duration")[0]?.value ?? "",
                                    filtersContainer.querySelectorAll(".filter-duration")[1]?.value ?? "",
                                ];
                            break;
                        case "openAir":
                                filterValues.openAir = filtersContainer.querySelector('input[type="checkbox"]')?.checked ?? false;
                            break;
                        case "price":
                                filterValues.price = [
                                    filtersContainer.querySelectorAll(".filter-price")[0]?.value ?? "",
                                    filtersContainer.querySelectorAll(".filter-price")[1]?.value ?? "",
                                ];
                            break;
                        case "category":
                                filterValues.category = filtersContainer.querySelector(".filter-category")?.value ?? "";
                            break;
                        case "experience":
                                filterValues.experience = filtersContainer.querySelector(".filter-experience")?.value ?? "";
                            break;
                        case "eventSize":
                                filterValues.eventSize = filtersContainer.querySelector(".filter-event-size")?.value ?? "";
                            break;
                        case "ticketPrice":
                                filterValues.ticketPrice = filtersContainer.querySelector(".filter-ticket-price")?.value ?? "";
                            break;
                        case "age":
                                filterValues.age = filtersContainer.querySelector(".filter-age")?.value ?? "";
                            break;
                        case "gender":
                                filterValues.gender = filtersContainer.querySelector(".filter-gender")?.value ?? "";
                            break;
                    }
                });

                return filterValues;
            },
            searchEvent() {
                let filterResults = this.submitFilters();
                axios.post("/searchEvent", {
                    openair: filterResults.openAir,
                    search: this.searchInput,
                    datum: filterResults.date,
                    uhrzeit: filterResults.startTime,
                    eventgroesse: filterResults.eventSize,
                    preis: filterResults.price,
                    altersfreigabe: filterResults.age,
                    region: filterResults.region,
                    distanz: filterResults.distance,
                })
                    .then(response => {
                        console.log("Successful search:", response);
                        this.searchResults.events = response.data;
                        this.hasSearchResults |= response.data.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            searchLocation() {
                let filterResults = this.submitFilters();
                axios.post("/searchLocation", {
                    openair: filterResults.openAir,
                    search: this.searchInput,
                    kapazitaet: filterResults.capacity,
                    preis: filterResults.price,
                    region: filterResults.region,
                    distanz: filterResults.distance,
                    bewertung: filterResults.rating,
                })
                    .then(response => {
                        console.log("Successful search:", response.data.rows);
                        this.searchResults.location = response.data.rows;
                        this.hasSearchResults |= response.data.rows.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            searchArtist() {
                let filterResults = this.submitFilters();
                axios.post("/search.artist", {
                    search: this.searchInput,
                    preis: filterResults.price,
                    kategorie: filterResults.category,
                    erfahrung: filterResults.experience,
                    distanz: filterResults.distance,
                    region: filterResults.region,
                    bewertung: filterResults.rating,
                })
                    .then(response => {
                        console.log("Successful search:", response.data.rows);
                        this.searchResults.artist = response.data.rows;
                        this.hasSearchResults |= response.data.rows.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            searchCaterer() {
                let filterResults = this.submitFilters();
                axios.post("/search.caterer", {
                    search: this.searchInput,
                    preis: filterResults.price,
                    kategorie: filterResults.category,
                    erfahrung: filterResults.experience,
                    distanz: filterResults.distance,
                    region: filterResults.region,
                    bewertung: filterResults.rating,
                })
                    .then(response => {
                        console.log("Successful search:", response.data.rows);
                        this.searchResults.caterer = response.data.rows;
                        this.hasSearchResults |= response.data.rows.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            searchPerson() {
                let filterResults = this.submitFilters();
                axios.post("/searchPerson", {
                    search: this.searchInput,
                    geschlecht: filterResults.gender,
                    alter: filterResults.age,
                    region: filterResults.region,
                })
                    .then(response => {
                        console.log("Successful search:", response.data.rows);
                        this.searchResults.person = response.data.rows;
                        this.hasSearchResults |= response.data.rows.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            searchTickets() {
                // let filterResults = this.submitFilters();
                axios.post("/searchTickets", {
                    search: this.searchInput,
                    // location and distance still have to go
                    // Datum
                    // Dauer?
                    // Startzeit?
                    // Bewertung
                    // Eventgröße
                    // Preis
                    // Alter?
                    // openair
                })
                    .then(response => {
                        console.log("Successful search:", response.data.rows);
                        this.searchResults.tickets = response.data.rows;
                        this.hasSearchResults |= response.data.rows.length > 0;
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            search() {
                this.searchResults = []
                this.hasSearchResults = false;
                this.searchError = false;
                switch (this.searchType) {
                    case "1":
                    case "9":
                        this.searchLocation();
                        break;
                    case "2":
                        this.searchArtist();
                        break;
                    case "3":
                        this.searchCaterer();
                        break;
                    case "4":
                    case "6":
                        this.searchEvent();
                        break;
                    case "5":
                    case "8":
                        this.searchPerson();
                        break;
                    case "7":
                        this.searchTickets();
                        break;

                    case "0":
                        this.searchLocation();
                        this.searchArtist();
                        this.searchCaterer();
                        this.searchEvent();
                        this.searchPerson();
                        this.searchTickets();
                        break;

                    default: break;
                }
            },
            sortArrowClick() {
                this.sortAscending = !this.sortAscending;
                this.sortContent();
            },
            sortContent() {
                let sortType = this.sortType;
                function sortCriteria(a, b) {
                    if (a[sortType] > b[sortType]) {
                        return 1;
                    } else if (a[sortType] < b[sortType]) {
                        return -1;
                    }
                    return 0;
                }

                if (this.sortAscending) {
                    Object.keys(this.searchResults).forEach((sortable) => this.searchResults[sortable].sort((a, b) => sortCriteria(a, b)));
                } else {
                    Object.keys(this.searchResults).forEach((sortable) => this.searchResults[sortable].sort((a, b) => -sortCriteria(a, b)));
                }
                this.$forceUpdate();
            },
            toggleBookmark() {
                this.bookmarked = !this.bookmarked;
                // filter for bookmarked elements
            },
            gotoProfilePage() {
                // go to the profile page
            },
            gotoMailPage() {
                // go to the mail page
            },
            gotoEventCreation() {
                // go to the event creation page
            },
        },
        created() {
            this.search();
        },
    };
</script>

<style scoped>

#app {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
}

  #header {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;
  }

  .events-outside-div {
      margin-left: 45px;
      margin-top: 50px;
      background-color: #e3e2e2;
      border: 0px solid #bebdbd;
  }

  .events {
      display: grid;
      grid-template: auto auto auto;
      gap: 10px;
      border-radius: 10px; 
      flex-wrap: wrap;
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
      display: inline-grid;
      grid-template-columns: auto auto auto;
      gird-columns: 1;
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

  .rangeValue {
      text-align: center;
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
      flex: 1;
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

  #results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 0px));
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 16px;
      flex: 1;
      overflow-y: auto;
      padding-top: 0px;
      margin-top: 50px;
  }
</style>

