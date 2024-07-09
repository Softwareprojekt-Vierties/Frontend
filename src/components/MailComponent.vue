<template>
        <div id="mail-div" :class="{ read: isSelected, gelesenMail: gelesen, unreadMail: !gelesen }" @click="handleClick">
            <div id="icon-text">
                <div id="mail-card">
                    <img :alt="name" :src="computedImagePath" id="mail-image">
                    <label id="name">{{ name }}</label>
                </div>
                <div id="info">Betreff: {{ auftrag }}</div>
            </div>
            <div id="status" :class="{status_color_accept : angenommen, status_color_notaccept :!angenommen, status_color_new: angenommen === null}"></div>
        </div>
    </template>
    
    <script>
        export default {
            props: {
                name: {
                    type: String,
                    default : "Name"
                },
                auftrag : {
                    type: String,
                    default : "Auftrag"
                }, 
                imagePath: {
                    type: String,
                    default : require("@/assets/profile-icon.png")
                },
                isSelected: {
                    type : Boolean,
                    default : false
                },
                gelesen:{
                    type: Boolean,
                    default :false
                },
                angenommen: {
                type: [Boolean, null],
                required: true
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
        width: 184px;
        height: 50px;
        /*border: 1px solid rgb(100, 100, 100);*/
        padding: 10px;
        border-radius: 12px;
        margin-bottom: 10px;
        background-color: rgb(247, 247, 247);
        cursor:pointer;
    }

    .gelesenMail{
        border: 1px solid rgb(0, 0, 0);
    }

    .unreadMail {
        border:2px solid rgb(0, 0, 0);

    }
    
    #mail-card {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: left;
        align-items: center;
        gap: 12px;
    }
    
    #mail-image {
        width: 29px;
        border-radius: 6px;
        border: 2px solid #000000;
        height: 29px;
    }
    
    #name {
        font-size: 15px;
        font-weight: bold;
        cursor:pointer;
    }
    
    #info {
        font-size: 12px;
        margin-left: 41px;
        margin-top: 7px;
        text-align : left;

    }
    
    .unread {
        box-shadow: 0 0 5px red;
    }
    
    .read {
        box-shadow: 0 0 12px rgb(111, 112, 111);
    }

    #status {
        width: 8px;
        height: 8px;
        border-radius: 10px;
        border: 1.5px solid #000000;
    }

    .status_color_accept{
        background-color:var(--green);
    }

    .status_color_notaccept{
        background-color:var(--red);
    }

    .status_color_new{
        background-color:grey;
    }
        
    </style>
    