<template>
    <div id="header">
        <div id="profile-mail">
            <div class = "icon-div">
                <img alt="Filer" class="icon" src="../assets/profile-icon.png">
            </div>
            <div class = "icon-div">
                <img alt="Filer" class="icon" src="../assets/mail-icon.png">
            </div>
        </div>
        <div id= "new-event">
            <button id="new-event-button">Event erstellen</button>
        </div>
    </div>

    <div id="login-component">
        <LoginComponent />
    </div>
    
    <div id="selct-filter-searchbar">
        <div id="select-filter">
            <select class="options">
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
        </div>
    
        <div id="searchbar-and-icons">
            <div>
                <img alt="Filer" id="filter" src="../assets/filter.jpg">
            </div>
            <div>
                <input id="searchbar" type="search" name="seach" placeholder="Hier suchen... "/>
            </div>
            <div>
                <img alt="Magnifying Glass" id="magnifying-glass" src="../assets/magnifying-glass.jpg">
            </div>
        </div>
    </div>
    
    <div id="bookmark-arrow">
        <div class="bookmark-arrow-div">
            <img alt="Bookmark White" id="bookmark-white" src="../assets/bookmark-white.jpg">
        </div>
        <div id="select-sort">
            <select class="options">
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
        </div>
        <div class="bookmark-arrow-div">
            <img alt="Normal Arrow" id="normal-arrow" src="../assets/normal-arrow.jpg">
            </div>
    </div>
</template>


<script>
import LoginComponent from '@/components/LoginComponent';

export default {
  components: {
    LoginComponent
  },
};
</script>


<style scoped>
#header{
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
}

.icon-div{
    padding: 15px;
    padding-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    cursor: pointer; 
}

.icon{
    width: 35px;
    height: 35px;
    cursor: pointer; 
}

#new-event-button{
    border-radius: 5px;
    width: 160px;
    height: 42.5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    border: 1px solid #000000; 
    cursor: pointer; 
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    font-weight: 600;
    margin-right: 100px;
}

#profile-mail{
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-left: 50px;
}

#login-component{
    margin-top: 150px;
}

#selct-filter-searchbar{
    margin-top: 100px;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-right: 100px;
    margin-right: 0px;
}

#select-filter{
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: end;
}

#searchbar-and-icons{
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: left;
    gap: 10px;

    border-radius: 20px;
    border: 1.0px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    height: 35px;
    width: 600px;
    padding-left: 10px;
}

.options{
    border-radius: 20px;
    border: 1.0px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer; 
    width: 130px;
    height: 35px;
    border-radius: 45px;
    text-align: center;
}

#searchbar{
    width: 510px;
    height: 30px;
    border: 0px;
}

#searchbar:focus{
    outline: none;
}

#bookmark-arrow{
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: left;
    gap: 10px;
    margin-top: 100px;
    margin-left: 30px;
}

.bookmark-arrow-div{
    border-radius: 20px;
    border: 1.0px solid #cccccc;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer; 
    width: 40px;
    height: 35px;
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: center;
}

#bookmark-white{
    width: 15px;
    height: 30px;
}

#normal-arrow{
    width: 20px;
    height: 30px;
}
</style>