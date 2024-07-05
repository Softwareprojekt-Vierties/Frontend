<template>
    <div id="file-div">
        <div id="file-upload">
            <label id="image-text" for="fileToUpload">
                <img v-if="!url && isDarkMode" src="../assets/addpicture.png" alt="Bild hochladen" class="upload-icon" />
                <img v-else-if="!url" src="../assets/addpicture.jpg" alt="Bild hochladen" class="upload-icon" />
                <span id="upload-text" v-if="!url">Bild hochladen</span>
            </label>
            <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" @change="onFileChange">
        </div>
    </div>
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
            },
            onFileChange: {
                type: Function,
                default: () => {},
            }
        },
            computed: {
                imageURL() {
                    return `url(${this.url})`;
                },
                isDarkMode() {
                    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
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

#file-upload {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

#file-upload label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

#file-upload input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.upload-icon {
    max-width: 50%;
    max-height: 50%;
    margin-bottom: -10px; /* Adjust margin to bring the text closer */
    margin-left: 10px;
    margin-top: -10px;
}

#upload-text {
    color: var(--upload-text-color);
    margin-top: 0; /* Remove any top margin to bring it closer to the image */
}

</style>
