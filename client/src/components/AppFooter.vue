<template>
    <v-footer class="footer">
        <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">

                <v-btn
                    v-if="mostrarInstagram"
                    :href="linkInstagram"
                    target="_blank"
                    icon
                    variant="text"
                >
                    <v-icon>mdi-instagram</v-icon>
                </v-btn>

                <v-btn
                    v-if="mostrarFacebook"
                    :href="linkFacebook"
                    target="_blank"
                    icon
                    variant="text"
                >
                    <v-icon>mdi-facebook</v-icon>
                </v-btn>

            </v-col>
            <v-col cols="12" class="text-center">
                <span>&copy; 2026 Diobook</span>
            </v-col>
        </v-row>
    </v-footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const linkInstagram = ref('');
const linkFacebook = ref('');
const mostrarInstagram = ref(false);
const mostrarFacebook = ref(false);

const buscarLinks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/buscarLinks');
        const data = await response.json();
        if (data.success && data.data) {
            linkInstagram.value = data.data.link_instagram;
            linkFacebook.value = data.data.link_facebook;
            mostrarInstagram.value = data.data.mostrar_link_instagram === 1;
            mostrarFacebook.value = data.data.mostrar_link_facebook === 1;
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    buscarLinks();
});
</script>

<style scoped>
.footer{
    background-color: #64942e;
    color: white;
}

.v-icon:hover{
    transform: scale(1.5);
    transition: ease 0.2s;
    color: orange;
}
</style>