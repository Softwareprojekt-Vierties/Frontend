<template>
    <div id="mail-div" :class="{ read: isSelected, gelesenMail: gelesen, unreadMail: !gelesen }" @click="handleClick">
        <div id="icon-text">
            <img :alt="name" :src="computedImagePath" :class="{'default-image': isDefaultImage, 'non-default-image': !isDefaultImage}" id="mail-image">
            <label id="name">{{ name }}</label>
            <div id="info">Betreff: {{ auftrag }}</div>
        </div>
        <div id="status"></div>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: "Peter Müller"
            },
            auftrag: {
                type: String,
                default: "Freundschaft"
            },
            imagePath: {
                type: String,
                default: require("@/assets/profile-icon.png")
            },
            isSelected: {
                type: Boolean,
                default: false
            },
            gelesen: {
                type: Boolean,
                default: false
            }
        },
        
        computed: {
            computedImagePath() {
                if (this.imagePath === null) {
                    return require("@/assets/profile-icon.png");
                }
                return this.imagePath;
            },
            isDefaultImage() {
                return this.imagePath === require("@/assets/profile-icon.png");
            }
        },
        methods: {
            notifyParent() {
                this.$emit('email-selected', {
                    name: this.name,
                    auftrag: this.auftrag
                });
            }, 
            handleClick() {
                this.notifyParent(); 
                this.$emit('click');
            }
        }
    }
</script>

<style scoped>
#mail-div {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: top;
    border: 1px solid rgb(100, 100, 100);
    padding: 10px;
    padding-right: 0px;
    border-radius: 10px;
    background-color: rgb(247, 247, 247);
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
}

#icon-text {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: left;
    align-items: center;
    gap: 10px;
}

.gelesenMail {
    border: 1px solid rgb(0, 0, 0);
}

.unreadMail {
    border: 2px solid rgb(0, 0, 0);
}

#mail-image.default-image {
    border-radius: 6px;
    border: 2px solid #000000;
    width: 18px;
    height: 18px;
    padding: 5px;
}

#mail-image.non-default-image {
    border-radius: 6px;
    border: 2px solid #000000;
    width: 23px;
    height: 23px;
    padding: 0;
}

#name {
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    text-align: left;
}

#info {
    font-size: 10px;
    text-align: left;
}

.unread {
    box-shadow: 0 0 5px red;
}

.read {
    box-shadow: 0 0 12px rgb(111, 112, 111);
}

#status {
    width: 7px;
    height: 7px;
    border-radius: 10px;
    border: 1.5px solid #000000;
    margin-right: 7.5px;
}


</style>
