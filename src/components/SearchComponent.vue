<template>
    <div id="filter-tooltip-background" @click="toggleTooltip"></div>
    <div id="main_div">
        <div id="selct-filter-searchbar">
            <div id="select_filter">
                <select v-model="searchType" class="options" @change="toggleSearchType" :disabled="!mutable">
                    <option value="0" v-if="appliedSearchTypes.includes('0')">Kategorie wählen</option>
                    <option value="1" v-if="appliedSearchTypes.includes('1')">Location</option>
                    <option value="2" v-if="appliedSearchTypes.includes('2')">DJ/Band</option>
                    <option value="3" v-if="appliedSearchTypes.includes('3')">Caterer</option>
                    <option value="4" v-if="appliedSearchTypes.includes('4')">Event</option>
                    <option value="5" v-if="appliedSearchTypes.includes('5')">Person</option>
                    <option value="6" v-if="appliedSearchTypes.includes('6')">Meine Events</option>
                    <option value="7" v-if="appliedSearchTypes.includes('7')">Meine Tickets</option>
                    <option value="8" v-if="appliedSearchTypes.includes('8')">Meine Freunde</option>
                    <option value="9" v-if="appliedSearchTypes.includes('9')">Meine Locations</option>
                </select>
            </div>

            <div id="searchbar-and-icons">
                <div class="filter-container">
                    <img alt="Filter" id="filter" v-if="isDarkMode" src="../assets/filter.png" @click="toggleTooltip" />
                    <img alt="Filter" id="filter" v-else src="../assets/filter.jpg" @click="toggleTooltip" />
                    <span class="filter-tooltip" id="dynamic-tooltip" v-html="filterContent" ref="filterContainer"></span>
                </div>
                <div>
                    <input v-model="searchInput" @keyup.enter="search" id="searchbar" type="search" name="search" placeholder="Hier suchen..." />
                </div>
                <div>
                    <button @click="search" class="searchButton">
                        <img alt="Magnifying Glass" id="magnifying-glass" v-if="isDarkMode" src="../assets/magnifying-glass.png">
                        <img alt="Magnifying Glass" id="magnifying-glass" v-else src="../assets/magnifying-glass.jpg">
                    </button>
                </div>
            </div>
        </div>

        <div class="events-outside-div">
            <div id="bookmark-arrow">
                <div @click="toggleBookmark" class="bookmark-arrow-div">
                    <img v-if="bookmarked && isDarkMode" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-filled.png" />
                    <img v-else-if="isDarkMode" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-empty.png" />
                    <img v-else-if="bookmarked" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-gray.jpg" />
                    <img v-else alt="Bookmark White" id="bookmark-white" src="../assets/bookmark-white.jpg" />
                </div>
                <div id="select-sort" @change="sortContent">
                    <select v-model="sortType" class="options">
                        <option v-for="option in sortingOptions[searchType]['filters']" :value="option" v-bind:key="option" :disabled="option === 'unsortiert'">{{translations[option]}}</option>
                    </select>
                </div>
                <div class="bookmark-arrow-div">
                    <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-if="sortAscending && isDarkMode" src="../assets/arrow-up-dark.png" />
                    <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else-if="isDarkMode" src="../assets/arrow-down-dark.png" />
                    <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else-if="sortAscending" src="../assets/arrow-up.jpg" />
                    <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else src="../assets/normal-arrow.jpg" />
                </div>
            </div>
        </div>

        <div>
            <div v-if="hasSearchResults">
                <div v-if="searchType==0" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.combined.filter(item => item.info.favorit == true) : searchResults.combined" :name="result.name" :line1="result.line1" :line2="result.line2" :line3="result.line3" :buttonText="result.buttonText" :imagePath="result.imagePath" :isBookmarked="result.info.favorit ?? 0" :buttonClickFunction="result.buttonClickFunction" :titleClickFunction="result.titleClickFunction" :info="result.info" :key="result.key"/>
                </div>
                <div v-else-if="searchType == 4 || searchType == 6" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.events.filter(item => item.favorit == true) : searchResults.events" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.startuhrzeit ?? '--:--'}Uhr - ${result.enduhrzeit ?? '--:--'}Uhr`" :buttonText="buttonTexts.event" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.event" :titleClickFunction="titleClickFunctions.event" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 1 || searchType == 9" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.location.filter(item => item.favorit == true) : searchResults.location" :name="result.name" :line1="`Addresse: ${result.adresse}`" :line2="`Kapazität: ${result.kapazitaet}`" :line3="`Preis: ${result.preis}`" :buttonText="buttonTexts.location" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.location" :titleClickFunction="titleClickFunctions.location" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 2" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.artist.filter(item => item.favorit == true) : searchResults.artist" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.kategorie}`" :line3="`Preis: ${result.preis}€/h`" :buttonText="buttonTexts.artist" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.artist" :titleClickFunction="titleClickFunctions.artist" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 3" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.caterer.filter(item => item.favorit == true) : searchResults.caterer" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.kategorie}`" :line3="`Preis: ${result.preis}€/h`" :buttonText="buttonTexts.caterer" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.caterer" :titleClickFunction="titleClickFunctions.caterer" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 5 || searchType == 8" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.person.filter(item => item.favorit == true) : searchResults.person" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Alter: ${result.alter}`" line3="" :buttonText="buttonTexts.person" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.person" :titleClickFunction="titleClickFunctions.person" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 7" id="results">
                    <CardComponent v-for="result in bookmarked ? searchResults.tickets.filter(item => item.favorit == true) : searchResults.tickets" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.uhrzeit?.[0] ?? '--:--'}Uhr - ${result.uhrzeit?.[1] ?? '-'}Uhr`" :buttonText="buttonTexts.ticket" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.ticket" :titleClickFunction="titleClickFunctions.ticket" :info="result" :key="result.id"/>
                </div>
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
    </div>
</template>

<script>
    import CardComponent from "@/components/CardComponent";
    import axios from "axios";

    export default {
        name: 'SearchComponent',
        props: {
            msg: String,
            startValue: {
                type: String,
                default: null,
            },
            mutable: {
                type: Boolean,
                default: true,
            },
            eventButtonFunction: {
                type: Function,
                default: null,
            },
            locationButtonFunction: {
                type: Function,
                default: null,
            },
            artistButtonFunction: {
                type: Function,
                default: null,
            },
            catererButtonFunction: {
                type: Function,
                default: null,
            },
            personButtonFunction: {
                type: Function,
                default: null,
            },
            ticketButtonFunction: {
                type: Function,
                default: null,
            },
            eventTitleFunction: {
                type: Function,
                default: null,
            },
            locationTitleFunction: {
                type: Function,
                default: null,
            },
            artistTitleFunction: {
                type: Function,
                default: null,
            },
            catererTitleFunction: {
                type: Function,
                default: null,
            },
            personTitleFunction: {
                type: Function,
                default: null,
            },
            ticketTitleFunction: {
                type: Function,
                default: null,
            },
            eventButtonText: {
                type: String,
                default: null,
            },
            locationButtonText: {
                type: String,
                default: null,
            },
            artistButtonText: {
                type: String,
                default: null,
            },
            catererButtonText: {
                type: String,
                default: null,
            },
            personButtonText: {
                type: String,
                default: null,
            },
            ticketButtonText: {
                type: String,
                default: null,
            },
            allowedSearchTypes: {
                type: Array,
                default: null,
            }
        },
        components: {
            CardComponent,
        },
        data() {
            return {
                filterContent: "",
                filterSelection: "",
                selectedFilters: [],
                filterOptions: {
                    '1': { name: 'location', filters: ['region', 'distance', 'capacity', 'rating', 'openAir', 'price'] },
                    '2': { name: 'djBand', filters: ['region', 'distance', 'category', 'rating', 'experience', 'price'] },
                    '3': { name: 'caterer', filters: ['region', 'distance', 'category', 'rating', 'experience', 'price'] },
                    '4': { name: 'event', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '5': { name: 'person', filters: ['region', 'age'] },
                    '6': { name: 'myEvents', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '7': { name: 'myTickets', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                    '8': { name: 'myFriends', filters: ['region', 'age'] },
                    '9': { name: 'myLocation', filters: ['region', 'distance', 'capacity', 'rating', 'openAir', 'price'] },
                },
                sortingOptions: {
                    "0": { name: "none", filters: ["unsortiert", "name"] },
                    "1": { name: "location", filters: ["unsortiert", "name", "adresse", "entfernung", "kapazitaet", "sterne", "preis"] },
                    "2": { name: "djBand", filters: ["unsortiert", "name", "adresse", "entfernung", "kategorie", "sterne", "experience", "preis"] },
                    "3": { name: "caterer", filters: ["unsortiert", "name", "adresse", "entfernung", "kategorie", "sterne", "experience", "preis"] },
                    "4": { name: "event", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                    "5": { name: "person", filters: ["unsortiert", "name", "adresse", "altersfreigabe"] },
                    "6": { name: "myEvents", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                    "7": { name: "myTickets", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                    "8": { name: "myFriends", filters: ["unsortiert", "name", "adresse", "altersfreigabe"] },
                    "9": { name: "myLocation", filters: ["unsortiert", "name", "adresse", "entfernung", "kapazitaet", "sterne", "preis"] },
                },
                translations: {
                    unsortiert: "keine Sortierung",
                    name: "Name",
                    adresse: "Addresse",
                    datum: "Datum",
                    entfernung: "Entfernung",
                    kapazitaet: "Kapazität",
                    sterne: "Bewertung",
                    uhrzeit: "Startzeit",
                    dauer: "Dauer",
                    experience: "Erfahrung",
                    kategorie: "Kategorie",
                    altersfreigabe: "Alter",
                    eventgroesse: "Eventgröße",
                    preis: "Preis",
                },
                searchInput: "",
                searchType: "0",
                sortType: "unsortiert",
                searchResults: [],
                searchError: false,
                hasSearchResults: false,
                sortAscending: false,
                bookmarked: false,
                titleClickFunctions: {},
                buttonClickFunctions: {},
                buttonTexts: {},
                appliedSearchTypes: [],
            };
        },
        methods: {
            toggleTooltip() {
                const tooltip = document.getElementById("dynamic-tooltip");
                tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
                const tooltipBackground = document.getElementById("filter-tooltip-background");
                tooltipBackground.style.display = tooltipBackground.style.display === "block" ? "none" : "block";
            },
            hideTooltip() {
                const tooltip = document.getElementById("dynamic-tooltip");
                if (tooltip) {
                    tooltip.style.display = "none";
                }
                const tooltipBackground = document.getElementById("filter-tooltip-background");
                if (tooltipBackground) {
                    tooltipBackground.style.display = "none";
                }
            },
            toggleSearchType() {
                this.updateFilterContent();
                this.sortType = "unsortiert";
                this.search();
            },
            updateFilterContent() {
                const selectedValue = this.searchType;
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
                                return `<div class="filter-item">Addresse: <input class="filter-region" type="text" placeholder="z.B. 32427 Minden"></div>`;
                            case "date":
                                return `<div class="filter-item">Datum: <input class="filter-date" type="date" placeholder="z.B. 17.08.2024"></div>`;
                            case "distance":
                                return `<div class="filter-item">Entfernung: <input class="filter-distance" type="range" min="0" max="100" value="100" oninput="rangeValue.innerText = this.value + (this.value == 100 ? 'Km+' : 'Km')"><p id="rangeValue">100Km+</p></div>`;
                            case "capacity":
                                return `<div class="filter-item">Kapazität: <div class="kapazitaet"> <input id="first-capacity" class="filter-capacity" type="number" min="0" placeholder="10 Personen"> - <input id="second-capacity" class="filter-capacity" type="number" min="0" placeholder="50 Personen"> </div></div>`;
                            case "rating":
                                return `<div class="filter-item">Bewertung: <fieldset class="filter-rating" ><input type="radio" name="rating" title="star5" value="5" /><input type="radio" name="rating" title="star4" value="4" /><input type="radio" name="rating" title="star3" value="3" /><input type="radio" name="rating" title="star2" value="2" /><input type="radio" name="rating" title="star1" value="1" checked /></input></fieldset></div>`;
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
                            default:
                                return "";
                        }
                    })
                    .join("");
            },
            submitFilters() {
                const filtersContainer = this.$refs.filterContainer;
                const filterValues = {};

                if (filtersContainer == null) {
                    return filterValues;
                }
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
                                filterValues.rating = filtersContainer.querySelector(".filter-rating input:checked")?.value ?? "";
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
                                    filtersContainer.querySelectorAll(".filter-price")[0]?.value ? +(filtersContainer.querySelectorAll(".filter-price")[0]?.value) : null,
                                    filtersContainer.querySelectorAll(".filter-price")[1]?.value ? +(filtersContainer.querySelectorAll(".filter-price")[1]?.value) : null,
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
                    }
                });

                return filterValues;
            },
            packageFilters() {
                let filterResults = this.submitFilters();
                let packet = {};

                if (this.searchInput != null && this.searchInput != 0) {
                    packet.search = this.searchInput;
                } 
                if (this.searchType != 0) {
                    if (filterResults.openAir) {
                        packet.openair = true;
                    }
                    if (filterResults.date != null && filterResults.date != 0) {
                        packet.datum = filterResults.date;
                    } 
                    if (filterResults.startTime != null && filterResults.startTime != 0){
                        if ((filterResults.startTime[0] != null && filterResults.startTime[0] != 0) || (filterResults.startTime[1] != null && filterResults.startTime[1] != 0)) {
                            packet.uhrzeit = filterResults.startTime;
                        } 
                    }
                    if (filterResults.duration != null && filterResults.duration != 0){
                        if ((filterResults.duration[0] != null && filterResults.duration[0] != 0) || (filterResults.duration[1] != null && filterResults.duration[1] != 0)) {
                            packet.dauer = filterResults.duration;
                        } 
                    }
                    if (filterResults.price != null && filterResults.price != 0){
                        if ((filterResults.price[0] != null && filterResults.price[0] != 0) || (filterResults.price[1] != null && filterResults.price[1] != 0)) {
                            packet.preis = filterResults.price;
                        } 
                    }
                    if (filterResults.capacity != null && filterResults.capacity != 0){
                        if ((filterResults.capacity[0] != null && filterResults.capacity[0] != 0) || (filterResults.capacity[1] != null && filterResults.capacity[1] != 0)) {
                            packet.kapazitaet = filterResults.capacity;
                        } 
                    }
                    if (filterResults.eventSize != null && filterResults.eventSize != 0) {
                        packet.eventgroesse = filterResults.eventSize;
                    } 
                    if (filterResults.region != null && filterResults.region != 0) {
                        packet.region = filterResults.region;
                    } 
                    if (filterResults.distance != null && filterResults.distance != 0) {
                        packet.distanz = filterResults.distance;
                    }
                    if (filterResults.rating != null && filterResults.rating != 0) {
                        packet.bewertung = filterResults.rating;
                    }
                    if (filterResults.category != null && filterResults.category != 0) {
                        packet.kategorie = filterResults.category;
                    }
                    if (filterResults.experience != null && filterResults.experience != 0) {
                        packet.erfahrung = filterResults.experience;
                    }
                    if (filterResults.ticketPrice != null && filterResults.ticketPrice != 0) {
                        packet.preis = filterResults.ticketPrice;
                    }
                    if (this.searchType === 5 || this.searchType === 8) {
                        if (filterResults.age != null && filterResults.age != 0) {
                            packet.alter = filterResults.age;
                        }
                    } else {
                        if (filterResults.age != null && filterResults.age != 0) {
                            packet.altersfreigabe = filterResults.age;
                        }
                    }
                    if (this.searchType == 6) {
                        packet.istbesitzer = true;
                    }
                    if (this.searchType == 7) {
                        packet.hatticket = true;
                    }
                    if (this.searchType == 8) {
                        packet.istfreund = true;
                    }
                    if (this.searchType == 9) {
                        packet.istbesitzer = true;
                    }
                }
                return packet;
            },
            searchSpecific(destination, field) {
                axios.post(destination, this.packageFilters(), { headers: { "auth": localStorage.getItem("authToken")}})
                    .then(response => {
                        console.log("Successful search:", response);
                        this.searchResults[field] = [];
                        this.searchResults.combined = this.searchResults.combined.filter(item => item.info.type != field);
                        this.searchResults[field] = response.data.rows;
                        if (field === "events") {
                            this.searchResults[field] = this.searchResults[field].filter(item => item.isvalid);
                        }
                        this.searchResults[field].forEach(result => {
                            result.type = field;
                            if (field === "tickets") {
                                result.type = "events";
                            }
                        });
                        this.hasSearchResults |= response.data.rows.length > 0;
                        if (this.searchType == 0) {
                            this.searchResults[field].forEach(item => {
                                switch (field) {
                                    case "person":
                                        this.searchResults.combined.push({
                                            "name": item.name,
                                            "line1": "Stadt: " + item.region,
                                            "line2": "Alter: " + item.alter,
                                            "line3": "",
                                            "buttonText": "Profil ansehen",
                                            "imagePath": item.profilbild,
                                            "isBookmarked": item.favorit ?? 0,
                                            "info": item,
                                            "buttonClickFunction": this.buttonClickFunctions.person,
                                            "titleClickFunction": this.titleClickFunctions.person,
                                            "key": item.id + field,
                                        });
                                        break
                                    case "location":
                                        this.searchResults.combined.push({
                                            "name": item.name,
                                            "line1": "Addresse: " + item.adresse,
                                            "line2": "Kapazität: " + item.kapazitaet,
                                            "line3": "Preis: " + item.preis,
                                            "buttonText": "Event erstellen",
                                            "imagePath": item.bild,
                                            "info": item,
                                            "buttonClickFunction": this.buttonClickFunctions.location,
                                            "titleClickFunction": this.titleClickFunctions.location,
                                            "key": item.id + field,
                                        });
                                        break
                                    case "artist":
                                    case "caterer":
                                        this.searchResults.combined.push({
                                            "name": item.name,
                                            "line1": "Stadt: " + item.adresse,
                                            "line2": "Kategorie: " + item.kategorie,
                                            "line3": "Preis: " + item.preis,
                                            "buttonText": "Event erstellen",
                                            "imagePath": item.profilbild,
                                            "info": item,
                                            "buttonClickFunction": field == "artist" ? this.buttonClickFunctions.artist : this.buttonClickFunctions.caterer,
                                            "titleClickFunction": field == "artist" ? this.titleClickFunctions.artist : this.titleClickFunctions.caterer,
                                            "key": item.id + field,
                                        });
                                        break
                                    case "events":
                                    case "tickets":
                                        this.searchResults.combined.push({
                                            "name": item.name,
                                            "line1": "Location: " + item.locationname,
                                            "line2": "Datum: " + new Date(item.datum).toDateString(),
                                            "line3": "Zeit: " + (item.startuhrzeit ?? "--:--") + "Uhr - " + (item.enduhrzeit ?? "--:--") + "Uhr",
                                            "buttonText": "Eventinfo",
                                            "imagePath": item.bild,
                                            "info": item,
                                            "buttonClickFunction": field == "events" ? this.buttonClickFunctions.event : this.buttonClickFunctions.ticket,
                                            "titleClickFunction": field == "events" ? this.titleClickFunctions.event : this.titleClickFunctions.ticket,
                                            "key": item.id + field,
                                        });
                                        break;

                                    default:
                                        break;
                                }
                            });
                        } 
                    })
                    .catch(error => {
                        console.error("Unsuccessful search:", error);
                        this.searchError = true;
                    });
            },
            search() {
                this.hideTooltip();
                this.hasSearchResults = false;
                this.searchError = false;
                switch (this.searchType) {
                    case "0":
                        this.searchSpecific("/searchLoacation", "location")
                        this.searchSpecific("/searchArtist", "artist")
                        this.searchSpecific("/searchCaterer", "caterer")
                        this.searchSpecific("/searchEvent", "events")
                        this.searchSpecific("/searchEndnutzer", "person")
                        break;
                    case "1":
                    case "9":
                        this.searchSpecific("/searchLoacation", "location")
                        break;
                    case "2":
                        this.searchSpecific("/searchArtist", "artist")
                        break;
                    case "3":
                        this.searchSpecific("/searchCaterer", "caterer")
                        break;
                    case "4":
                    case "6":
                        this.searchSpecific("/searchEvent", "events")
                        break;
                    case "5":
                    case "8":
                        this.searchSpecific("/searchEndnutzer", "person")
                        break;
                    case "7":
                        this.searchSpecific("/searchEvent", "tickets")
                        break;

                    default: break;
                }
                this.sortContent();
            },
            sortArrowClick() {
                this.sortAscending = !this.sortAscending;
                this.sortContent();
            },
            sortContent() {
                let sortType = this.sortType;
                if (sortType === "unsortiert") {
                    return;
                }
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
                    Object.keys(this.searchResults).forEach((sortable) => this.searchResults[sortable].sort((a, b) => sortCriteria(b, a)));
                }
                this.$forceUpdate();
            },
            toggleBookmark() {
                this.bookmarked = !this.bookmarked;
                this.search();
                // TODO: filter for bookmarked elements
            },
        },
        created() {
            this.buttonClickFunctions = {
                event: this.eventButtonFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
                caterer: this.catererButtonFunction ?? ((info) => { this.$router.push({path: "/createEvent", query: {caterer: info.id}}); }),
                location: this.locationButtonFunction ?? ((info) => { this.$router.push({path: "/createEvent", query: {location: info.id}}); }),
                artist: this.artistButtonFunction ?? ((info) => { this.$router.push({path: "/createEvent", query: {artist: info.id}}); }),
                ticket: this.ticketButtonFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
                person: this.personButtonFunction ?? ((info) => { this.$router.push("/person/" + info.app_user_id); }),
            };
            this.titleClickFunctions = {
                event: this.eventTitleFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
                caterer: this.catererTitleFunction ?? ((info) => { this.$router.push("/caterer/" + info.id); }),
                location: this.locationTitleFunction ?? ((info) => { this.$router.push("/location/" + info.id); }),
                artist: this.artistTitleFunction ?? ((info) => { this.$router.push("/dj/" + info.id); }),
                ticket: this.ticketTitleFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
                person: this.personTitleFunction ?? ((info) => { this.$router.push("/person/" + info.app_user_id); }),
            };
            this.buttonTexts = {
                event: this.eventButtonText ?? "Ticket buchen",
                caterer: this.catererButtonText ?? "Event erstellen",
                location: this.locationButtonText ?? "Event erstellen",
                artist: this.artistButtonText ?? "Event erstellen",
                ticket: this.ticketButtonText ?? "Eventinfo",
                person: this.personButtonText ?? "Freundschaftsanfrage",
            };
            this.appliedSearchTypes = this.allowedSearchTypes ?? ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            this.searchType = this.startValue ?? this.appliedSearchTypes[0];
            this.searchResults.combined = [];
            this.toggleSearchType();
        },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    }
    }
</script>

<style scoped>

.events-outside-div {
    margin-left: 45px;
    margin-top: 50px;
    background-color: var(--background);
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
    background-color: var(--slider-background-color);
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
      background-color: var(--cyan);
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
      display: flex;
      flex-direction: row-reverse;
      margin-left: 10%;
      width: 280px;
      height: 20px; /* Angepasst für flexible Höhe */
      border-radius: 5px;
      border: 1px solid #ccc;
      text-align: center;
  }

  ::v-deep .filter-rating > input {
      flex: 1 1 0%;
      display: grid;
      place-content: center;
      cursor: pointer;
      width: 20px; /* Angepasste Breite */
      height: 20px; /* Angepasste Höhe */
      appearance: none;
      margin-top: 0;
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
  }

  ::v-deep .filter-rating > input::before {
      content: "☆"; /* Leeres Stern-Emoji */
      font-size: 24px; /* Größe des Stern-Emojis */
      color: var(--light-gray, #ccc);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }

  ::v-deep .filter-rating > input:checked::before,
  ::v-deep .filter-rating > input:checked~input::before {
      content: "★"; /* Gefülltes Stern-Emoji */
      color: var(--yellow, gold);
  }

  ::v-deep .filter-rating > input::before {
      color: var(--light-gray, #666);
  }
  ::v-deep .filter-rating > input:checked::before,
  ::v-deep .filter-rating > input:checked~input::before {
      color: var(-yellow, gold);
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
      margin-right: 10px;
      width: 250px;
      height: 20px;
      border: 1px solid #ccc;
      text-align: center;
  }

  .filter-tooltip {
      display: none;
      position: absolute;
      top: 120%;
      transform: translateX(-1%);
      background-color: var(--textfield-background);
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      width: 555px;
      padding-left: 40px;
      color: var(--textfield-font-color);
  }

  #filter-tooltip-background {
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 0;
      background: none;
  }

  ::v-deep .filter-item {
      display: flex;
      justify-content: start; 
      align-items: center;
      margin-bottom: 8px; 
  }

  ::v-deep .filter-item input {
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  ::v-deep .filter-item input::placeholder {
      color: var(--placeholder-color);
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
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      font-weight: 600;
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

  #select_filter {
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
      background-color: var(--background);
      z-index: 1;
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
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
  }

  #searchbar {
      width: 510px;
      height: 30px;
      border: 0px;
      background-color: var(--background);
      color: var(--textfield-font-color);
      z-index: 1;
  }

  #searchbar:focus {
      outline: none;
  }

  #bookmark-arrow {
      display: grid;
      grid-template-columns: auto auto auto;
      justify-content: left;
      gap: 10px;
      background-color: var(--background);
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
      background-color: var(--textfield-background);
      color: var(--textfield-font-color);
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
      background-color: var(--background);
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
