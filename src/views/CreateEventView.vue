<template>
    <div id="app">
        <div id="header">
            <div id="icon-div" @click="goToHomePage">
                <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
                <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
            </div>

            <div id="picture-name">
                <div id="file-div" :style="fileDivStyle">
                    <div id="file-upload">
                        <label id="image-text" for="fileToUpload">
                            <img v-if="!imagePreview && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
                            <img v-else-if="!imagePreview" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
                            <span id="upload-text" v-if="!imagePreview">Bild hochladen</span>
                        </label>
                        <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChange">
                    </div>
                </div>

                <div id="name-description">
                    <div class="name-description-input">
                        <label class="description">Eventnamen hinzufügen:</label>
                        <input class="header-input" v-model="eventName" type="text" placeholder="z.B. UNI PARTY"><br>
                    </div>
                    <div class="name-description-input">
                        <label class="description">Kurze Beschreibung hinzufügen:</label>
                        <input class="header-input" v-model="shortDescription" type="text" placeholder="z.B. Minden">
                    </div>
                </div>
            </div>
        </div>

        <div id="main">
            <div id="left-side">
                <div class="long-description">
                    <label class="description">Beschreibung hinzufügen:</label>
                    <textarea id="long-description-input" v-model="longDescription" type="text" placeholder="Hier einfügen…"></textarea>
                </div>
                <br>
                <div class="long-description">
                    <label class="description">Dienstleister hinzufügen:</label>
                    <div id="addcreator" ref="addCreator" class="scroll-container">
                        <div class="dish-container">
                            <div v-for="(serviceProvider, index) in serviceProvider" :key="index" class="dish-item">
                                <EventCard v-if="(serviceProvider?.name ?? '') != ''" :label="serviceProvider?.name" :imagePath="serviceProvider?.details?.profilbild" @click="openModalService(index)" @remove="removeProvider(index)" />
                                <dish-form v-else @click="openModalService(index)" @remove="removeProvider(index)"></dish-form>
                            </div>
                            <div class="add-dish-button" @click="addProvider">
                                <img v-if="isDarkMode" src="../assets/addlocation.png" alt="Bild hochladen" id="add-icon" />
                                <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="right-side">
                <div id="right-side-info">
                    <label id="info-headline">Infos hinzufügen:</label>
                    <div class="infos">
                        <label class="info-subheadline">Location:</label>
                        <div>
                            <div id="add-location" @click="openModalLocation">
                                <div v-if="!location">
                                    <img v-if=isDarkMode src="../assets/addlocation.png" alt="Bild hochladen" id="add-location-icon" />
                                    <img v-else src="../assets/addlocation.jpg" alt="Bild hochladen" id="add-location-icon" />
                                </div>
                                <div v-else>
                                    <EventCard :label="location?.name" :imagePath="location?.bild" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="infos">
                        <label class="info-subheadline">Datum:</label>
                        <input class="input" v-model="eventDate" type="text" placeholder="z.B. 17.08.2024">
                    </div>
                    <div class="infos">
                        <label class="info-subheadline">Zeit:</label>
                        <div class="time">
                            <input class="time-value-left" v-model="eventStartTime" placeholder="z.B. 17Uhr"> - 
                            <input class="time-value-right" v-model="eventEndTime" placeholder="z.B. 20Uhr">
                        </div>
                    </div>
                    <div class="infos">
                        <label class="info-subheadline">Eventgröße:</label>
                        <input class="input" v-model="eventSize" type="text" placeholder="z.B. 50 Personen">
                    </div>
                    <div class="infos">
                        <label class="info-subheadline">Preis:</label>
                        <input class="input" v-model="price" type="text" placeholder="z.B. 50€">
                    </div>
                    <div class="infos">
                        <label class="info-subheadline">Alter:</label>
                        <input class="input" v-model="ageLimit" type="text" placeholder="z.B. 18 Jahre">
                    </div>
                    <div id="open-air">
                        <label class="info-subheadline">Open Air:</label>
                        <label class="switch">
                            <input type="checkbox" v-model="openAir">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div id="buttons">
                    <div id="break" @click="resetForm">
                        abbrechen  
                    </div>
                    <div id="continue" @click="openModal">
                        anlegen
                    </div>
                </div>
            </div>
        </div>

        <!-- Integrated PopupModal functionality -->
        <div v-if="isModalVisible" id="modal-overlay">
            <div id="modal-content">
                <div id="headline">
                    <label>Privatsphäre-Einstellung</label>
                </div>
                <div id="event-buttons">
                    <div id="event-button" @click="selectEventType('private')" :class="{ 'selected': selectedEventType === 'private' }">privates Event</div>
                    <div id="event-button" @click="selectEventType('public')" :class="{ 'selected': selectedEventType === 'public' }">öffentliches Event</div>
                </div>
                <div id="action-buttons">
                    <button id="cancel-button" @click="closeModal">abbrechen</button>
                    <button class="create-button" @click="createEvent">Jetzt erstellen</button>
                </div>
            </div>
        </div>

        <div v-if = "isLocationModalVisible" id ="modal-overlay">
            <div id="modal-content-location">
                <div id="headline">
                    <label>Location Auswählen</label>
                </div>
                <!--  Auflistung der Events--> 
                <div class="event-div" v-if="searchLocation">
                    <SearchComponent :mutable="false" startValue="1" locationButtonText="Zum Event hinzufügen" :locationButtonFunction="setTmpLocationId" :locationTitleFunction="(info) => {}"/>
                </div>
                <div class="event-div" v-else>
                    <SearchComponent :allowedSearchTypes="['2', '3']" artistButtonText="Zum Event hinzufügen" catererButtonText="Zum Event hinzufügen" :artistButtonFunction="setCurrentProvider" :catererButtonFunction="setCurrentProvider" :locationTitleFunction="(info) => {}"/>
                </div>
                <div id="action-buttons">
                    <button id="cancel-button" @click="closeModalLocation">abbrechen</button>
                    <button v-if="searchLocation" class="create-button" @click="selectLocation" >Location auswählen</button>
                    <button v-else class="create-button" @click="selectService" >Service auswählen</button>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import axios from 'axios';
    import SearchComponent from '../components/SearchComponent.vue';
    import DishForm from '../components/ArtistComponent.vue';
    import EventCard from '../components/EventComponenet.vue';

    export default {
        components: {
            DishForm,
            EventCard,
            SearchComponent
        },
        data() {
            return {
                eventName: '',
                shortDescription: '',
                longDescription: '',
                eventImage: null,
                imagePreview: null, 
                eventDate: '',
                eventStartTime: '',
                eventEndTime: '',
                eventSize: '',
                price: '',
                ageLimit: '',
                openAir: false,
                serviceProvider: [], // { name: '', ingredients: [] }
                isModalVisible: false,
                isLocationModalVisible : false,
                selectedEventType: null,
                location: null,
                tmpLocation: null,
                searchLocation: true,
                currentProviderIndex: -1,
                currentProvider: {},
            };
        },
        computed: {
            fileDivStyle() {
                return this.imagePreview ? { backgroundImage: `url(${this.imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
            },
            isDarkMode() {
                return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
            }
        },
        methods: {
            onFileChange(event) {
                const file = event.target.files[0];
                if (file) {
                    this.eventImage = file;
                    const reader = new FileReader();
                    reader.onload = e => {
                        this.imagePreview = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            },
            addProvider() {
                this.serviceProvider.push({ name: '', details: [] });
                this.$nextTick(() => {
                    const container = this.$refs.addCreator;
                    container.scrollLeft = container.scrollWidth - container.clientWidth;
                });
            },
            removeProvider(index) {
                this.serviceProvider.splice(index, 1);
            },
            openModal() {
                this.isModalVisible = true;
            },
            closeModal() {
                this.isModalVisible = false;
            },
            openModalLocation() {
                this.searchLocation = true;
                this.isLocationModalVisible = true;
            },
            openModalService(index) {
                this.currentProviderIndex = index;
                this.searchLocation = false;
                this.isLocationModalVisible = true;
            },
            closeModalLocation() {
                this.isLocationModalVisible = false;
                this.currentProviderIndex = -1;
                this.currentProvider = null;
                this.tmpLocation = null;
            },
            selectEventType(type) { 
                this.selectedEventType = type;
            },
            resetForm() {
                this.eventName = '';
                this.shortDescription = '';
                this.longDescription = '';
                this.eventImage = null;
                this.imagePreview = null; 
                this.eventDate = '';
                this.eventStartTime = '';
                this.eventEndTime = '';
                this.eventSize = '';
                this.price = '';
                this.ageLimit = '';
                this.openAir = false;
                this.serviceProviders = []; // { name: '', ingredients: [] }
                this.selectedEventType= null; 
            },
            async createEvent() {
                if (!this.eventName || !this.shortDescription || !this.longDescription || !this.eventDate || !this.eventStartTime 
                    || !this.eventEndTime || !this.eventSize || !this.price || !this.ageLimit
                    || !this.selectedEventType || !this.location) {
                    alert('Please fill in all required fields.');
                    return;
                }

                let formData = {};
                formData.name = this.eventName;
                formData.kurzbeschreibung = this.shortDescription;
                formData.beschreibung = this.longDescription;
                formData.datum = this.eventDate;
                formData.startuhrzeit = this.eventStartTime;
                formData.enduhrzeit = this.eventEndTime;
                formData.eventgroesse = this.eventSize;
                formData.preis = this.price;
                formData.altersfreigabe = this.ageLimit;
                formData.openair = this.openAir;
                formData.privat = this.selectedEventType === "private"; 
                formData.locationid = this.location.id;
                if (this.imagePreview) {
                    formData.bild = this.imagePreview;
                }

                formData.serviceProviders = this.serviceProvider;

                const token = localStorage.getItem('authToken');

                try {
                    const response = await axios.post('/createEvent', formData, {
                        headers: {
                            "auth": token,
                        }
                    });
                    console.log('Event created:', response.data);
                    this.closeModal(); 
                } catch (error) {
                    console.error('Error with Event creation:', error);
                }
            },
            goToHomePage() {
                this.$router.push('/search');
            },
            setTmpLocationId(info) {
                this.tmpLocation = info;
            },
            setCurrentProvider(info) {
                this.currentProvider = { name: "",  details: [] };
                for (const key in info) {
                    if (key == "name") {
                        this.currentProvider.name = info.name;
                    } else {
                        this.currentProvider.details[key] = info[key];
                    }
                }
            },
            selectLocation() {
                this.location = this.tmpLocation;
                this.closeModalLocation();
            },
            selectService() {
                this.serviceProvider[this.currentProviderIndex] = this.currentProvider;
                this.closeModalLocation();
                console.log(this.serviceProvider);
            },
        },
    }
</script>

<style scoped>
@import "../css/createPages.css"
</style>
