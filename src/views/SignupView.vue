<template>
    <div class="image">
        <LoginComponent v-if="!mobileView"/>
        <MobileLogo v-if="mobileView"/>
    </div>

    <div>
        <input v-model="benutzername" class="textFeld" type="text" placeholder=" Benutzername" name="benutzername" />
    </div>

    <div>
        <input v-model="email" class="textFeld" type="email" placeholder=" E-Mail" name="email" />
    </div>

    <div>
        <input v-model="password" class="textFeld" type="password" placeholder=" Password" name="password" />
    </div>

    <div v-bind:class="[ mobileView ? 'buttonBoxMobile' : 'buttonBox' ]"> 
        <button @click="zuruck" class="abbrechen">abbrechen</button>
        <button class="weiter" :disabled="!isFormValid">weiter</button>
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
        name: 'SignupPage', 
        components: {
            LoginComponent,
            MobileLogo
        },

        data(){
            return {
                email:'',
                password:'',
                benutzername:'',
                mobileView: false
            };
        },
        computed: {
            isFormValid(){
                const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
                const passwordValid = this.password.length >= 6;
                const benutzernameValid = this.benutzername.length > 0;
                return emailValid && passwordValid && benutzernameValid;
            }
        },
        methods: {
            handleView() {
                this.mobileView = window.innerWidth < 800;
            },
            zuruck(){
                this.$router.push('/');
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
    margin-bottom: 60px;
}

.textFeld{
    width: 240px;
    height: 25px;
    border: 2px solid #cccccc;
    border-radius: 20px; 
    margin-bottom: 40px;
    font-size: 13px; 
    box-shadow: 1px 1px 5px rgba(0,0,0,0.1); 
    outline: none; 
}

.buttonBox{
    margin-bottom: 180px;;
}

.buttonBoxMobile {
    margin-bottom: 90px;;
}

.weiter{
    margin-left: 15px;
    width: 110px;
    height: 30px;
    border-radius: 20px;
    border: 1px solid #ecf5ec; 
    background-color: #1fda29; 
    cursor: pointer; 
    transition: background-color 0.3s; 

}

.abbrechen{
    margin-right: 15px;
    width: 110px;
    height: 30px;
    border: 1px solid #ecf5ec; 
    border-radius: 20px; 
    background-color: #f81111; 
    cursor: pointer; 

}
</style>
