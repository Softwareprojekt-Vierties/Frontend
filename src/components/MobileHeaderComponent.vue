<template>
    <div id="header">
            <div id="image">
            </div>
            <div id="header-text">
                <div id="name">
                </div>
                <div id="short-description">
                </div>
            </div>
        </div>
</template>

<script>

    export default {
        components: {
        },
        props: {
            imagePreview: {
                type: String,
                default: "",
            },
            name: {
                type: String,
                default: "",
            },
            sterne: {
                type: Number,
                default: 0,
            },
            kurzbeschreibung: {
                type: String,
                default: "",
            }
        },
        computed: {
            imageURL() {
                return `url(${this.imagePreview})`;
            }
        },
    }
</script>

<style scoped>
#header {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: end;
    background-color: var(--create-page-background);
    gap: 8px;
    height: 160px;
}

#image {
    width: 125px;
    height: 110px;
    background-color: white;
    margin-bottom: 20px;
}

#short-description {
    width: 125px;
    height: 55px;
    background-color: white;
    margin-bottom: 20px;
    margin-right: 30px;
}
</style>
