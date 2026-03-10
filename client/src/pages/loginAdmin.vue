<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card min-width="500" min-height="500">
            <v-card-title>Admin Login</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field label="Username" v-model="username" required />
                    <v-text-field label="Senha" type="password" v-model="senha" required />
                    <v-alert v-if="mensagem" type="error" class="mb-3">{{ mensagem }}</v-alert>
                    <v-btn @click="loginAdmin">Login</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const store = useAuthStore();

const username = ref('');
const senha = ref('');
const mensagem = ref('');

const loginAdmin = async () => {
    mensagem.value = '';
    const data = await store.login(username.value, senha.value);
    if (data.success) {
        router.push('/adminPage');
    } else {
        mensagem.value = data.message || 'Credenciais inválidas';
    }
};
</script>

<style scoped>
.v-card {
    background-color: #f8f8f8;
    border: 3px solid #64942e;
    border-radius: 20px;
}
.v-card-title {
    color: #64942e;
}
.v-btn {
    color: white;
    background-color: #64942e;
}
.v-btn:hover {
    background-color: orange;
}
</style>