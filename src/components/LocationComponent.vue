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
    padding: 5px;
    padding-left: 10px;
    border-radius: 5px;
    height: 25px;
}

#event-image {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid #000000;
}

label {
    font-size: 16px;
    margin-left: 15px;
    margin-right: 20px;
    text-align: left;
}
</style>

