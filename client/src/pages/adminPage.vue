<template>
    <v-container class="mt-5">
        <v-card class="text-center">
            <v-card-title><h1>Bem vindo</h1></v-card-title>
            <v-card-text class="text-center">
                <v-row class="justify-center">
                    <v-col cols="6">
                        <v-text-field
                            v-model="linkInstagram"
                            label="Link Instagram"
                            prepend-inner-icon="mdi-instagram"
                        />

                        <v-text-field
                            v-model="linkFacebook"
                            label="Link Facebook"
                            prepend-inner-icon="mdi-facebook"
                        />

                        <v-btn @click="guardarLinks" color="success" prepend-icon="mdi-content-save">
                            Salvar
                        </v-btn>

                        <v-alert v-if="mensagem" class="mt-4" :type="sucesso ? 'success' : 'error'" :icon="sucesso ? 'mdi-check-circle' : 'mdi-alert-circle'">
                            {{ mensagem }}
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'

const mensagem = ref('');
const linkInstagram = ref('');
const linkFacebook = ref('');

const guardarLinks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/adminPage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_admin: 1,
                link_instagram: linkInstagram.value,
                mostrar_link_instagram: linkInstagram.value ? 1 : 0,
                link_facebook: linkFacebook.value,
                mostrar_link_facebook: linkFacebook.value ? 1 : 0,    
            })
        });
        const data = await response.json();
        mensagem.value = data.message;
    } catch (error) {
        mensagem.value = 'Não foi possível guardar links';
    }
}
</script>