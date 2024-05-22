<template>
  <div id="Eventure-Logo-Text">
    <img alt="Eventure Logo" id="logo" src="../assets/logo.png">
    <t1 id="Überschrift">Eventure</t1>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  props: {
    msg: String
  }
}
</script>


<style scoped>
#Eventure-Logo-Text {
  display: grid;
  grid-template-columns: auto auto; /* Die Spaltenaufteilung wurde angepasst für bessere Darstellung */
  align-items: center; /* Zentriert die Elemente vertikal */
  justify-content: center; /* Zentriert die Elemente horizontal */
  gap: 20px; /* Fügt einen Abstand zwischen den Spalten hinzu */
  margin-top: 200px;
}

.logo {
  width: 100px; /* Bestimmt eine feste Breite für das Logo */
}

#Überschrift {
  font-size: 80px; /* Legt die Schriftgröße für die Überschrift fest */
  color: #333; /* Dunkelgraue Textfarbe */
}
</style>