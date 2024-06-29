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
    <div id="mails">
        <div id="left">
            <div id="search">
                <div id="search-div">
                    <div id="search-field">
                        <input placeholder="suchen">
                        <img alt="Filer" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
                    </div>
                </div>
            </div>
            <div id="mails-info">
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <dish-form></dish-form>
                <!-- Weitere dish-form Komponenten falls benötigt -->
            </div>
        </div>
        <div id="right">
            <div id="text-div">
                <label id="mail-headline">Auftrag: Uni Party</label>
                <div id="text">
                    <pre id="formatted-text">
Hallo Herr Mustermann,

Es liegt eine Anfrage des Events UNI PARTY vor.


<strong>Infos:</strong>
        Location: Campus Minden

        Datum: 17.8.2024

        Zeit: 19 Uhr – 2Uhr

        Eventgröße: 50 Personen

        Preis: 10 €

        Altersfreigabe: 18+

        Open Air: Nein

<strong>Kontakt:</strong>
        E-Mail: petermueller@gmail.com
                    </pre>
                </div>
                <div id="buttons">
                    <div id="ablehnen">
                        ablehnen
                    </div>
                    <div id="annehmen">
                        annehmen
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DishForm from '../components/MailComponent.vue';

export default {
  components: {
    DishForm
  }
}
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
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
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

#mails {
    display: grid;
    grid-template-columns: auto auto;
    align-items: top;
    justify-content: center;
    gap: 20px;
    margin-top: 50px;
}

#right {
    width: 1200px;
}

#search-div {
    padding: 5px;
    border: 1px solid black;
    border-radius: 7px;
    margin-bottom: 10px;
}

#search-field {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 5px;
}

#magnifying-glass {
    width: 20px;
    margin: 2px;
    margin-right: 5px;
}

#text-div {
    border: 1px solid black;
    padding: 20px;
    border-radius: 7px;
    padding-bottom: 10px;
}

#text {
    border: 1px solid black;
    padding: 20px;
    height: 525px; /* Passt diese Höhe nach Bedarf an */
    overflow-y: auto;
    border-radius: 10px;
    display: flex;
    text-align: left;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#buttons {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

#ablehnen {
    border: 1px solid black;
    width: 125px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    background-color: var(--red);
}

#annehmen {
    border: 1px solid black;
    width: 125px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    background-color: var(--green);
}

#mails-info {
    border: 1px solid black;
    max-height: 600px; /* Passt diese Höhe nach Bedarf an */
    overflow-y: auto;
    border-radius: 7px;
    padding: 10px;
}

#mail-headline {
    display: block;
    text-align: left;
    font-weight: bold;
    margin-bottom: 10px;
}

#buttons {
    display: flex;
    justify-content: right;
}

input {
    border: none;
    outline: none;
    padding-left: 10px;
    margin-right: -190px
}

#formatted-text {
    white-space: pre-wrap; /* Behandelt Leerzeichen und Zeilenumbrüche */
            font-family: Arial, sans-serif; /* Legt die Schriftart fest */
            font-size: 16px; /* Legt die Schriftgröße fest */
}
</style>
