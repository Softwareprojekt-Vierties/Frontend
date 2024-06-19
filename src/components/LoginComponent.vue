<template>
  <div id="Eventure-Logo-Text">
      <img alt="Eventure Logo" id="logo" :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')">
    <t1 id="Überschrift">Eventure</t1>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  props: {
    msg: String
  },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    },
}
</script>


<style scoped>
#Eventure-Logo-Text {
  display: grid;
  grid-template-columns: auto auto; /* Die Spaltenaufteilung wurde angepasst für bessere Darstellung */
  align-items: center; /* Zentriert die Elemente vertikal */
  justify-content: center; /* Zentriert die Elemente horizontal */
  gap: 20px; /* Fügt einen Abstand zwischen den Spalten hinzu */
}

.logo {
  width: 100px; /* Bestimmt eine feste Breite für das Logo */
}

#Überschrift {
  font-size: 80px; /* Legt die Schriftgröße für die Überschrift fest */
    @media (prefers-color-scheme: dark) {
        color: #ddd; /* Dunkelgraue Textfarbe */
    }
    @media (prefers-color-scheme: light) {
        color: #333; /* Dunkelgraue Textfarbe */
    }
}
</style>
