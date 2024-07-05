<template>
    <div id="info-bookmark">
        <label id="info-headline">Infos</label>
        <div id="div-bookmark" @click="changeBookmark">
            <img v-if="isDarkMode && hasBookmark" src="../assets/bookmark-filled.png" id="bookmark">
            <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
            <img v-else-if="hasBookmark" src="../assets/bookmark-white.jpg" id="bookmark">
            <img v-else src="../assets/bookmark-gray.jpg" id="bookmark">
        </div>
    </div>
</template>

<script>
    import axios from 'axios'; 

    export default {
        data() {
            return {
                hasBookmark: false,
            }
        },
        props: {
            isFavorite: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: null,
            },
            id: {
                type: Number,
                default: 0,
            }
        },
        methods: {
            changeBookmark() {
                this.hasBookmark = !this.hasBookmark;
                // send switch to server
                axios.post("/changeFavorite/", {
                    id: this.id,
                    type: this.type,
                },{
                    headers: { "auth": localStorage.getItem("authToken")}
                })
                    .then(res => console.log("Success: ", res))
                    .catch(err => console.error("Error: ", err));
            }
        },
        computed: {
            isDarkMode() {
                return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
            }
        },
        created() {
            this.hasBookmark = this.isFavorite;
        },
    }
</script>

<style scoped>
#info-bookmark {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
}

#div-bookmark {
    border-radius: 30px;
    padding: 2px;
    width: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding-left: 1px;
    padding-top: 5px;
    cursor: pointer;
}

#bookmark {
    width: 10px;
    height: 17px;
}
</style>
