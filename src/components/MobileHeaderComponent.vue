<template>
    <div id="header">
        <div id="header-inner">
            <Image :url="imagePreview" width="125px" height="110px" margin-bottom="20px" borderRadius="15px" boxShadow="0 0 10px rgba(0, 0, 0, 0.8)" />
            <div id="header-text">
                <div id="name">{{name}}</div>
                <div id="short-decription">{{kurzbeschreibung}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Image from '../components/ImageComponent.vue';

    export default {
        components: {
            Image,
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
    background-image: v-bind("imageURL");
    background-size: cover;
    background-postion: center;
    background-color: var(--create-page-background);
    height: 160px;
}

#header-inner {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto auto;
    gap: 15px;
    justify-content: center;
    align-items: end;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    @media (prefers-color-scheme: dark) {
        backdrop-filter: brightness(50%) blur(10px);
        -webkit-backdrop-filter: brightness(50%) blur(10px);
    }
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
    background-color: var(--create-page-background);
    background-image: v-bind("imageURL");
    background-size: cover;
    background-postion: center;
    height: 160px;
}

#header-inner {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: end;
    gap: 8px;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    @media (prefers-color-scheme: dark) {
        backdrop-filter: brightness(50%) blur(10px);
        -webkit-backdrop-filter: brightness(50%) blur(10px);
    }
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
