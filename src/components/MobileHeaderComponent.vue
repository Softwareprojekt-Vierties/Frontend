<template>
    <div id="header">
        <div id="image">
        </div>
        <div id="header-text">
            <div id="name">Uni Party</div>
            <div id="short-decription">Minden</div>
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
    gap: 15px;
    height: 160px;
}

#image {
    width: 110px;
    height: 110px;
    background-color: white;
    margin-bottom: 20px;
    border-radius: 100px;
}

#header-text {
    display: grid;
    grid-template-columns: auto;
    justify-content: left;
    align-items: end;
    width: 125px;
    height: 55px;
    margin-bottom: 20px;
    margin-right: 42px;
}

#name {
    font-size: 25px;
    font-weight: bold;
    color: white;
    text-align: left;
    margin-top: 11px;
}

#short-decription {
    font-size: 15px;
    color: white;
    text-align: left;
}



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
    border-radius: 15px;
}

#header-text {
    display: grid;
    grid-template-columns: auto;
    justify-content: left;
    align-items: end;
    width: 125px;
    height: 55px;
    margin-bottom: 20px;
    margin-right: 30px;
}

#name {
    font-size: 25px;
    font-weight: bold;
    color: white;
    text-align: left;
    margin-top: 11px;
}

#short-decription {
    font-size: 15px;
    color: white;
    text-align: left;
}
</style>
