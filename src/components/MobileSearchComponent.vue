<template>
    <div id="filter-tooltip-background" @click="toggleTooltip"></div>
    <div id="main_div">
        <div id="select-filter-searchbar">
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
                <input v-model="searchInput" @keyup.enter="search" id="searchbar" type="search" name="search" placeholder="Hier suchen..." />
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
                <div class="select-sort left" @change="sortContent">
                    <img v-if="isDarkMode" src="../assets/setting.png" @click="openSelect"/>
                    <img v-else src="../assets/setting.jpg" @click="openSelect"/>
                    <div class="sort-text" @click="openSelect">Sortiert nach: {{ getDynamicPart(sortType) }}</div>
                    <select ref="mySelect" v-model="sortType" id="option" @change="sortContent">
                        <option v-for="option in sortingOptions[searchType]['filters']" :value="option" v-bind:key="option" :disabled="option === 'unsortiert'">{{translations[option]}}</option>
                    </select>
                </div>
                <div id="right-sort">
                    <div class="select-sort right">
                        <div @click="sortArrowClick" class="sort-text">{{ order }}</div>
                        <div class="bookmark-arrow-div">
                            <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-if="sortAscending && isDarkMode" src="../assets/arrow-up-dark.png" />
                            <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else-if="isDarkMode" src="../assets/arrow-down-dark.png" />
                            <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else-if="sortAscending" src="../assets/arrow-up.jpg" />
                            <img alt="Normal Arrow" id="normal-arrow" @click="sortArrowClick" v-else src="../assets/normal-arrow.jpg" />
                        </div>
                    </div>
                    <div class="select-sort right">
                        <div @click="toggleBookmark" class="sort-text">Lesezeichen:</div>
                        <div @click="toggleBookmark" class="bookmark-arrow-div">
                            <img v-if="bookmarked && isDarkMode" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-filled.png" />
                            <img v-else-if="isDarkMode" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-empty.png" />
                            <img v-else-if="bookmarked" alt="Bookmark Black" id="bookmark-white" src="../assets/bookmark-gray.jpg" />
                            <img v-else alt="Bookmark White" id="bookmark-white" src="../assets/bookmark-white.jpg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div v-if="hasSearchResults">
                <div v-if="searchType==0" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.combined : searchResults.combined" :name="result.name" :line1="result.line1" :line2="result.line2" :line3="result.line3" :buttonText="result.buttonText" :imagePath="result.imagePath" :isBookmarked="result.isBookmarked" :buttonClickFunction="result.buttonClickFunction" :titleClickFunction="result.titleClickFunction" :info="result.info" :key="result.key"/>
                </div>
                <div v-else-if="searchType == 4 || searchType == 6" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.events : searchResults.events" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.startuhrzeit ?? '--:--'}Uhr - ${result.enduhrzeit ?? '--:--'}Uhr`" :buttonText="buttonTexts.event" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.event" :titleClickFunction="titleClickFunctions.event" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 1 || searchType == 9" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.location : searchResults.location" :name="result.name" :line1="`Addresse: ${result.adresse}`" :line2="`Kapazität: ${result.kapazitaet}`" :line3="`Preis: ${result.preis}`" :buttonText="buttonTexts.location" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.location" :titleClickFunction="titleClickFunctions.location" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 2" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.artist : searchResults.artist" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.kategorie}`" :line3="`Preis: ${result.preis}€/h`" :buttonText="buttonTexts.artist" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.artist" :titleClickFunction="titleClickFunctions.artist" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 3" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.caterer : searchResults.caterer" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Kategorie: ${result.kategorie}`" :line3="`Preis: ${result.preis}€/h`" :buttonText="buttonTexts.caterer" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.caterer" :titleClickFunction="titleClickFunctions.caterer" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 5 || searchType == 8" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.person : searchResults.person" :name="result.name" :line1="`Stadt: ${result.region}`" :line2="`Alter: ${result.alter}`" :line3="`Geschlecht: ${(result?.geschlecht ?? 'male') == 'male' ? 'Männlich' : 'Weiblich'}`" :buttonText="buttonTexts.person" :imagePath="result.profilbild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.person" :titleClickFunction="titleClickFunctions.person" :info="result" :key="result.id"/>
                </div>
                <div v-else-if="searchType == 7" id="results">
                    <CardComponent v-for="result in bookmarked ? filteredSearchResults.tickets : searchResults.tickets" :name="result.name" :line1="`Location: ${result.locationname}`" :line2="`Datum: ${new Date(result.datum).toDateString()}`" :line3="`Zeit: ${result.uhrzeit?.[0] ?? '--:--'}Uhr - ${result.uhrzeit?.[1] ?? '-'}Uhr`" :buttonText="buttonTexts.ticket" :imagePath="result.bild" :isBookmarked="result.favorit ?? 0" :buttonClickFunction="buttonClickFunctions.ticket" :titleClickFunction="titleClickFunctions.ticket" :info="result" :key="result.id"/>
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
        <div id="newevent-button" v-if="menu">
            <img v-if="isDarkMode" id="newevent-mobile" src="../assets/menu-mobile-dark.png" />
            <img v-else id="newevent-mobile" src="../assets/newevent-mobile.png" />
        </div>
        <div id="email-button" v-if="menu">
            <img v-if="isDarkMode" id="email-mobile" src="../assets/email-mobile-dark.png" />
            <img v-else id="email-mobile" src="../assets/email-mobile.png" />
        </div>
        <div id="profile-button" v-if="menu">
            <img v-if="isDarkMode" id="profile-mobile" src="../assets/profile-icon-dark.png" />
            <img v-else id="profile-mobile" src="../assets/profile-mobile.png" />
        </div>
        <div id="menu-button" @click="handleClick">
            <img v-if="isDarkMode" id="menu-mobile" src="../assets/menu-mobile-dark.png" />
            <img v-else id="menu-mobile" src="../assets/menu-mobile.png" />
        </div>
    </div>
</template>

<script>
import CardComponent from "@/components/MobileCardComponent";
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
            menu: false,
            order:"Absteigend:",
            filterContent: "",
            filterSelection: "",
            selectedFilters: [],
            filterOptions: {
                '1': { name: 'location', filters: ['region', 'distance', 'capacity', 'rating', 'openAir', 'price'] },
                '2': { name: 'djBand', filters: ['region', 'distance', 'category', 'rating', 'experience', 'price'] },
                '3': { name: 'caterer', filters: ['region', 'distance', 'category', 'rating', 'experience', 'price'] },
                '4': { name: 'event', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                '5': { name: 'person', filters: ['region', 'age', 'gender'] },
                '6': { name: 'myEvents', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                '7': { name: 'myTickets', filters: ['region', 'eventSize', 'ticketPrice', 'distance', 'age', 'date', 'startTime', 'duration', 'openAir'] },
                '8': { name: 'myFriends', filters: ['region', 'age', 'gender'] },
                '9': { name: 'myLocation', filters: ['region', 'distance', 'capacity', 'rating', 'openAir', 'price'] },
            },
            sortingOptions: {
                "0": { name: "none", filters: ["unsortiert", "name"] },
                "1": { name: "location", filters: ["unsortiert", "name", "adresse", "entfernung", "kapazitaet", "sterne", "preis"] },
                "2": { name: "djBand", filters: ["unsortiert", "name", "adresse", "entfernung", "kategorie", "sterne", "experience", "preis"] },
                "3": { name: "caterer", filters: ["unsortiert", "name", "adresse", "entfernung", "kategorie", "sterne", "experience", "preis"] },
                "4": { name: "event", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                "5": { name: "person", filters: ["unsortiert", "name", "adresse", "altersfreigabe", "gender"] },
                "6": { name: "myEvents", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                "7": { name: "myTickets", filters: ["unsortiert", "name", "adresse", "eventgroesse", "preis", "entfernung", "altersfreigabe", "datum", "uhrzeit", "dauer"] },
                "8": { name: "myFriends", filters: ["unsortiert", "name", "adresse", "altersfreigabe", "gender"] },
                "9": { name: "myLocation", filters: ["unsortiert", "name", "adresse", "entfernung", "kapazitaet", "sterne", "preis"] },
            },
            translations: {
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
                gender: "Geschlecht",
                eventgroesse: "Eventgröße",
                preis: "Preis",
            },
            searchInput: "",
            searchType: "0",
            sortType: "unsortiert",
            searchResults: [],
            filteredSearchResults: [],
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
        handleClick() {
            if(this.menu) {
                this.menu = false;
            }
            else {
                this.menu = true;
            }
        },
        toggleTooltip() {
            const tooltip = document.getElementById("dynamic-tooltip");
            tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
            this.updateTooltipWidth();
            if (tooltip.style.display === "block") {
                this.adjustFilter();
            }
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
                            return `<div class="filter-item"><div id="filter-item-text">Region: </div><input id="filter-region" class="filter" type="text" placeholder="z.B. 32427 Minden"></div>`;
                        case "date":
                            return `<div class="filter-item"><div id="filter-item-text">Datum: </div><input id="filter-date" class="filter" type="date" placeholder="z.B. 17.08.2024"></div>`;
                        case "distance":
                            return `<div class="filter-item"><div id="filter-item-text">Entfernung: </div><input id="filter-distance" type="range" value="100" min="0" max="100" oninput="rangeValue.innerText = this.value + (this.value == 100 ? 'Km+' : 'Km')"><p id="rangeValue">100Km+</p></div>`;
                        case "capacity":
                            return `<div class="filter-item"><div id="filter-item-text">Kapazität: </div><div id="kapazitaet" class="two-filter-div"> <input id="first-capacity" class="two-filter-div-param filter-capacity" type="number" min="0" placeholder="10 Personen"> - <input id="second-capacity" class="two-filter-div-param filter-capacity" type="number" min="0" placeholder="50 Personen"> </div></div>`;
                        case "rating":
                            return `<div class="filter-item"><div id="filter-item-text">Bewertung: </div><fieldset class="filter-rating" ><input type="radio" name="rating" title="star5" value="5" /><input type="radio" name="rating" title="star4" value="4" /><input type="radio" name="rating" title="star3" /><input type="radio" name="rating" title="star2" value="2" /><input type="radio" name="rating" title="star1" value="1" checked /></input></fieldset></div>`;
                        case "startTime":
                            return `<div class="filter-item"><div id="filter-item-text">Startzeit: </div><div class="two-filter-div time"> <input class="two-filter-div-param filter-time" type="time"> - <input class="two-filter-div-param filter-time" type="time"> </div></div>`;
                        case "duration":
                            return `<div class="filter-item"><div id="filter-item-text">Dauer: </div><div class="two-filter-div duration"> <input class="two-filter-div-param filter-duration" type="number" min="0" placeholder="5 Stunden"> - <input class="two-filter-div-param filter-duration" type="number" min="0" placeholder="7 Stunden"> </div></div>`;
                        case "openAir":
                            return `<div class="filter-item"><div id="filter-item-text">Open Air: </div><label class="switch"> <input type="checkbox"> <span class="slider round"> </span> </label> </div>`;
                        case "price":
                            return `<div class="filter-item"><div id="filter-item-text">Preis: </div><div class="two-filter-div price"> <input class="two-filter-div-param filter-price" type="number" min="0" placeholder="50 €"> - <input class="two-filter-div-param filter-price" type="number" min="0" placeholder="500 €"> </div> </div>`;
                        case "category":
                            return `<div class="filter-item"><div id="filter-item-text">Kategorie: </div><input id="filter-category" class="filter" type="text" placeholder="Kategorie"></div>`;
                        case "experience":
                            return `<div class="filter-item"><div id="filter-item-text">Erfahrung: </div><input id="filter-experience" class="filter" type="number" min="0" placeholder="10 Jahren"></div>`;
                        case "eventSize":
                            return `<div class="filter-item"><div id="filter-item-text">Eventgröße: </div><input id="filter-event-size" class="filter" type="number" min="0" placeholder="Nr. Personen"></div>`;
                        case "ticketPrice":
                            return `<div class="filter-item"><div id="filter-item-text">Ticketpreis: </div><input id="filter-ticket-price" class="filter" type="number" min="0" placeholder="Ticketpreis"></div>`;
                        case "age":
                            return `<div class="filter-item"><div id="filter-item-text">Alter: </div><input id="filter-age" class="filter" type="number" min="0" placeholder="Alter"></div>`;
                        case "gender":
                            return `<div class="filter-item"><div id="filter-item-text">Geschlecht: </div><select class="filter-gender filter"><option value="male">Männlich</option><option value="female">Weiblich</option></select></div>`;
                        default:
                            return "";
                    }
                })
                .join("");
        },
        updateTooltipWidth() {
            const tooltip = this.$refs.filterContainer;
            const searchbarAndIcons = document.getElementById("searchbar-and-icons");
            if (tooltip && searchbarAndIcons) {
                tooltip.style.width = `${searchbarAndIcons.offsetWidth-35}px`;
            }
        },
        adjustFilter() {
            const tooltip = this.$refs.filterContainer;
            const filter = tooltip.querySelectorAll('.filter');
            const filter_item_text = tooltip.querySelectorAll('#filter-item-text')
            const filter_distance = tooltip.querySelectorAll('#filter-distance')
            const rangeValue = tooltip.querySelectorAll('#rangeValue')
            const filter_capacity = tooltip.querySelectorAll('.two-filter-div-param')
            const capacity = tooltip.querySelectorAll('.two-filter-div')
            const filter_switch = tooltip.querySelectorAll('.switch')
            const filter_rating_input = tooltip.querySelectorAll('.filter-rating > input')
            const filter_rating = tooltip.querySelectorAll('.filter-rating')

            filter.forEach(filter => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter.style.height = `${tooltipWidth * 0.065}px`; // 10% der Tooltip-Höhe
                    filter.style.fontSize = `${tooltipWidth * 0.05}px`; // 5% der Tooltip-Höhe
                    filter.style.width = `${tooltipWidth * 0.5}px`; // 80% der Tooltip-Breite
                }
                else {
                    filter.style.height = `${19.5}px`;
                    filter.style.fontSize = `${15}px`;
                    filter.style.width = `${tooltipWidth * 0.6}px`;
                }
            });

            filter_distance.forEach(region => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    region.style.height = `${tooltipWidth * 0.065}px`; // 10% der Tooltip-Höhe
                    region.style.fontSize = `${tooltipWidth * 0.05}px`; // 5% der Tooltip-Höhe
                    region.style.width = `${tooltipWidth * 0.35}px`; // 80% der Tooltip-Breite
                }
                else {
                    region.style.height = `${19.5}px`;
                    region.style.fontSize = `${15}px`;
                    region.style.width = `${(tooltipWidth * 0.6) - 35}px`;
                }
            });

            rangeValue.forEach(rangeValue => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    rangeValue.style.fontSize = `${tooltipWidth * 0.05}px`; // 5% der Tooltip-Höhe
                }
                else {
                    rangeValue.style.fontSize = `${10}px`;
                }
            });

            filter_capacity.forEach(filter_capacity => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter_capacity.style.height = `${tooltipWidth * 0.065}px`; // 10% der Tooltip-Höhe
                    filter_capacity.style.fontSize = `${tooltipWidth * 0.035}px`; // 5% der Tooltip-Höhe
                    filter_capacity.style.width = `${tooltipWidth * 0.2}px`; // 80% der Tooltip-Breite
                }
                else {
                    filter_capacity.style.height = `${19.5}px`;
                    filter_capacity.style.fontSize = `${15}px`;
                    filter_capacity.style.width = `${tooltipWidth * 0.25}px`;
                }
            });

            capacity.forEach(capacity => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    capacity.style.gap = `${tooltipWidth * 0.05 - 5}px`;
                }
                else {
                    capacity.style.gap = `${tooltipWidth * 0.05 - 5}px`;
                }
            })

            filter_switch.forEach(filter_switch => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter_switch.style.marginLeft = `${tooltipWidth * 0.25 - 15}px`; // 80% der Tooltip-Breite
                }
                else {
                    filter_switch.style.marginLeft = `${tooltipWidth * 0.3 - 15}px`;
                }
            });

            filter_rating_input.forEach(filter_rating_input => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter_rating_input.style.margin = `${tooltipWidth * 0.02}px`; // 80% der Tooltip-Breite
                    filter_rating_input.style.width = `${tooltipWidth * 0.05}px`;
                }
                else {
                    filter_rating_input.style.margin = `${tooltipWidth * 0.02}px`; // 80% der Tooltip-Breite
                    filter_rating_input.style.width = `${tooltipWidth * 0.05}px`;
                }
            });

            filter_rating.forEach(filter_rating => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter_rating.style.marginLeft = `${tooltipWidth * 0.0}px`; // 80% der Tooltip-Breite
                }
                else {
                    filter_rating.style.marginLeft = `${tooltipWidth * 0.06}px`; // 80% der Tooltip-Breite
                    filter_rating.style.fontSize = `${20}px`;
                }
            });

            filter_item_text.forEach(filter_item_text => {
                const tooltipWidth = tooltip.offsetWidth;
                if(tooltipWidth < 300) {
                    filter_item_text.style.fontSize = `${tooltipWidth * 0.05}px`; // 5% der Tooltip-Höhe
                    filter_item_text.style.width = `${tooltipWidth * 0.3}px`; // 5% der Tooltip-Höhe
                }
                else {
                    filter_item_text.style.fontSize = `${15}px`;
                    filter_item_text.style.width = `${tooltipWidth * 0.3}px`;
                }
            });
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
                        filterValues.region = filtersContainer.querySelector("#filter-region")?.value ?? "";
                        break;
                    case "date":
                        filterValues.date = filtersContainer.querySelector("#filter-date")?.value ?? "";
                        break;
                    case "distance":
                        filterValues.distance = filtersContainer.querySelector("#filter-distance")?.value ?? "";
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
                            filtersContainer.querySelectorAll(".filter-price")[0]?.value ?? "",
                            filtersContainer.querySelectorAll(".filter-price")[1]?.value ?? "",
                        ];
                        break;
                    case "category":
                        filterValues.category = filtersContainer.querySelector("#filter-category")?.value ?? "";
                        break;
                    case "experience":
                        filterValues.experience = filtersContainer.querySelector("#filter-experience")?.value ?? "";
                        break;
                    case "eventSize":
                        filterValues.eventSize = filtersContainer.querySelector("#filter-event-size")?.value ?? "";
                        break;
                    case "ticketPrice":
                        filterValues.ticketPrice = filtersContainer.querySelector("#filter-ticket-price")?.value ?? "";
                        break;
                    case "age":
                        filterValues.age = filtersContainer.querySelector("#filter-age")?.value ?? "";
                        break;
                    case "gender":
                        filterValues.gender = filtersContainer.querySelector(".filter-gender")?.value ?? "";
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
                if (filterResults.gender != null && filterResults.gender != 0) {
                    packet.geschlecht = filterResults.gender;
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
                    this.searchResults[field] = response.data.rows;
                    this.searchResults[field].forEach(result => {
                        result.type = field;
                    });
                    this.filteredSearchResults[field] = response.data.rows.filter(item => item.favorit == true);
                    this.hasSearchResults |= response.data.rows.length > 0;
                    if (this.searchType == 0) {
                        this.searchResults[field].forEach(item => {
                            switch (field) {
                                case "person":
                                    this.searchResults.combined.push({
                                        "name": item.name,
                                        "line1": "Stadt: " + item.region,
                                        "line2": "Alter: " + item.alter,
                                        "line3": "Geschlecht: " + item?.geschlecht ?? "male" == "male" ? "Männlich" : "Weiblich",
                                        "buttonText": "Freundschftsanfrage",
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
                                        "isBookmarked": item.favorit ?? 0,
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
                                        "isBookmarked": item.favorit ?? 0,
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
                                        "buttonText": field == "events" ? "Ticket buchen" : "Eventinfo",
                                        "imagePath": item.bild,
                                        "isBookmarked": item.favorit ?? 0,
                                        "info": item,
                                        "buttonClickFunction": field == "events" ? this.buttonClickFunctions.event : this.buttonClickFunctions.ticket,
                                        "titleClickFunction": field == "events" ? this.titleClickFunctions.event : this.titleClickFunctions.ticket,
                                        "key": item.id + field,
                                    });
                                    break;

                                default:
                                    break;
                            }
                        })
                        this.filteredSearchResults.combined = this.searchResults.combined.filter(item => item.isBookmarked);
                    } 
                })
                .catch(error => {
                    console.error("Unsuccessful search:", error);
                    this.searchError = true;
                });
        },
        search() {
            this.hideTooltip();
            this.searchResults = []
            this.filteredSearchResults = []
            this.searchResults.combined = []
            this.filteredSearchResults.combined = []
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
        },
        sortArrowClick() {
            this.sortAscending = !this.sortAscending;
            this.sortContent();
            if (this.order === "Aufsteigend:") {
                this.order = "Absteigend:"
                return;
            }
            this.order = "Aufsteigend:";
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
                Object.keys(this.searchResults).forEach((key) => {
                    if (Array.isArray(this.searchResults[key])) {
                        this.searchResults[key].sort((a, b) => sortCriteria(a, b));
                    }
                });
            } else {
                Object.keys(this.searchResults).forEach((key) => {
                    if (Array.isArray(this.searchResults[key])) {
                        this.searchResults[key].sort((a, b) => -sortCriteria(a, b));
                    }
                });
            }
            this.$forceUpdate();
        },
        toggleBookmark() {
            this.bookmarked = !this.bookmarked;
            // TODO: filter for bookmarked elements
        },
        openSelect() {
            const selectElement = this.$refs.mySelect;
            selectElement.focus();
            selectElement.click();
        },
        getDynamicPart(option) {
            return option ? this.translations[option] : '';
        }
    },
    watch: {
        filterContent() {
            this.$nextTick(this.adjustFilter);
        }
    },
    created() {
        this.buttonClickFunctions = {
            event: this.eventButtonFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
            caterer: this.catererButtonFunction ?? (() => { this.$router.push("/createEvent"); }),
            location: this.locationButtonFunction ?? (() => { this.$router.push("/createEvent"); }),
            artist: this.artistButtonFunction ?? (() => { this.$router.push("/createEvent"); }),
            ticket: this.ticketButtonFunction ?? ((info) => { this.$router.push("/event/" + info.id); }),
            person: this.personButtonFunction ?? ((info) => { this.$router.push("/person/" + info.ap_user_id); }),
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
        this.toggleSearchType();
        window.addEventListener('resize', this.updateTooltipWidth);
    },
    mounted() {
        this.updateTooltipWidth();
        this.adjustFilter(); // Beim Initialisieren der Komponente
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateTooltipWidth);
    },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    }
}
</script>

<style scoped>
/* eslint-disable */
.events-outside-div {
    align-items: center;
    margin-top: 30px;
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
    margin-left: 34%;
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

::v-deep #filter-region {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-gender {
    width: 305px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep #filter-experience {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep .filter-openair {
    margin-left: 20px;
}

::v-deep #filter-age {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep #filter-event-size {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep #filter-ticket-price {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep #filter-category {
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

::v-deep #filter-date {
    width: 300px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
}

::v-deep #filter-distance {
    display: inline-grid;
    grid-template-columns: auto auto auto;
    grid-columns: 1;
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
    z-index: 1;
    background-color: var(--textfield-background);
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    width: 555px;
    padding-left: 15px;
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

::v-deep #filter-item-text {
    width: 100px;
    text-align: start;
}


::v-deep #kapazitaet {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .time {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .duration {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .price {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

::v-deep .filter-rating {
    display: flex;
    flex-direction: row-reverse;
    width: auto; /* Angepasst für flexible Breite */
    height: auto; /* Angepasst für flexible Höhe */
    border-radius: 5px;
    border: 1px solid rgb(255, 255, 255);
    text-align: center;
}

::v-deep .filter-rating > input {
    flex: 1 1 0%;
    display: grid;
    place-content: center;
    cursor: pointer;
    margin: 5px; /* Abstand zwischen den Radio-Buttons */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    position: relative;
    font-size: 30px; /* Größe des Stern-Emojis */
}

::v-deep .filter-rating > input::before {
    content: "☆"; /* Leeres Stern-Emoji */
    color: var(--empty-star-color, #ccc);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

::v-deep .filter-rating > input:checked::before,
::v-deep .filter-rating > input:checked~input::before {
    content: "★"; /* Gefülltes Stern-Emoji */
    color: var(--filled-star-color, gold);
}

@media (prefers-color-scheme: dark) {
    ::v-deep .filter-rating > input::before {
        color: var(--empty-star-color-dark, #666);
    }
    ::v-deep .filter-rating > input:checked::before,
    ::v-deep .filter-rating > input:checked~input::before {
        color: var(--filled-star-color-dark, gold);
    }
}

@media (prefers-color-scheme: light) {
    ::v-deep .filter-rating > input::before {
        color: var(--empty-star-color-light, #ccc);
    }
    ::v-deep .filter-rating > input:checked::before,
    ::v-deep .filter-rating > input:checked~input::before {
        color: var(--filled-star-color-light, gold);
    }
}

.rangeValue {
    text-align: center;
}

#filter {
    cursor: pointer;
    width: 25px;
}

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

#select-filter-searchbar {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    width: 95%;
    margin-left: 2.5%;
}

#select_filter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: auto;
}

#searchbar-and-icons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 20px;
    border: 1px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    height: 35px;
    padding-left: 7px;
    padding-right: 5px;
    background-color: var(--background);
    flex-grow: 1;
}

.options {
    border-radius: 20px;
    border: 1px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    width: 80px;
    height: 37px;
    text-align: center;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    
}

#option {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
}

.select-sort {
    position: relative;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: left;
    font-size: 10px;
}

.left {
    justify-content: flex-start;
}

.right {
    justify-content: flex-end;
}

option {
    font-size: small;
}

.sort-text {
    margin-right: 5px;
    cursor: pointer;
}

#searchbar {
    width: 100%;
    height: 30px;
    border: 0;
    background-color: var(--background);
    color: var(--textfield-font-color);
}

#searchbar:focus {
    outline: none;
}

#right-sort {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    gap: 10px;
}

#bookmark-arrow {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    gap: 10px;
    background-color: var(--background);
    margin-left: 10px;
    margin-right: 10px;
    border-bottom: 1px solid rgb(200, 200, 200);
}

.bookmark-arrow-div {
}

#bookmark-white {
    width: 13px;
    height: 25px;
}

#normal-arrow {
    width: 15px;
    height: 25px;
}

.searchButton {
    display: inline-flex;
    border: none;
    background-color: var(--background);
}

#results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 0px));
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    padding-top: 0;
    margin-top: 20px;
}

#newevent-button {
    position: fixed;
    bottom: 170px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    padding: 7.5px;
    background-color: var(--textfield-background);
}

#newevent-mobile {
    margin-bottom: -3px;
    width: 20px;
    height: 20px;
}

#email-button {
    position: fixed;
    bottom: 120px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    padding: 2.5px;
    background-color: var(--textfield-background);
}

#email-mobile {
    margin-bottom: -3px;
    width: 30px;
    height: 30px;
}

#profile-button {
    position: fixed;
    bottom: 70px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    padding: 2.5px;
    background-color: var(--textfield-background);
}

#profile-mobile {
    margin-bottom: -3px;
    width: 30px;
    height: 30px;
}

#menu-button {
    position: fixed;
    bottom: 20px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    padding: 7.5px;
    background-color: var(--textfield-background);
}

#menu-mobile {
    margin-bottom: -3px;
    width: 20px;
    height: 20px;
}
</style>
