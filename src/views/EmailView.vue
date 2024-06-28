<template>
    <div id="header">
        <div id="icon-div">
            <img alt="Filer" class="icon" src="../assets/home.jpg">
        </div>
    </div>
        <div id="Eventure-Logo-Text">
            <img alt="Eventure Logo" id="logo" :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')">
            <t1 id="Überschrift">Eventure-Postfach</t1>
        </div>
    <div>

    </div>
</template>

<script>
</script>

<style scoped>
#icon-div {
    width: 40px;
    padding: 15px;
    padding-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    cursor: pointer;
    background-color: var(--textfield-background);
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
}

#Eventure-Logo-Text {
  display: grid;
  grid-template-columns: auto auto; /* Die Spaltenaufteilung wurde angepasst für bessere Darstellung */
  align-items: center; /* Zentriert die Elemente vertikal */
  justify-content: center; /* Zentriert die Elemente horizontal */
  gap: 20px; /* Fügt einen Abstand zwischen den Spalten hinzu */
  background-color: var(--background);
}

#logo {
  width: 80px; /* Bestimmt eine feste Breite für das Logo */
}

#Überschrift {
  font-size: 60px; /* Legt die Schriftgröße für die Überschrift fest */
    @media (prefers-color-scheme: dark) {
        color: #ddd; /* Dunkelgraue Textfarbe */
    }
    @media (prefers-color-scheme: light) {
        color: #333; /* Dunkelgraue Textfarbe */
    }
}
</style>