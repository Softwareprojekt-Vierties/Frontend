<template>
    <div id="bookmark-wrapper" @click="wrappingDiv ? () => {} : changeBookmark()" :disabled="pending">
        <img v-if="isDarkMode && hasBookmark" src="../assets/bookmark-filled.png" id="bookmark">
        <img v-else-if="isDarkMode" src="../assets/bookmark-empty.png" id="bookmark">
        <img v-else-if="hasBookmark" src="../assets/bookmark-gray.jpg" id="bookmark">
        <img v-else src="../assets/bookmark-white.jpg" id="bookmark">
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pending: false,
        }
    },
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
        width: {
            type: String,
            default: "10px",
        },
        height: {
            type: String,
            default: "10px",
        },
        margin: {
            type: String,
            default: "",
        },
        marginTop: {
            type: String,
            default: "",
        },
        marginBottom: {
            type: String,
            default: "",
        },
        marginLeft: {
            type: String,
            default: "",
        },
        marginRight: {
            type: String,
            default: "",
        },
        padding: {
            type: String,
            default: "",
        },
        paddingTop: {
            type: String,
            default: "",
        },
        paddingBottom: {
            type: String,
            default: "",
        },
        paddingLeft: {
            type: String,
            default: "",
        },
        paddingRight: {
            type: String,
            default: "",
        },
        divWidth: {
            type: String,
            default: "10px",
        },
        divHeight: {
            type: String,
            default: "10px",
        },
        divMargin: {
            type: String,
            default: "",
        },
        divMarginTop: {
            type: String,
            default: "",
        },
        divMarginBottom: {
            type: String,
            default: "",
        },
        divMarginLeft: {
            type: String,
            default: "",
        },
        divMarginRight: {
            type: String,
            default: "",
        },
        divPadding: {
            type: String,
            default: "",
        },
        divPaddingTop: {
            type: String,
            default: "",
        },
        divPaddingBottom: {
            type: String,
            default: "",
        },
        divPaddingLeft: {
            type: String,
            default: "",
        },
        divPaddingRight: {
            type: String,
            default: "",
        },
        divBorderRadius: {
            type: String,
            default: "",
        },
        divBoxShadow: {
            type: String,
            default: "",
        },
        wrappingDiv: {
            type: String,
            default: null,
        }
    },
    methods: {
        async changeBookmark() {
            if (this.pending) return;
            this.pending = true;
            this.$forceUpdate();
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
                .catch(err => console.error("Error: ", err))
                .finally(() => {
                    this.pending = false;
                });
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
    mounted() {
        if (this.wrappingDiv) {
            const wrapper = document.getElementById(this.wrappingDiv);
            wrapper.addEventListener("click", this.changeBookmark);
        }
    }
}
</script>

<style scoped>

#bookmark-wrapper {
    display: inline-block;
    width: max-content;
    height: max-content;
    margin: 0;
    padding: 0;
}

#bookmark {
    width: v-bind("width"); /*10px*/
    height: v-bind("height"); /*17px*/
    padding-top: v-bind("paddingTop");
    padding-bottom: v-bind("paddingBottom");
    padding-left: v-bind("paddingLeft"); /*2px*/
    padding-right: v-bind("paddingRight");
    margin-top: v-bind("marginTop");
    margin-bottom: v-bind("marginBottom");
    margin-left: v-bind("marginLeft");
    margin-right: v-bind("marginRight");
}
    
</style>
