<template>
    <div id="app">
        <div id="header">
            <div id="profile-mail">
                <div class="icon-div">
                    <img @click="gotoProfilePage" alt="Dein Profil" class="icon" v-if="isDarkMode" src="../assets/profile-icon-dark.png" />
                    <img @click="gotoProfilePage" alt="Dein Profil" class="icon" v-else src="../assets/profile-icon.png" />
                </div>
                <div class="icon-div">
                    <img @click="gotoMailPage" alt="Dein Postfach" class="icon" v-if="isDarkMode" src="../assets/mail-icon-dark.png" />
                    <img @click="gotoMailPage" alt="Dein Postfach" class="icon" v-else src="../assets/mail-icon.png" />
                </div>
            </div>
            <div id="new-event">
                <button @click="gotoEventCreation" id="new-event-button">Event erstellen</button>
            </div>
        </div>
        <div id="login-component">
            <LoginComponent />
        </div>

        <SearchComponent />

    </div>
</template>

<script>
    import LoginComponent from "@/components/LoginComponent";
    import SearchComponent from "@/components/SearchComponent";

    export default {
        components: {
            LoginComponent,
            SearchComponent,
        },
        data() {
            return {};
        },
        methods: {
            gotoProfilePage() {
                // go to the profile page
            },
            gotoMailPage() {
                this.$router.push('/email');
            },
            gotoEventCreation() {
                this.$router.push('/createevent');
            },
        },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        }
    }
    };
</script>

<style scoped>

#app {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
}

  #header {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;
      background-color: var(--background);
  }

  .icon-div {
      padding: 15px;
      padding-bottom: 12px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      border-radius: 10px;
      cursor: pointer;
  }

  .icon {
      width: 35px;
      height: 35px;
      cursor: pointer;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      font-weight: 600;
  }

  #new-event-button {
      border-radius: 5px;
      width: 160px;
      height: 42.5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
      border: 1px solid #000000;
      cursor: pointer;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      font-weight: 600;
      margin-right: 100px;
      background-color: var(--backround);
      color: var(--font-color);
  }

  #profile-mail {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-left: 50px;
  }

  #login-component {
      margin-top: 50px;
  }

</style>

