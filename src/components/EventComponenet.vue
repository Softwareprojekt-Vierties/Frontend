<template>
    <div id="event-card">
        <img :alt="name" :src="computedImagePath" id="event-image">
        <label>{{label}}</label>
    </div>
</template>

<script>
    export default {
        props: {
            imagePath: {
                type: String,
                default : require("@/assets/bild-hsbi.jpg")
            },
            label: {
                type: String,
                default: "-",
            },
        },
        computed: {
            computedImagePath() {
                console.log(this.label);
                if (this.imagePath == null) {
                    return require("@/assets/bild-hsbi.jpg");
                }
                return this.imagePath;
            }
        },
    }
</script>

<style scoped>
#event-card {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 10px;
    padding-top: 13px;
    padding-bottom: 13px;
    border-radius: 12px;
    height: 40px;
    margin-bottom: -10px;
}

#event-image {
    width: 33px;
    height: 33px;
    border-radius: 8px;
    border: 2px solid #000000;
}

label {
    font-size: 16px;
    margin-left: 15px;
    margin-right: 20px;
}
</style>

