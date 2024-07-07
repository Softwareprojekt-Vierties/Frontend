<template>
    <div id="div-bookmark" @click="changeBookmark">
        <img v-if="isDarkMode && hasBookmark" src="../assets/bookmark-filled.png" id="bookmark">
        <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
        <img v-else-if="hasBookmark" src="../assets/bookmark-gray.jpg" id="bookmark">
        <img v-else src="../assets/bookmark-white.jpg" id="bookmark">
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        hasBookmark: {
            type: Boolean,
            default: false,
        },
        id: {
            type: Number,
            default: -1,
        },
        type: {
            type: String,
            default: null,
        },
    },
    methods: {
        changeBookmark() {
            // send switch to server
            axios.post("/changeFavorite/", {
                id: this.id,
                type: this.type,
                istfav: !this.hasBookmark, 
            },{
                headers: { "auth": localStorage.getItem("authToken")}
            })
                .then(res => {
                    console.log("Success: ", res);
                    this.$emit("update:hasBookmark", !this.hasBookmark);
                })
                .catch(err => console.error("Error: ", err));
        },
    },
    computed: {
        isDarkMode() {
            return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
        },
    },
    emits: [
        "update:hasBookmark",
    ],
}
</script>

<style scoped>

#div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
    cursor: pointer;
    margin-right: 10px;
}

#bookmark {
    width: 10px;
    height: 17px;
    margin-left: 2px;
}
    
</style>
