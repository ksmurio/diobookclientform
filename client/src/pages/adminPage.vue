<template>
    <v-container class="mt-8 mb-8">
        <v-card class="elevation-4 rounded-lg" style="max-width: 600px; margin: auto;">
            <v-card-title class="bg-gradient pa-8 text-white d-flex align-center justify-center">
                <v-icon size="32" class="mr-3">mdi-hand-wave</v-icon>
                <h1 class="text-h4 font-weight-bold">Bem vindo</h1>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-8">
                <v-row class="justify-center">
                    <v-col cols="12">
                        <div class="mb-8">
                            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">
                                <v-icon small class="mr-2">mdi-link-variant</v-icon>Redes Sociais
                            </p>
                            <v-text-field v-model="linkInstagram" label="Link Instagram" prepend-inner-icon="mdi-instagram" variant="outlined"
                                density="comfortable" class="mb-4" />
                            <v-text-field v-model="linkFacebook" label="Link Facebook" prepend-inner-icon="mdi-facebook" variant="outlined"
                                density="comfortable" />
                        </div>

                        <v-divider class="my-6" />

                        <div class="mb-8">
                            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">
                                <v-icon small class="mr-2">mdi-calendar-off</v-icon>Não Trabalha aos:
                            </p>
                            <div class="d-flex flex-wrap gap-2">
                                <v-checkbox v-model="NaoTrabalhaSabados" label="Sábados" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaDomingos" label="Domingos" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaSegundas" label="Segundas" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaTerças" label="Terças" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaQuartas" label="Quartas" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaQuintas" label="Quintas" density="compact" />
                                <v-checkbox v-model="NaoTrabalhaSextas" label="Sextas" density="compact" />
                            </div>
                        </div>

                        <v-divider class="my-6" />

                        <div class="d-flex gap-3 justify-center mb-6">
                            <v-btn @click="guardarLinks" color="success" prepend-icon="mdi-content-save" size="large" class="flex-grow-1">
                                Salvar
                            </v-btn>
                            <v-btn @click="logout" color="error" prepend-icon="mdi-logout" size="large" class="flex-grow-1">
                                Logout
                            </v-btn>
                        </div>

                        <v-alert v-if="mensagem" class="mb-6" color="success" icon="mdi-check-circle" variant="tonal" closable>
                            {{ mensagem }}
                        </v-alert>

                        <v-divider class="my-6" />

                        <div>
                            <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">
                                <v-icon small class="mr-2">mdi-account-multiple</v-icon>Gerenciar Utilizadores
                            </p>

                            <v-card class="mb-6 pa-6 elevation-1">
                                <p class="text-body-2 font-weight-bold mb-4">Adicionar Novo Utilizador</p>

                                <v-row class="mb-4">
                                    <v-col cols="12">
                                        <v-text-field v-model="nome" label="Nome" prepend-inner-icon="mdi-account"
                                            variant="outlined" density="comfortable" />
                                    </v-col>
                                </v-row>

                                <v-row class="mb-4">
                                    <v-col cols="12">
                                        <v-select v-model="especialidade" :items="especialidades" item-title="name"
                                            item-value="id" :return-object="false" label="Especialidade"
                                            variant="outlined" />
                                    </v-col>
                                </v-row>

                                <v-row class="mb-4">
                                    <v-col cols="12" class="d-flex justify-center">
                                        <v-color-picker v-model="cor" hide-inputs flat elevation="0" />
                                    </v-col>
                                </v-row>

                                <v-row class="mb-4">
                                    <v-col cols="12">
                                        <v-text-field v-model="password" label="Password" type="password"
                                            prepend-inner-icon="mdi-lock" variant="outlined" density="comfortable" />
                                    </v-col>
                                </v-row>

                                <v-row class="mb-4">
                                    <v-col cols="12">
                                        <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload"
                                            style="display: none;" />
                                        <v-btn @click="$refs.fileInput.click()" prepend-icon="mdi-image"
                                            variant="outlined" color="#64942e" block>
                                            {{ nomeArquivo || 'Selecionar Foto' }}
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <v-alert v-if="mensagemAdmin" class="mb-4" :color="mensagemAdminSucesso ? 'success' : 'error'"
                                    icon="mdi-check-circle" variant="tonal">
                                    {{ mensagemAdmin }}
                                </v-alert>

                                <v-btn color="#64942e" prepend-icon="mdi-plus" @click="adicionarNovoAdmin" block>
                                    Adicionar Admin
                                </v-btn>
                            </v-card>

                            <div class="mb-4">
                                <p class="text-body-2 font-weight-bold mb-4">Utilizadores Existentes</p>

                                <v-list class="elevation-1">
                                    <v-list-item v-for="utilizador in utilizadores" :key="utilizador.id" class="mb-3">
                                        <template v-slot:prepend>
                                            <v-avatar color="#64942e" size="48" class="mr-3">
                                                <v-img v-if="utilizador.img" :src="utilizador.img" />
                                                <v-icon v-else>mdi-account</v-icon>
                                            </v-avatar>
                                        </template>

                                        <v-list-item-title class="font-weight-bold">{{ utilizador.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ utilizador.especialidade }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </div>
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

const nome = ref('');
const password = ref('');
const especialidade = ref('');
const especialidades = ref([]);
const profile_picture = ref(null);
const nomeArquivo = ref('');
const cor = ref('#64942e');
const mensagemAdmin = ref('');
const mensagemAdminSucesso = ref(false);
const utilizadores = ref([]);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        profile_picture.value = file;
        nomeArquivo.value = file.name;
    }
};

const fileToBase64 = (file) => { //verificar isso direito
    return new Promise((resolve, reject) => {
        const MAX_SIZE = 800;
        const MAX_BYTES = 2097152;

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height = Math.round((height * MAX_SIZE) / width);
                    width = MAX_SIZE;
                } else {
                    width = Math.round((width * MAX_SIZE) / height);
                    height = MAX_SIZE;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const base64 = canvas.toDataURL('image/jpeg', 0.8);

            if (base64.length > MAX_BYTES * 1.4) {
                reject(new Error('Foto ainda muito grande após compressão'));
                return;
            }

            resolve(base64);
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = url;
    });
};

const adicionarNovoAdmin = async () => {
    try {
        let fotoBase64 = null;

        if (profile_picture.value) {
            fotoBase64 = await fileToBase64(profile_picture.value);
        }

        const response = await fetch('http://localhost:3000/api/adminPage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nome.value,
                password: password.value,
                especialidade: especialidade.value,
                color: cor.value,
                img: fotoBase64
            })
        });

        const data = await response.json();
        mensagemAdmin.value = data.message;
        mensagemAdminSucesso.value = data.success;

        if (data.success) {
            nome.value = '';
            password.value = '';
            especialidade.value = '';
            profile_picture.value = null;
            nomeArquivo.value = '';
            cor.value = '#64942e';
            carregarUtilizadores();
        }

        setTimeout(() => mensagemAdmin.value = '', 3000);
    } catch (error) {
        mensagemAdmin.value = 'Erro: ' + error.message;
        mensagemAdminSucesso.value = false;
        setTimeout(() => mensagemAdmin.value = '', 3000);
    }
};

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
        setTimeout(() => mensagem.value = '', 3000);
    } catch (error) {
        mensagem.value = 'Não foi possível guardar links';
        setTimeout(() => mensagem.value = '', 3000);
    }
};

const carregarLinks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/adminPage');
        const data = await response.json();
        if (data.success) {
            linkInstagram.value = data.data.link_instagram || '';
            linkFacebook.value = data.data.link_facebook || '';
            NaoTrabalhaSabados.value = data.data.naotrabalhasabados;
            NaoTrabalhaDomingos.value = data.data.naotrabalhadomingos;
            NaoTrabalhaSegundas.value = data.data.naotrabalhasegundas;
            NaoTrabalhaTerças.value = data.data.naotrabalhatercas;
            NaoTrabalhaQuartas.value = data.data.naotrabalhaQuartas;
            NaoTrabalhaQuintas.value = data.data.naotrabalhaQuintas;
            NaoTrabalhaSextas.value = data.data.naotrabalhasextas;
        }
    } catch (error) {
        console.log(error);
    }
};

const carregarEspecialidades = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/listarEspecialidades');
        const data = await response.json();
        especialidades.value = data.data;
    } catch (error) {
        console.log('Erro ao carregar especialidades');
    }
};

const listarAdmins = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/listarAdmins');
        const data = await response.json();
        if (data.success) {
            utilizadores.value = data.data;
        }
    } catch (error) {
        console.log('Erro ao carregar utilizadores');
    }
};

const logout = () => {
    store.logout();
    router.push('/loginAdmin');
};

onMounted(() => {
    carregarLinks();
    carregarEspecialidades();
    listarAdmins();
});
</script>

<style scoped>
h1 {
    color: #64942e;
}
</style>