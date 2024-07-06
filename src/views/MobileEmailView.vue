<template>
    <div id="app">
        <div id="header-component">
            <div id="logo-text">
                <img alt="Eventure Logo" id="logo" :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')">
                <t1 id="headline">Eventure</t1>
            </div>
        </div>
        <div id="search">
            <input v-model="searchInput" @keyup.enter="search" id="search-input" type="search" name="search" placeholder="Hier suchen..." />
            <div @click="search" class="search-button">
                <img alt="Magnifying Glass" id="magnifying-glass" v-if="isDarkMode" src="../assets/magnifying-glass.png">
                <img alt="Magnifying Glass" id="magnifying-glass" v-else src="../assets/magnifying-glass.jpg">
            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    components: {
    },
    data() {
        return {
        };
    },
    methods: {
        toggleTooltip() {
            this.updateTooltipWidth();
        },
        updateTooltipWidth() {
            const tooltip = document.getElementById("search-input");
            const searchbarAndIcons = document.getElementById("search");
            if (tooltip && searchbarAndIcons) {
                tooltip.style.width = `${searchbarAndIcons.offsetWidth-50}px`;
            }
        },
    },
    created() {
        window.addEventListener('resize', this.updateTooltipWidth);
    },
    mounted() {
        this.updateTooltipWidth();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateTooltipWidth);
    },
}
</script>
  
<style scoped>

#logo-text {
  display: grid;
  grid-template-columns: auto auto; /* Die Spaltenaufteilung wurde angepasst für bessere Darstellung */
  align-items: center; /* Zentriert die Elemente vertikal */
  justify-content: center; /* Zentriert die Elemente horizontal */
  gap: 10px; /* Fügt einen Abstand zwischen den Spalten hinzu */
  background-color: var(--background);
}

#logo {
  width: 50px; /* Bestimmt eine feste Breite für das Logo */
}

#headline {
  font-size: 50px; /* Legt die Schriftgröße für die Überschrift fest */
}

#app {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
}

#header-component {
    margin-top: 50px;
}

#search {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    border-radius: 20px;
    border: 1px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    height: 35px;
    background-color: var(--background);
    margin-left: 30px;
    margin-right: 30px;
    margin-top: 30px;
    padding-left: 15px;
    padding-right: 10px;
}

#search-input {
    height: 30px;
    border: 0;
    background-color: var(--background);
    color: var(--textfield-font-color);
}
</style>