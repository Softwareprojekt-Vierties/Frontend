<template>
  <div class="leftUpIcons">
    <AccountIcon />
    <MailIcon />
  </div>
  <div id="RightUpButton">
    <button id="ButtonErstellen">Event erstellen</button>
  </div>
  <div class="image">
    <LoginComponent />
  </div>

  <div id="formLayout">
    <select id="filterOptions">
      <option value="1">Location</option>
      <option value="2">DJ/Band</option>
      <option value="3">Caterer</option>
      <option value="4">Event</option>
      <option value="5">Person</option>
      <option value="6">Meine Events</option>
      <option value="7">Meine Tickets</option>
      <option value="8">Meine Freunde</option>
      <option value="9">Meine Locations</option>
    </select>

    <input class="searchBar" type="search" name="seach" placeholder="Hier suchen... "/>

  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent';
import AccountIcon from '@/components/AccountIconComponent';
import MailIcon from '@/components/MailIconComponent';

export default {
  components: {
    LoginComponent,
    AccountIcon,
    MailIcon,
  },
};
</script>

<style scoped>

#filterOptions{
  box-shadow: 1px 1px 5px rgba(0,0,0,0.1); 
  border: 1.5px solid #989b98; 
  cursor: pointer; 
  width:90px;
  height:30px;
  border-radius: 45px;
}

#formLayout {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 5fr;
  gap: 10px;
  color: grey;
  left: 330px;
  top: 50px;
  width: 650px;
  height: 40px;
  border-radius: 20px;
}



.searchBar {
  border-radius: 20px;
  width: 100%;
  height: 30px;
  border: 1.0px solid #cccccc;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  padding-left: 30px; /* Adjust padding to accommodate icon */
  position: relative; /* Make the searchBar position relative */
}



.leftUpIcons {
  position: absolute;
  display: flex;
  width: 150px;
  top: 40px;
  left: 25px;
  justify-content: space-around;
}

#RightUpButton {
  position: absolute;
  display: flex;
  width: 140px;
  top: 48px;
  right: 70px;
}

#ButtonErstellen {
  border-radius: 12px;
  width: 130px;
  height: 30px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  border: 1.5px solid #989b98;
  cursor: pointer;
}
</style>
