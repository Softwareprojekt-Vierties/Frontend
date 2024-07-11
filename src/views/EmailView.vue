<template>
  <div id="header">
      <HomeButton :isLoggedIn="true" />
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
                :isSelected="selectedMailId === mail.id"
                :gelesen ="mail.gelesen" 
                :angenommen ="mail.angenommen" 
                @click="handleClick(mail)"
                @email-selected="updateFormattedText(mail)"
              />
      </div>
    </div>
    <div id="right" >
      <div id="text-div">
        <label v-if="showInnerContent" id="mail-headline">{{ mailHeadline }}</label>
        <div id="text" v-if="showInnerContent">
          <pre id="formatted-text" v-html="formattedText"></pre>
        </div>
        <div id="buttons" v-if="showInnerContent">
          <div id="ablehnen"
            :class="{ disabled: selectedMailStatus !== null || buttonsDisabled }"
            :style="{ cursor: selectedMailStatus !== null || buttonsDisabled ? 'not-allowed' : 'pointer' }"
            @click="(selectedMailStatus === null && !buttonsDisabled) && ablehnen()">
            ablehnen
          </div>
          <div id="annehmen"
              :class="{ disabled: selectedMailStatus !== null || buttonsDisabled }"
              :style="{ cursor: selectedMailStatus !== null || buttonsDisabled ? 'not-allowed' : 'pointer' }"
              @click="(selectedMailStatus === null && !buttonsDisabled) && akzeptieren()">
            annehmen
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DishForm from '../components/MailComponent.vue';
import HomeButton from '../components/HomeButton.vue';
import axios from 'axios'; 

export default {
  components: {
    DishForm,
      HomeButton,
  },
  data() {
    return {
      mailHeadline: '',
      formattedText: '',
      mailList : [],
      searchQuery: '',
      mailId : '' ,
      selectedMailId: null,
      selectedMailStatus: null,
      showInnerContent : false,
      angenommen: null, 
      buttonsDisabled: false 

    };
  },

  async created(){
    //45, 56, 67
    //let id = 56; // id muss von eingeloggtem User sein
    console.log("hallo");
    const token = localStorage.getItem('authToken');
    console.log("hallo2");

    const response = await axios.get(`/getMails`,{ headers: {'auth': token }});
    console.log("hallo3");

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

    async handleClick(mail){
      this.showInnerContent = true;
      this.selectedMailId = mail.id; 
      this.selectedMailStatus = mail.angenommen;
      console.log("email gelesen",mail);
      const token = localStorage.getItem('authToken');

        if(mail.gelesen == false){
          await axios.post('/updateMail',{
            id : mail.id,
            gelesen : true,
            angenommen : mail.angenommen
          }, { headers: {'auth': token }});
          mail.gelesen = true;
        }

    },

    async akzeptieren(){

      const token = localStorage.getItem('authToken');
      const selectedMail = this.mailList.find(mail => mail.id === this.selectedMailId);

      if (selectedMail) {
        await axios.post('/updateMail', {
          id: selectedMail.id,
          gelesen: true,
          angenommen: true
        }, { headers: { 'auth': token } });

        selectedMail.angenommen = true;
        this.selectedMailStatus = true;
      }

    },

    
    async ablehnen(){

      const token = localStorage.getItem('authToken');
      const selectedMail = this.mailList.find(mail => mail.id === this.selectedMailId);

      if (selectedMail) {
        await axios.post('/updateMail', {
          id: selectedMail.id,
          gelesen: true,
          angenommen: false
        }, { headers: { 'auth': token } });

        selectedMail.angenommen = false;
        this.selectedMailStatus = false;
      }
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

        this.mailHeadline = mail.anfragetyp;
        if(mail.anfragetyp === "LOCATION"){
          this.formattedText = `
    Hallo ${mail.empfaengername},

    es liegt eine Anfrage des Events <b>${mail.eventname}</b> vor.
    Wir würden gerne Ihre Location buchen.


    <b>Infos:</b>
            <b>Location:</b> ${mail.locationname || 'N/A'}

            <b>Datum:</b> ${formattedDate}

            <b>Startzeit:</b> ${mail.startuhrzeit || 'N/A'}

            <b>Startzeit:</b> ${mail.enduhrzeit || 'N/A'}

            <b>Eventgröße:</b> ${mail.locationkapazitaet || 'N/A'} Personen

            <b>Ticketpreis:</b> ${mail.ticketpreis || 'N/A'}

            <b>Altersfreigabe:</b> ${mail.altersfreigabe || 'N/A'}
            
            <b>Open Air:</b> ${mail.locationopenair ? 'Ja' : 'Nein'}


    <b>Kontakt:</b> 
            <b>E-mail:</b> ${mail.senderemail || 'N/A'}
    `;
        } else if(mail.anfragetyp === "FREUNDSCHAFT"){
          this.formattedText = `
    Hallo ${mail.empfaengername},
    es liegt eine Freundschaftsanfrage von <b>${mail.sendername}</b>  vor.

<b>Kontakt:</b> 
            <b>E-mail:</b> ${mail.senderemail || 'N/A'}
    `;
        } else if(mail.anfragetyp === "INFO"){
          this.formattedText = `
    Hallo ${mail.empfaengername},

    dein Freund <b>${mail.sendername}</b> 
    hat das neue Event <b>${mail.eventname}</b> erstellt.

     <b>Infos:</b>
            <b>Location:</b> ${mail.locationname || 'N/A'}

            <b>Datum:</b> ${formattedDate}

            <b>Startzeit:</b> ${mail.startuhrzeit || 'N/A'}

            <b>Startzeit:</b> ${mail.enduhrzeit || 'N/A'}

            <b>Eventgröße:</b> ${mail.locationkapazitaet || 'N/A'} Personen

            <b>Ticketpreis:</b> ${mail.ticketpreis || 'N/A'}

            <b>Altersfreigabe:</b> ${mail.altersfreigabe || 'N/A'}
            
            <b>Open Air:</b> ${mail.locationopenair ? 'Ja' : 'Nein'}
    
    <b>Kontakt:</b> 
            <b>E-mail:</b> ${mail.senderemail || 'N/A'}
    `;
        } else if(mail.anfragetyp === "SERVICE"){
          this.formattedText = `
    Hallo ${mail.empfaengername},

    es liegt eine Anfrage des Events <b>${mail.eventname}</b> vor.
    Wir würden gerne Ihre Dienstleistung buchen.


    <b>Infos:</b>
            <b>Location:</b> ${mail.locationname || 'N/A'}

            <b>Datum:</b> ${formattedDate}

            <b>Startzeit:</b> ${mail.startuhrzeit || 'N/A'}

            <b>Startzeit:</b> ${mail.enduhrzeit || 'N/A'}
            
            <b>Eventgröße:</b> ${mail.locationkapazitaet || 'N/A'} Personen

            <b>Ticketpreis:</b> ${mail.ticketpreis || 'N/A'}

            <b>Altersfreigabe:</b> ${mail.altersfreigabe || 'N/A'}
            
            <b>Open Air:</b> ${mail.locationopenair ? 'Ja' : 'Nein'}


    <b>Kontakt:</b> 
            <b>E-mail:</b> ${mail.senderemail || 'N/A'}
    `;
        }
          else if(mail.anfragetyp === "TICKET"){
                    this.formattedText = `
    Hallo ${mail.empfaengername},

    danke für den Kauf eines Tickets 
    für das Event <b>${mail.eventname}</b>.

    Hier ist Ihr Code: <b>${mail.ticketdata}</b>`
  }
    this.buttonsDisabled = mail.anfragetyp === "INFO" || mail.anfragetyp === "TICKET";
    this.mailId = mail.id;
    },

    setFormData(data){
      data.rows.forEach(details => 
        {
            this.mailList.push({
                ticketpreis : details.ticketpreis,
                altersfreigabe : details.altersfreigabe,
                anfragetyp : details.anfragetyp.toUpperCase(),
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
                startuhrzeit : details.startuhrzeit,
                enduhrzeit : details.enduhrzeit,
                gelesen : details.gelesen,
                angenommen : details.angenommen,
                empfaengername : details.empfaengername,
                ticketdata : details.ticketdata

         })
         this.mailList.sort((a,b) => b.id - a.id );
         console.log("maillist ->",this.mailList);
        });
    }
  }
}
</script>

<style scoped>
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
    height: 681.78px;
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
    padding-top:0px;
    height: 555px; /* Passt diese Höhe nach Bedarf an */
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
    height: 600px; /* Passt diese Höhe nach Bedarf an */
    overflow-y: auto;
    border-radius: 7px;
    padding: 15px;
    width: 214px;
    
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
.disabled {
  background-color: grey !important;
  pointer-events: none;
}
</style>
