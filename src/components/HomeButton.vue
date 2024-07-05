<template>
    <div id="icon-div" @click="goHome">
        <img alt="Filer" class="icon" v-if="isDarkMode" src="../assets/home_dark.png">
        <img alt="Filer" class="icon" v-else src="../assets/home.jpg">
    </div>
</template>

<script>
    export default {
        props: {
            isLoggedIn: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            isDarkMode() {
                return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
            },
        },
        methods: {
            goHome() {
                if (this.isLoggedIn) {
                    this.$router.push("/search");
                } else {
                    this.$router.push("/");
                }
            }
        },
    }
</script>

<style scoped>

#icon-div {
    width: 40px;
    padding: 15px;
    padding-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    cursor: pointer;
    background-color: var(--background);
    margin-left: 10px;
}

.icon {
    width: 35px;
    height: 35px;
    cursor: pointer;
}

</style>
