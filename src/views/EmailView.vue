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
              <input placeholder="suchen" v-model="searchQuery">
              <img alt="Filer" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
            </div>
          </div>
        </div>
        <div id="mails-info">
          <DishForm
                  v-for="(mail, index) in filteredMails"
                  :key="index"
                  :name="mail.sendername"
                  :auftrag="mail.anfragetyp"
                  :imagePath = "mail.senderprofilbild"
                  @email-selected="updateFormattedText(mail)"
                />
        </div>
      </div>
      <div id="right">
        <div id="text-div">
          <label id="mail-headline">{{ mailHeadline }}</label>
          <div id="text">
            <pre id="formatted-text">
              {{ formattedText }}
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
  import axios from 'axios'; 
  
  export default {
    components: {
      DishForm
    },
    data() {
      return {
        mailHeadline: '',
        formattedText: '',
        mailList : [],
        searchQuery: '' 
      };
    },

    async created(){

      let id = 45; // id muss von eingeloggtem User sein
      const response = await axios.get(`/getMails/${id}`);
      console.log(response.data);
      this.setFormData(response.data);

    },

    computed: {
    filteredMails() {
            if (!this.searchQuery) {
                return this.mailList;
            }
            const query = this.searchQuery.toLowerCase();
            return this.mailList.filter(mail => {
                return (
                    mail.sendername.toLowerCase().includes(query) ||
                    mail.anfragetyp.toLowerCase().includes(query)
                );
            });
        }
    },

    methods: {
      updateText(newText, newHeadline) {
        this.formattedText = newText;
        this.mailHeadline = newHeadline;
      }, 
      updateFormattedText(mail) {
          const formatDate = (dateString) => {
              if (!dateString) return 'N/A';
              const date = new Date(dateString);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
          };

          const formattedDate = formatDate(mail.datum);

          this.mailHeadline = mail.eventname;
          this.formattedText = `
          Hallo Herr Mustermann,
          es liegt eine Anfrage des Events ${mail.eventname} vor.

          

          Infos:

              Location: ${mail.locationname || 'N/A'}
              Datum: ${formattedDate}
              Zeit: ${mail.uhrzeit || 'N/A'}
              Eventgröße: ${mail.locationkapazitaet || 'N/A'} Personen
              Preis: ${mail.preis || 'N/A'}
              Altersfreigabe: ${mail.altersfreigabe || 'N/A'}
              Open Air: ${mail.locationopenair ? 'Ja' : 'Nein'}


          Kontakt: 

              ${mail.senderemail || 'N/A'}
          `;
      },

      setFormData(data){
        data.rows.forEach(details => 
          {
            this.mailList.push({
            anfragetyp : details.anfragetyp,
            datum : details.datum,
            dauer : details.dauer,
            eventname : details.eventname,
            id : details.id,
            locationadresse : details.locationadresse,
            locationflaeche : details.locationflaeche,
            locationkapazitaet : details.locationkapazitaet,
            locationname : details.locationname,
            locationopenair : details.locationopenair,
            senderemail : details.senderemail,
            sendername : details.sendername,
            senderprofilbild : details.senderprofilbild,
            uhrzeit : details.uhrzeit

           })
           console.log("maillist ->",this.mailList);
          });
      }
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
      gap: 15px;
      margin-top: 50px;
  }
  
  #right {
      width: 1200px;
  }
  
  #search-div {
      padding: 6px;
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
      height: 650px;
  }
  
  #text {
      border: 1px solid black;
      padding: 20px;
      height: 535px; /* Passt diese Höhe nach Bedarf an */
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
      padding: 15px;
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
      margin-right: -200px
  }
  
  #formatted-text {
      white-space: pre-wrap; /* Behandelt Leerzeichen und Zeilenumbrüche */
      font-family: Arial, sans-serif; /* Legt die Schriftart fest */
      font-size: 16px; /* Legt die Schriftgröße fest */
  }
  </style>
  