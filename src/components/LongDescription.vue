<template>
    <div class="long-description">
        <label class="description">Beschreibung:</label>
        <label id="long-description-input" type="text">{{description}}</label>
        <label v-if="events" class="description-info">Eventarten:</label>
        <label v-if="events" id="long-description-input" type="text">{{events}}</label>
        <label v-if="song" class="description-info">Lieblings Lied:</label>
        <label v-if="song" id="long-description-input" type="text">{{song}}</label>
        <label v-if="dish" class="description-info">Lieblings Gericht:</label>
        <label v-if="dish" id="long-description-input" type="text">{{dish}}</label>
    </div>
</template>

<script>
    export default {
        props: {
            description: {
                type: String,
                default: "",
            },
            events: {
                type: String,
                default: "",
            },
            song: {
                type: String,
                default: "",
            },
            dish: {
                type: String,
                default: "",
            },
        }
    }
</script>

<style scoped>

.long-description {
    border-radius: 10px;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    padding: 10px;
    display: grid;
    grid-template-columns: 580px;
    justify-content: left;
    font-weight: bold;
    overflow-wrap: break-word;
}

.long-description::placeholder {
    color: var(--placeholder-color);
}

.description {
    text-align: left;
    font-size: 12px;
    margin-bottom: 3px;
}

.description-info {
    text-align: left;
    font-size: 12px;
    margin-bottom: 3px;
    margin-top: 20px;
}

#long-description-input {
    width: 580px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 0px;
    border: none;
    resize: none;
    background-color: var(--textfield-background);
    color: var(--textfield-font-color);
    text-align: left;
    font-weight: normal;
}

</style>
