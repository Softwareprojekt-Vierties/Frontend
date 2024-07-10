<template>
  <div id="app">
    <div id="header-component">
      <div id="logo-text">
        <img
          alt="Eventure Logo"
          id="logo"
          :src="isDarkMode ? require('../assets/dark_logo_test.png') : require('../assets/logo.png')"
        />
        <t1 id="headline">Eventure</t1>
      </div>
    </div>
    <div id="search">
      <input
        v-model="searchQuery"
        @keyup.enter="search"
        id="search-input"
        type="search"
        name="search"
        placeholder="Hier suchen..."
      />
      <div @click="search" class="search-button">
        <img
          alt="Magnifying Glass"
          id="magnifying-glass"
          v-if="isDarkMode"
          src="../assets/magnifying-glass.png"
        />
        <img
          alt="Magnifying Glass"
          id="magnifying-glass"
          v-else
          src="../assets/magnifying-glass.jpg"
        />
      </div>
    </div>
    <div id="mail-forms-container">
      <MailForm
      v-for="(mail, index) in filteredMails"
                :key="index"
                :name="mail.sendername"
                :auftrag="mail.anfragetyp"
                :imagePath = "mail.senderprofilbild"
                :isSelected="selectedMailId === mail.id"
                :gelesen ="mail.gelesen"
                :angenommen ="mail.angenommen" 
                @click="handleClickMail(mail)"
                @email-selected="updateFormattedText(mail)"/>
    </div>

    <div v-if="showPopup" id="popup-overlay" @click="closePopup">
      <div id="popup-content" @click.stop>
        <div id="popup-header">
          <div id="drag-header" @mousedown="startDrag" @touchstart.prevent="startDrag">
            <div id="drag-handle" @mousedown="startDrag" @touchstart.prevent="startDrag"></div>
          </div>
          <img id="mobile-close" src="../assets/mobile-close.png" @click="closePopup">
        </div>
        <div id="mail-text">
          <div id="headline-mail">Betreff: {{ mailHeadline }}</div>
          <div id="content">
            <!-- Hier den langen Text oder Inhalte hinzufügen, um den Scroll-Effekt zu sehen -->
            <pre v-html="formattedText"></pre>
          </div>
          <div id="buttons">
            <div id="reject-button" :class="{ disabled: selectedMailStatus !== null }"
            :style="{ cursor: selectedMailStatus !== null ? 'not-allowed' : 'pointer' }"
            @click="selectedMailStatus === null && ablehnen()">
            ablehnen
          </div>
            <div id="accept-button" :class="{ disabled: selectedMailStatus !== null }"
              :style="{ cursor: selectedMailStatus !== null ? 'not-allowed' : 'pointer' }"
              @click="selectedMailStatus === null && akzeptieren()">
            annehmen
            </div>

          </div>
        </div>
      </div>
    </div>
    <div id="home-button" v-if="menu">
        <img id="home-mobile" src="../assets/home-mobile.png" @click="goToHomePage" />
    </div>
    <div id="menu-button" @click="handleClick">
        <img id="menu-mobile" src="../assets/menu-mobile.png" />
    </div>
  </div>
</template>

<script>
import MailForm from '../components/MobileMailComponent.vue';
import axios from 'axios'; 


export default {
  components: {
    MailForm,
  },
  data() {
    return {
      menu: false,
      searchInput: '',
      showPopup: false,
      mailForms: new Array(11).fill(null), // Dummy array to simulate multiple mail forms
      isDarkMode: false, // Assuming you have a dark mode toggle
      startY: 0,
      initialHeight: 0,
      isDragging: false,
      mailHeadline: '',
      formattedText: '',
      mailList : [],
      searchQuery: '',
      mailId : '' ,
      selectedMailId: null,
      selectedMailStatus: null,
      showInnerContent : false ,
      angenommen: null
    };
  },
  methods: {

    goToHomePage(){
      this.$router.push('/search');
    }
    ,
    toggleTooltip() {
      this.updateTooltipWidth();
    },
    updateTooltipWidth() {
      const tooltip = document.getElementById("search-input");
      const searchbarAndIcons = document.getElementById("search");
      if (tooltip && searchbarAndIcons) {
        tooltip.style.width = `${searchbarAndIcons.offsetWidth - 50}px`;
      }
    },
    openPopup() {
      this.showPopup = true;
      this.$nextTick(() => {
        const popup = document.getElementById('popup-content');
        const mailText = document.getElementById('mail-text');
        popup.style.height = '200px'; // Initial height
        mailText.style.maxHeight = `${popup.offsetHeight - 60}px`; // Adjusting for padding and other elements
      });
    },
    closePopup() {
      this.showPopup = false;
    },
    startDrag(event) {
      this.isDragging = true;
      this.startY = event.clientY || event.touches[0].pageY;
      const popup = document.getElementById('popup-content');
      this.initialHeight = popup.offsetHeight;
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.endDrag);
      window.addEventListener('touchmove', this.onDrag);
      window.addEventListener('touchend', this.endDrag);
    },
    onDrag(event) { 
      if (!this.isDragging) return;
      const currentY = event.clientY || event.touches[0].pageY;
      const deltaY = this.startY - currentY;
      const newHeight = this.initialHeight + deltaY;
      const mailText = document.getElementById('mail-text');

      // Allow resizing down without checking scrollability
      if (newHeight < this.initialHeight) {
        if (newHeight > window.innerHeight * 0.2) {
          const popup = document.getElementById('popup-content');
          popup.style.height = `${newHeight}px`;
          mailText.style.maxHeight = `${newHeight - 60}px`; // Adjusting for padding and other elements
        }
      } else {
        // Only allow expanding when content is scrollable
        if (mailText.scrollHeight > mailText.clientHeight && newHeight > window.innerHeight * 0.2) {
          const popup = document.getElementById('popup-content');
          popup.style.height = `${newHeight}px`;
          mailText.style.maxHeight = `${newHeight - 60}px`; // Adjusting for padding and other elements
        }
      }
    },
    endDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.endDrag);
      window.removeEventListener('touchmove', this.onDrag);
      window.removeEventListener('touchend', this.endDrag);
    },
    search() {
      // Implement search functionality
    },
    handleClick() {
      if(this.menu) {
          this.menu = false;
      }
      else {
          this.menu = true;
      }
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
          empfaengername : details.empfaengername

         })
         this.mailList.sort((a,b) => b.id - a.id );
         console.log("maillist ->",this.mailList);
        });
    }, 
    updateText(newText, newHeadline) {
      this.formattedText = newText;
      this.mailHeadline = newHeadline;
    },
    async handleClickMail(mail){
      this.showPopup = true;
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

es liegt eine Anfrage des Events 
<b>${mail.eventname}</b> vor.
Wir würden gerne 
Ihre Location buchen.


<b>Infos:</b>
        <b>Location:</b> ${mail.locationname || 'N/A'}

        <b>Datum:</b> ${formattedDate}

        <b>Startzeit:</b> ${mail.startuhrzeit || 'N/A'}

        <b>enduhrzeit:</b> ${mail.enduhrzeit || 'N/A'}
        
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
    es liegt eine Freundschaftsanfrage 
    von <b>${mail.sendername}</b>  vor.

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

es liegt eine Anfrage des Events 
<b>${mail.eventname}</b> vor.
Wir würden gerne Ihre Dienstleistung 
buchen.


<b>Infos:</b>
        <b>Location:</b> ${mail.locationname || 'N/A'}

        <b>Datum:</b> ${formattedDate}

        <b>Startzeit:</b> ${mail.startuhrzeit || 'N/A'}

        <b>enduhrzeit:</b> ${mail.enduhrzeit || 'N/A'}

        <b>Eventgröße:</b> ${mail.locationkapazitaet || 'N/A'} Personen

        <b>Ticketpreis:</b> ${mail.ticketpreis || 'N/A'}

        <b>Altersfreigabe:</b> ${mail.altersfreigabe || 'N/A'}
        
        <b>Open Air:</b> ${mail.locationopenair ? 'Ja' : 'Nein'}


<b>Kontakt:</b> 
        <b>E-mail:</b> ${mail.senderemail || 'N/A'}
    `;
        }

        this.mailId = mail.id;
    }
  },
  async created() {
    window.addEventListener('resize', this.updateTooltipWidth);
    const token = localStorage.getItem('authToken');

    const response = await axios.get(`/getMails`,{ headers: {'auth': token }});
    console.log(response.data);
    this.setFormData(response.data);
  },
  mounted() {
    this.updateTooltipWidth();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTooltipWidth);
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
  }
};
</script>

<style scoped>
#logo-text {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: var(--background);
}

#logo {
  width: 50px;
}

#headline {
  font-size: 50px;
}

#headline-mail {
  font-size: 15px;
  text-align: left;
  font-weight: bold;
}

#content {
  border-radius: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(200, 200, 200);
  text-align: left;
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
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 30px;
  padding-left: 15px;
  padding-right: 10px;
  margin-bottom: 15px;
}

#search-input {
  height: 30px;
  border: 0;
  background-color: var(--background);
  color: var(--textfield-font-color);
}

#search-input:focus {
  outline: none;
}

#mail-forms-container {
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid rgb(200, 200, 200); /* Fügen Sie diese Zeile hinzu für eine untere Linie */
  padding-top: 10px;
  margin-left: 10px; /* Abstand links */
  margin-right: 10px; /* Abstand rechts */
}

#popup-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto; /* Adjusted to not cover the entire screen */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 20px;
}

#popup-content {
  width: 100%;
  max-width: 100%;
  background: white;
  padding: 20px;
  padding-top: 0px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: height 0s ease;
  z-index: 10; /* Ensure it stays above the overlay */
}

#popup-header {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: right;
}

#drag-header {
  display: grid;
  grid-template-columns: auto;
  align-items: center;
  justify-content: center;
  width: 90vw;
  height: 30px;
}

#drag-handle {
  width: 50px;
  height: 5px;
  background: gray;
  border-radius: 5px;
  margin: 0px auto 0px auto;
  cursor: pointer;
  margin-left: 30px;
}

#mobile-close {
  margin-top: 5px;
  margin-right: 0px;
}

#mail-text {
  max-height: 60vh; /* Adjust as needed */
  overflow-y: auto;
  padding: 10px;
}

#buttons {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

#reject-button {
  border: 1px solid black;
  width: 130px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--red);
}

#accept-button {
  border: 1px solid black;
  width: 130px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: var(--green);
}

#home-button {
    position: fixed;
    bottom: 70px; /* Abstand vom unteren Rand */
    right: 20px; /* Abstand vom rechten Rand */
    color: white; /* Button Textfarbe */
    border: none; /* Keine Rahmen */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 0, 0, 0.1); /* Schattierung */
    cursor: pointer; /* Zeiger ändern bei Hover */
    z-index: 1000; /* Sicherstellen, dass der Button über anderen Elementen liegt */
    border-radius: 30px;
    background-color: white;
}

#home-mobile {
    margin-bottom: -3px;
    width: 35px;
    height: 35px;
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
    background-color: white;
}

#menu-mobile {
    margin-bottom: -3px;
    width: 20px;
    height: 20px;
}

.disabled {
  background-color: grey !important;
  pointer-events: none;
}
</style>
