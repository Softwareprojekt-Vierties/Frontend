<template>
  <div class="image">
    <LoginComponent />
  </div>

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
  <div>
    <p>By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.</p>
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
.image {
  margin-top: 100px;
  margin-bottom: 100px;
}

.textFeld {
  width: 240px;
  height: 25px;
  border: 2px solid #cccccc;
  border-radius: 20px;
  margin-bottom: 40px;
  font-size: 13px;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
  outline: none;
}

.buttonBox {
  margin-bottom: 220px;
}

.weiter {
  margin-left: 15px;
  width: 110px;
  height: 30px;
  border-radius: 20px;
  border: 1px solid #ecf5ec;
  background-color: #1fda29;
  cursor: pointer;
  transition: background-color 0.3s;
}

.kontoAnlegen {
  margin-right: 15px;
  width: 110px;
  height: 30px;
  border: 1px solid #ecf5ec;
  border-radius: 20px;
  background-color: #9543f9;
  cursor: pointer;
}
</style>