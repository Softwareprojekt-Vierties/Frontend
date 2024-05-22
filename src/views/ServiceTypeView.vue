<template>
    <div class ="image">
        <LoginComponent v-if="!mobileView"/>
        <MobileLogo v-if="mobileView"/>
    </div>

    <div>
        <button class="buttonPerson">DJ/Bands</button>
    </div>

    <div>
        <button v-bind:class="[ mobileView ? 'buttonDienstMobile' : 'buttonDienst' ]">Caterer</button>
    </div>

    <div>
        <p>By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.
        </p>
    </div>

</template>

<script>
    import LoginComponent from '@/components/LoginComponent'; 
    import MobileLogo from '../components/MoblieLogo.vue'

    export default {
        name: 'LoginPage', 
        components: {
            LoginComponent,
            MobileLogo
        },
        data() {
            return {
                mobileView: false
            }
        },
        methods: {
            handleView() {
                this.mobileView = window.innerWidth < 800;
            }
        },
        created() {
            this.handleView()
            window.addEventListener("resize", this.handleView);
        }
    }
</script>

<style scoped>

.image{
    margin-top: -100px;
    margin-bottom: 150px;
}

  .buttonPerson{

      width: 240px;
      height: 30px;
      margin-bottom: 40px;
      border-radius: 20px; /* Raio da borda arredondada */
      border: 1px solid #0a0a0a; 
      cursor: pointer; 
  }

  .buttonDienst{
      width: 240px;
      height: 30px;
      margin-bottom: 200px;
      border-radius: 20px; /* Raio da borda arredondada */
      border: 1px solid #0a0a0a; 
      cursor: pointer; 
  }

  .buttonDienstMobile {
      width: 240px;
      height: 30px;
      margin-bottom: 100px;
      border-radius: 20px; /* Raio da borda arredondada */
      border: 1px solid #0a0a0a; 
      cursor: pointer; 
  }
</style>
