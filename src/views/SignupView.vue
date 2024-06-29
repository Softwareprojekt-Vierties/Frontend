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
#wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
}

#image {
    margin-top: 100px;
    margin-bottom: 100px;
    width: 100%;
}

.textFeld {
    width: 240px;
    height: 25px;
    border: 2px solid var(--border-color);
    border-radius: 20px;
    margin-bottom: 40px;
    font-size: 13px;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.1);
    outline: none;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    padding-left: 10px;
}

.textFeld::placeholder {
    color: var(--placeholder-color);
}

.weiter {
    margin-left: 15px;
    width: 110px;
    height: 30px;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    background-color: var(--green);
    color: var(--simple-font-color);
    cursor: pointer;
    transition: background-color 0.3s;
}

.weiter:disabled {
    color: #aaaaaa;
}

.kontoAnlegen {
    margin-right: 15px;
    width: 110px;
    height: 30px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background-color: var(--blue);
    color: var(--simple-font-color);
    cursor: pointer;
}

.abbrechen {
  margin-right: 15px;
  width: 110px;
  height: 30px;
  border: 1px solid var(--border-color); 
  border-radius: 20px; 
  background-color: var(--red);
  color: var(--simple-font-color);
  cursor: pointer; 
}

#policy-note {
    justify-content: center;
    margin-top: auto;
    height: fit-content;
}

#policy-note p {
    margin: 0;
    padding: 0;
}
</style>
