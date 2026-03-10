<template>
    <v-container class="mt-5">
        <v-card class="text-center">
            <v-card-title>
                <h1>Bem vindo</h1>
            </v-card-title>
            <v-card-text class="text-center">
                <v-row class="justify-center">
                    <v-col cols="6">
                        <v-text-field v-model="linkInstagram" label="Link Instagram" prepend-inner-icon="mdi-instagram"
                            variant="outlined" />
                        <v-text-field v-model="linkFacebook" label="Link Facebook" prepend-inner-icon="mdi-facebook"
                            variant="outlined" />

                        <p class="text-body-2">Não Trabalha aos:</p>
                        <div class="d-flex">
                            <v-checkbox v-model="NaoTrabalhaSabados" label="Sabados" />
                            <v-checkbox v-model="NaoTrabalhaDomingos" label="Domingos" />
                            <v-checkbox v-model="NaoTrabalhaSegundas" label="Segundas" />
                            <v-checkbox v-model="NaoTrabalhaTerças" label="Terças" />
                            <v-checkbox v-model="NaoTrabalhaQuartas" label="Quartas" />
                            <v-checkbox v-model="NaoTrabalhaQuintas" label="Quintas" />
                            <v-checkbox v-model="NaoTrabalhaSextas" label="Sextas" />
                        </div>

                        <v-btn @click="guardarLinks" color="success" prepend-icon="mdi-content-save">
                            Salvar
                        </v-btn>
                        <v-btn @click="logout" color="error" prepend-icon="mdi-logout" class="ml-2">
                            Logout
                        </v-btn>
                        <v-alert v-if="mensagem" class="mt-4 alerta" color="success" icon="mdi-check-circle">
                            {{ mensagem }}
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const store = useAuthStore();

const mensagem = ref('');
const linkInstagram = ref('');
const linkFacebook = ref('');
const NaoTrabalhaSabados = ref(false);
const NaoTrabalhaDomingos = ref(false);
const NaoTrabalhaSegundas = ref(false);
const NaoTrabalhaTerças = ref(false);
const NaoTrabalhaQuartas = ref(false);
const NaoTrabalhaQuintas = ref(false);
const NaoTrabalhaSextas = ref(false);


const guardarLinks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/adminPage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_admin: store.admin?.id || 1,
                link_instagram: linkInstagram.value,
                mostrar_link_instagram: linkInstagram.value ? 1 : 0,
                link_facebook: linkFacebook.value,
                mostrar_link_facebook: linkFacebook.value ? 1 : 0,
                naotrabalhasabados: NaoTrabalhaSabados.value ? 1 : 0,
                naotrabalhadomingos: NaoTrabalhaDomingos.value ? 1 : 0,
                naotrabalhasegundas: NaoTrabalhaSegundas.value ? 1 : 0,
                naotrabalhatercas: NaoTrabalhaTerças.value ? 1 : 0,
                naotrabalhaQuartas: NaoTrabalhaQuartas.value ? 1 : 0,
                naotrabalhaQuintas: NaoTrabalhaQuintas.value ? 1 : 0,
                naotrabalhasextas: NaoTrabalhaSextas.value ? 1 : 0,

            })
        });
        const data = await response.json();
        mensagem.value = data.message;
        setTimeout(() => mensagem.value = '', 1000);
    } catch (error) {
        mensagem.value = 'Não foi possível guardar links';
        setTimeout(() => mensagem.value = '', 1000);
    }
};

const carregarLinks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/adminPage');
        const data = await response.json();
        if (data.success) {
            linkInstagram.value = data.data.link_instagram || '';
            linkFacebook.value = data.data.link_facebook || '';

            NaoTrabalhaSabados.value  = data.data.naotrabalhasabados;
            NaoTrabalhaDomingos.value = data.data.naotrabalhadomingos;
            NaoTrabalhaSegundas.value = data.data.naotrabalhasegundas;
            NaoTrabalhaTerças.value   = data.data.naotrabalhatercas;
            NaoTrabalhaQuartas.value  = data.data.naotrabalhaQuartas;
            NaoTrabalhaQuintas.value  = data.data.naotrabalhaQuintas;
            NaoTrabalhaSextas.value   = data.data.naotrabalhasextas;
        }
    } catch (error) {
        console.log(error);
    }
};

const logout = () => {
    store.logout();
    router.push('/loginAdmin');
};

onMounted(() => {
    carregarLinks();
});
</script>

<style scoped>
h1 {
    color: #64942e;
}

.alerta {
    animation: desaparecer 1s ease forwards;
}

@keyframes desaparecer {
    0% {
        opacity: 1;
    }

    70% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>