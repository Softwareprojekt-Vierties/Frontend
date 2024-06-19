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
        --eventure_logo_font_color: #eee;
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
        --eventure_logo_font_color: #333333;
    }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  color: var(--font-color);
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
