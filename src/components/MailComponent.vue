<template>
    <div id="mail-div">
        <div id="mail-card">
            <img :alt="name" :src="computedImagePath" id="mail-image">
            <label id="name">Peter Müller</label>
        </div>
        <div id="info">Auftrag: UNI PARTY</div>
    </div>
</template>

<script>
    export default {
        props: {
            imagePath: {
                type: String,
                default : require("@/assets/profile-icon.png")
            }
        },
        computed: {
            computedImagePath() {
                if (this.imagePath === null) {
                    return require("@/assets/profile-icon.png");
                }
                return this.imagePath;
            }
        },
    }
</script>

<style scoped>
#mail-div {
    width: 184px;
    height: 50px;
    border: 1px solid rgb(100, 100, 100);
    padding: 10px;
    border-radius: 12px;
    margin-bottom: 10px;
    background-color: rgb(247, 247, 247);
}

#mail-card {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    align-items: center;
    gap: 12px;
}

#mail-image {
    width: 15px;
    border-radius: 6px;
    border: 2px solid #000000;
    padding: 5px;
}

#name {
    font-size: 15px;
    font-weight: bold;
}

#info {
    font-size: 12px;
    margin-left: 8px;
    margin-top: 7px;
}
</style>