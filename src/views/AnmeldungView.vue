<template>
    <div class="wrapper">
  <div class="image">
    <LoginComponent />
  </div>

  <div class="content">
  <div>
   <input v-model="benutzername" class="textFeld" type="text" placeholder="Email" name="benutzername" />
  </div>
  <div>
   <input v-model="password" class="textFeld" type="password" placeholder="Password" name="password" />
  </div>

  <div class="buttonBox"> 
    <button @click="goToSignup" class="kontoAnlegen">Konto anlegen</button>
    <button @click="login" class="weiter" :disabled="!isFormValid">weiter</button>
  </div>
  </div>
  <div id="policy-note">
    <p>By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.</p>
  </div>
  </div>
</template>

<script>
import axios from 'axios'; 
import LoginComponent from '@/components/LoginComponent';

export default {
  name: 'LoginPage', 
  components: {
    LoginComponent 
  },
  data() {
    return {
      benutzername: '',
      password: '',
    };
  }, 
  computed: {
    isFormValid() {
      const passwordValid = this.password.length > 0;
      const benutzernameValid = this.benutzername.length > 0;
      return passwordValid && benutzernameValid;
    }
  },
  methods: {
    goToSignup() {
      this.$router.push('/signup');
    },

    async login() {
      if (!this.isFormValid) {
        alert('Bitte füllen Sie beide Felder aus.');
        return;
      }
      try {
        const response = await axios.post('/login', {
          email: this.benutzername,
          pass: this.password
        });
        console.log('Login erfolgreich:', response);
        
        // Speichere das Token im Local Storage
        localStorage.setItem('authToken', response.data);
        this.$router.push('/search');
      } catch (error) {
        console.error('Fehler beim Login:', error.response ? error.response.data.message : error.message);
        alert(`Login fehlgeschlagen: ${error.response ? error.response.data.message : error.message}`);
      }
    },
    
    fetchData() {
      // Hole den Token aus dem Local Storage
      const token = localStorage.getItem('authToken');

      // Füge den Token zu den HTTP-Headern hinzu
      axios.get('/MyPage', {
        headers: {
          'auth': token
        }
      })
      .then(response => {
        console.log('Daten erfolgreich abgerufen:', response.data);
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Daten:', error);
      });
    }
  },
};
</script>

<style scoped>
@import "../css/loginSignupPages.css"
</style>
