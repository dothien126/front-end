<template>
    <div class="fixed bottom-14 md:bottom-3 right-3 z-[888]" v-if="rowShowHide">
        <button class="btn btn-secondary rounded-full p-2" @click="backToTop">
            <ChevronUpIcon class="w-4 h-4"/>
<!--            <ChevronDownIcon v-else class="w-4 h-4"/>-->
        </button>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
    name: "BackToTop",
    data() {
        return {
            rowShowHide: false
        }
    },
    created() {
        window.addEventListener('scroll', this.windowScroll)
    },
    destroyed() {
        window.addEventListener('scroll', this.windowScroll)
    },
    methods: {
        backToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },
        windowScroll(_event) {
            const wY = window.scrollY;
            if(wY > 200) {
                this.rowShowHide = true;
            } else {
                this.rowShowHide = false;
            }
        }
    }
})
</script>

<style lang="scss">

</style>