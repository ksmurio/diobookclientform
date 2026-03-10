<template>
    <v-container class="mt-5" max-width="600">
        <v-card>
            <v-card-title class="text-center">
                <h1>Fazer Reserva</h1>
            </v-card-title>
            <v-card-text>
                <v-form v-model="valid" validate-on="blur">
                    <v-text-field v-model="nomeCliente" label="Nome" validate-on="blur" variant="outlined" required />

                    <v-text-field v-model="emailCliente" label="Email" validate-on="blur" variant="outlined" required />

                    <v-text-field v-model="contribuinteCliente" label="Contribuinte" type="number" validate-on="blur" variant="outlined"/>

                    <v-text-field v-model="moradaCliente" label="Morada" variant="outlined"/>

                    <v-select v-model="especialidade" :items="especialidades" item-title="name" item-value="id"
                        :return-object="false" label="Especialidade" variant="outlined" required />

                    <v-select v-model="seguroSelecionado" :items="seguros" item-title="name" item-value="id"
                        :return-object="false" label="Seguro" variant="outlined" required />

                    <v-text-field v-model="dataSelecionada" label="Data" type="date" variant="outlined" />

                    <v-select v-model="horaSelecionada" :items="horasDisponiveis" label="Hora" variant="outlined"/>

                    <v-btn @click="adicionarReserva" block class="mt-4">
                        Reservar
                    </v-btn>
                </v-form>
                <v-alert v-if="mensagem" :type="sucesso ? 'success' : 'error'" class="mt-4">
                    {{ mensagem }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const valid = ref(false);
const nomeCliente = ref('');
const emailCliente = ref('');
const contribuinteCliente = ref('');
const moradaCliente = ref('');
const especialidade = ref('');
const seguroSelecionado = ref('');
const dataSelecionada = ref('');
const horaSelecionada = ref('');
const mensagem = ref('');
const sucesso = ref(false);
const especialidades = ref([]);
const seguros = ref([]);
const horasDisponiveis = ref([]);

const gerarHoras = (inicio, fim) => {
    for (let h = inicio; h < fim; h++) {
        horasDisponiveis.value.push(`${String(h).padStart(2, '0')}:00`);
        horasDisponiveis.value.push(`${String(h).padStart(2, '0')}:30`);
    }
    horasDisponiveis.value.push(`${String(fim).padStart(2, '0')}:00`);
};

const adicionarReserva = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/adicionarReserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomeCliente: nomeCliente.value,
                emailCliente: emailCliente.value,
                contribuinteCliente: contribuinteCliente.value,
                moradaCliente: moradaCliente.value,
                especialidade: especialidade.value,
                seguro: seguroSelecionado.value,
                dataMarcacao: dataSelecionada.value,
                horaMarcacao: horaSelecionada.value,
            })
        });
        const data = await response.json();
        sucesso.value = !!data.success;
        mensagem.value = data.message;
    } catch (error) {
        mensagem.value = 'Erro ao fazer reserva. Verifique os dados e tente novamente.';
    }
};

const listarEspecialidades = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/listarEspecialidades');
        const data = await response.json();
        especialidades.value = data.data;
    } catch (error) {
        mensagem.value = `Erro ao listar especialidades: ${error.message}`;
    }
};

const listarSeguros = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/listarSeguros');
        const data = await response.json();
        seguros.value = data.data;
    } catch (error) {
        mensagem.value = `Erro ao listar seguros: ${error.message}`;
    }
};

onMounted(() => {
    listarEspecialidades();
    listarSeguros();
    gerarHoras(9, 18);
});
</script>

<style scoped>
h1 {
    color: #64942e;
}

.v-text-field:hover{
    color: orange;
}

.v-btn {
    background-color: #64942e;
    color: white;
}

.v-btn:hover {
    color: white;
    background-color: orange;
}
</style>