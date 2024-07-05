<template>
    <div id="file-div" :style="style"></div>
</template>

<script>
    export default {
        props: {
            url: {
                type: String,
                default: "",
            },
            width: {
                type: String,
                default: "",
            },
            height: {
                type: String,
                default: "100px",
            },
            marginLeft: {
                type: String,
                default: "",
            },
            marginRight: {
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
            paddingLeft: {
                type: String,
                default: "",
            },
            paddingRight: {
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
            borderRadius: {
                type: String,
                default: "",
            },
            boxShadow: {
                type: String,
                default: "",
            },
            style: {
                type: Object,
                default: null,
            }
        },
        computed: {
            imageURL() {
                return `url(${this.url})`;
            },
        },
    }
</script>

<style scoped>

#file-div {
    width: v-bind("width");
    height: v-bind("height");
    background-image: v-bind("imageURL");
    background-size: cover;
    background-postion: center;
    
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--textfield-background);

    margin-left: v-bind("marginLeft");
    margin-right: v-bind("marginRight");
    margin-top: v-bind("marginTop");
    margin-bottom: v-bind("marginBottom");
    padding-left: v-bind("paddingLeft");
    padding-right: v-bind("paddingRight");
    padding-top: v-bind("paddingTop");
    padding-bottom: v-bind("paddingBottom");

    box-shadow: v-bind("boxShadow");
    border-radius: v-bind("borderRadius");
}

</style>
