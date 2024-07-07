<template>
    <div id="event-card">
        <img :alt="name" :src="computedImagePath" id="event-image">

        <label>{{ componentName }}</label>

    </div>
</template>

<script>
    export default {
        props: {
            imagePath: {
                type: String,
                default : require("@/assets/bild-hsbi.jpg")
            },

            componentName:{
                type:String,
                default:'provider'
            }


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
    justify-content: left;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 12px;
    min-width: 117.5px;
    max-width: 117.5px;
    gap: 10px;
}

#event-image {
    width: 25px;
    height: 25px;
    border-radius: 8px;
    border: 2px solid #000000;
}

label {
    font-size: 13px;
    text-align: left;
    font-weight: bold;
    overflow: hidden;
}
</style>

