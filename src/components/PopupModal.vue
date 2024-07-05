<template>
    <div v-if="show" id="modal-overlay">
        <div id="modal-content">
            <div id="headline">
                <label>Privatsphäre-Einstellung</label>
            </div>
            <div id="event-buttons">
                <div @click="isPrivate = true" :style="{backgroundColor: isPrivate ? 'var(--blue)' : 'var(--white)'}" id="event-button">{{privateText}}</div>
                <div @click="isPrivate = false" :style="{backgroundColor: !isPrivate ? 'var(--blue)' : 'var(--white)'}" id="event-button">{{publicText}}</div>
            </div>
            <div id="action-buttons">
                <button id="cancel-button" @click="closeModal">abbrechen</button>
                <button id="create-button" @click="create">Jetzt erstellen</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isPrivate: true,
        }
    },
props: {
    show: {
        type: Boolean,
        required: true
    },
    onCreate: {
        type: Function,
        default: () => {},
    },
    privateText: {
        type: String,
        default: "privat",
    },
    publicText: {
        type: String,
        default: "öffentlich",
    },
},
methods: {
    closeModal() {
        this.$emit('close');
    },
    create() {
        // Logik für das Erstellen des Events hinzufügen
        this.onCreate(this.isPrivate);
        this.closeModal();
    }
}
}
</script>

<style scoped>
#modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
}

#modal-content {
    background: white;
    padding: 30px;
    padding-top: 20px;
    padding-bottom: 12.5px;
    border-radius: 20px;
    text-align: center;
    width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

#headline {
    margin-bottom: 50px;
    font-weight: bold;
}

#event-buttons {
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

#event-button {
    border-radius: 50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    padding: 11px;
    padding-left: 45px;
    padding-right: 45px;
    margin-bottom: 20px;
    font-size: 12px;
}

#action-buttons {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}

#cancel-button {
    background-color: rgb(254, 68, 77);
    width: 115px;
    height: 35px;
    border-radius: 7px;
    border: 1px solid #000000;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

#create-button {
    background-color: rgb(146, 208, 80);
    width: 115px;
    height: 35px;
    border-radius: 7px;
    border: 1px solid #000000;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
</style>
