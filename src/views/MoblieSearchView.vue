<template>
    <div id="app">
        <div id="login-component">
            <div id="Eventure-Logo-Text">
                <img alt="Eventure Logo" id="logo" :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')">
                <t1 id="Überschrift">Eventure</t1>
            </div>
        </div>
        <SearchComponent/>
    </div>
</template>

<script>
    import SearchComponent from "@/components/MobileSearchComponent";

    export default {
        components: {
            SearchComponent,
        },
        data() {
            return {};
        },
        methods: {
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
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    }
    };
</script>

<style scoped>

#Eventure-Logo-Text {
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

#Überschrift {
  font-size: 50px; /* Legt die Schriftgröße für die Überschrift fest */
    @media (prefers-color-scheme: dark) {
        color: #ddd; /* Dunkelgraue Textfarbe */
    }
    @media (prefers-color-scheme: light) {
        color: #333; /* Dunkelgraue Textfarbe */
    }
}

#app {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
}

  #login-component {
      margin-top: 50px;
  }

</style>

