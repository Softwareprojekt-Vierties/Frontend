<template>
    <div id="wrapper">
  <div id="image">
    <LoginComponent />
  </div>

  <div id="content">
  <div>
    <input v-model="benutzername" class="textFeld" type="text" placeholder=" Benutzername" name="benutzername" />
  </div>

  <div>
    <input v-model="email" class="textFeld" type="email" placeholder=" E-Mail" name="email" />
  </div>

  <div>
    <input v-model="password" class="textFeld" type="password" placeholder=" Password" name="password" />
  </div>
  </div>

  <div> 
    <button @click="zuruck" class="abbrechen">abbrechen</button>
    <button @click="isFormValid" class="weiter">weiter</button>
  </div>
  <div id="policy-note">
    <p>By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.</p>
  </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent'; 
import axios from 'axios';

export default {
  name: 'SignupPage', 
  components: {
    LoginComponent 
  },
  data() {
    return {
      email: '',
      password: '',
      benutzername: ''
    };
  },
  methods: {
    zuruck() {
      this.$router.push('/');
    },
    isFormValid() {
      const emailValid = this.email;
      const passwordValid = this.password.length > 0;
      const benutzernameValid = this.benutzername.length > 0;

      if (emailValid && passwordValid && benutzernameValid) {
        axios.post('/register', {
          email: this.email,
          pass: this.password,
          name: this.benutzername
        })
        .then(response => {
          console.log('Konto erfolgreich erstellt:', response);
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Fehler beim Login:', error.response.data.message);
          alert(`Login fehlgeschlagen: ${error.response.data.message}`);
        });
      } else {
        alert('Bitte füllen Sie alle Felder korrekt aus.');
        console.log("asdad")
      }
    }
  }
};
</script>

<style scoped>
@import "../css/loginSignupPages.css"
</style>
