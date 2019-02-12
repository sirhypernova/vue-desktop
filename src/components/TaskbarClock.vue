<template>
    <v-layout row align-center>
        <v-flex>
            <h2 style="margin-right: 10px; font-family: 'Orbitron', sans-serif;">{{hour}}:{{minute}}:{{seconds}} {{pm ? 'PM' : 'AM'}}</h2>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "TaskbarClock",
        data() {
            return {
                hour: '00',
                minute: '00',
                seconds: '00',
                pm: false,
            }
        },
        mounted() {
            this.updateTime();
            setInterval(this.updateTime,1000);
        },
        methods: {
            updateTime() {
                let time = new Date(Date.now());
                this.hour = time.getHours();
                this.minute = time.getMinutes();
                this.seconds = time.getSeconds();

                if (this.hour > 12) {
                    this.hour = this.hour - 12;
                    this.pm = true
                } else {
                    this.pm = false;
                }
                if (this.minute < 10) {
                    this.minute = '0' + this.minute;
                }
                if (this.seconds < 10) {
                    this.seconds = '0' + this.seconds;
                }
            },
            noop() {
                alert('oof');
            }
        }
    }
</script>

<style scoped>
    h2 {
        color: white;
        user-select: none;
    }
</style>