<template>
    <div class ="image">
      <LoginComponent />
    </div>

    <div>
      <button class="buttonPerson">Privatperson</button>
    </div>

    <div>
      <button class="buttonDienst">Dienstleister</button>
    </div>

    <div>
      <p>By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.
      </p>
    </div>

</template>

<script>
import LoginComponent from '@/components/LoginComponent'; 

export default {
  name: 'LoginPage', 
  components: {
    LoginComponent 
  }
}
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

  .image{
    margin-top: 100px;
    margin-bottom: 150px;
  }

  .buttonPerson{

    width: 240px;
    height: 30px;
    margin-bottom: 40px;
    border-radius: 20px; 
    border: 1px solid var(--dark-border-color); 
    cursor: pointer; 
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
  }

  .buttonDienst{
    width: 240px;
    height: 30px;
    margin-bottom: 200px;
    border-radius: 20px;
    border: 1px solid var(--dark-border-color); 
    cursor: pointer; 
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
  }

</style>
