<template>
    <router-view />
</template>

<script>
export default {
    data() {
        return {
            theme: "",
        };
    },
    created() {
        console.log(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    }
}
</script>

<style>
@media (prefers-color-scheme: dark) {
    :root {
        --background: #222222;
        --font-color: #84BABA;
        --textfield-background: #5e5e5e;
        --textfield-font-color: #cccccc;
        --placeholder-color: #acacac;
        --border-color: #7e8e7e;
        --dark-border-color: #9e9e9e;
        --eventure_logo_font_color: #eee;
        --create-page-background: #303030;
        --create-page-header-background: #252525;
        --simple-font-color: #dcdcdc;
        --simple-font-color-disabled: #aaaaaa;
        --upload-text-color: #cccccc;
        --slider-background-color: #aaaaaa;
        --button-border: none;

        --red: #c80101;
        --green: #0faa19;
        --blue: #8533c9;
        --cyan: #00adad;
        --yellow: #d5b110;
        --white: #dddddd;
        --light-gray: #aaaaaa;
    }
}

@media (prefers-color-scheme: light) {
    :root {
        --background: white;
        --font-color: #2c3e50;
        --textfield-background: white;
        --textfield-font-color: black;
        --placeholder-color: #888888;
        --border-color: #ecf5ec;
        --dark-border-color: #0a0a0a;
        --eventure_logo_font_color: #333333;
        --create-page-background: #f2f2f2;
        --create-page-header-background: #d5d5d5;
        --simple-font-color: black;
        --simple-font-color-disabled: #101010;
        --upload-text-color: #999999;
        --slider-background-color: #cccccc;
        --button-border: 1px solid black;

        
        --red: rgb(254, 68, 77);
        --green: rgb(146, 208, 80);
        --blue: rgb(216, 110, 204);
        --cyan: rgb(0, 216, 176);
        --yellow: #f5d130;
        --white: #ffffff;
        --light-gray: #ccc;
    }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  color: var(--font-color);
    background-color: var(--background);
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: var(--font-color);
}

nav a.router-link-exact-active {
  color: #42b983;
}

html, body {
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: var(--background);
}
</style>
