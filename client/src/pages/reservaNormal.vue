<template>
    <v-container class="mt-5 cardReserva">
        <v-card>
            <v-card-title class="text-center">
                <h1>Fazer Reserva</h1>
            </v-card-title>
            <v-progress-linear :model-value="(currentStep / totalSteps) * 100" color="#64942e" height="6"
                class="mb-2" />
            <v-card-subtitle class="text-center mb-2">
                Passo {{ currentStep }} de {{ totalSteps }}
            </v-card-subtitle>
            <v-card-text>
                <v-form v-model="valid" validate-on="blur">
                    <div v-show="currentStep === 1">
                        <v-text-field v-model="nomeCliente" label="Nome" validate-on="blur" variant="outlined"
                            required />
                        <v-text-field v-model="emailCliente" label="Email" validate-on="blur" type="email"
                            variant="outlined" required />
                        <v-text-field v-model="telemovel" label="Telemovel" validade-on="blur" type="tel"
                            variant="outlined" required />
                        <v-text-field v-model="contribuinteCliente" label="Contribuinte" type="number"
                            validate-on="blur" variant="outlined" />
                    </div>
                    <div v-show="currentStep === 2">
                        <v-select v-model="especialidade" :items="especialidades" item-title="name" item-value="id"
                            :return-object="false" label="Especialidade" variant="outlined" required
                            @update:model-value="listarFuncionarios" />
                        <v-select v-model="funcionario" :items="funcionarios" item-title="name" item-value="id"
                            :return-object="false" label="Técnico" variant="outlined"
                            @update:model-value="listarFuncionarios">
                            <template v-slot:item="{ item, props }">
                                <v-list-item v-bind="props" :prepend-avatar="item.raw.img"></v-list-item>
                            </template>
                        </v-select>
                        <!--<v-select v-model="seguroSelecionado" :items="seguros" item-title="name" item-value="id"
                            :return-object="false" label="Seguro" variant="outlined" required />-->
                    </div>
                    <div v-show="currentStep === 3">
                        <p class="mb-1 text-caption text-medium-emphasis">Seleciona uma data</p>
                        <v-date-picker v-model="dataSelecionada" :allowed-dates="allowedDates" color="#64942e"
                            show-adjacent-months elevation="0" class="w-100 mb-4" />
                        <v-alert v-if="erroDia" type="error" density="compact" class="mb-3">
                            {{ erroDia }}
                        </v-alert>
                        <v-select v-model="horaSelecionada" :items="horasDisponiveis" label="Hora" variant="outlined" />
                    </div>
                    <div v-show="currentStep === 4">
                        <h1 class="text-center mb-5">Confirmar Marcação</h1>
                        <v-row class="justify-center">
                            <v-col cols="9">
                                <v-list>
                                    <v-list-item title="Nome" prepend-icon="mdi-account">{{ nomeCliente }}</v-list-item>
                                    <v-list-item title="Email" prepend-icon="mdi-email"> {{ emailCliente }}</v-list-item>
                                    <v-list-item title="telemovel" prepend-icon="mdi-phone">{{ telemovel }}</v-list-item>
                                    <v-list-item title="Contribuinte"  prepend-icon="mdi-account-details" > {{ contribuinteCliente }}</v-list-item>
                                    <v-list-item title="Especialidade" prepend-icon="mdi-stethoscope">{{ especialidades.find(e => e.id === especialidade)?.name}}</v-list-item>
                                    <v-list-item title="Funcionario" prepend-icon="mdi-account-tie"> {{ funcionarios.find(f => f.id === funcionario)?.name }}</v-list-item>
                                    <v-list-item title="Data" prepend-icon="mdi-calendar"> {{  dataSelecionada ? new Date(dataSelecionada).toLocaleDateString('pt-PT') : '' }}</v-list-item>
                                    <v-list-item title="Hora" prepend-icon="mdi-clock">{{ horaSelecionada }}</v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </div>
                    <v-progress-circular v-if="loading" indeterminate color="#64942e" />
                    <v-row class="mt-4">
                        <v-col>
                            <v-btn v-if="currentStep > 1" @click="currentStep--; mensagem = ''" variant="outlined"
                                block>
                                ← Anterior
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn v-if="currentStep < totalSteps" @click="avancar" block>
                                Próximo →
                            </v-btn>
                            <v-btn v-else @click="adicionarReserva" block>
                                Reservar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-alert v-if="mensagem" :type="sucesso ? 'success' : 'error'" class="mt-4">
                    {{ mensagem }}
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const valid = ref(false);
const currentStep = ref(1);
const totalSteps = 4;

const nomeCliente = ref('');
const emailCliente = ref('');
const contribuinteCliente = ref('');
const moradaCliente = ref('');
const especialidade = ref('');
const funcionario = ref('');
const seguroSelecionado = ref('');
const dataSelecionada = ref('');
const horaSelecionada = ref('');
const mensagem = ref('');
const sucesso = ref(false);
const especialidades = ref([]);
const funcionarios = ref([]);
const seguros = ref([]);
const todasHoras = ref([]);
const horasDisponiveis = ref([]);
const datasOcupadas = ref([]);
const erroDia = ref('');
const telemovel = ref('');
let loading = ref(false);

const diasNaoTrabalha = ref({
    naotrabalhasabados: false,
    naotrabalhadomingos: false,
    naotrabalhasegundas: false,
    naotrabalhatercas: false,
    naotrabalhaQuartas: false,
    naotrabalhaQuintas: false,
    naotrabalhasextas: false,
});

const allowedDates = (date) => {
    const dataFormatada = new Date(date).toISOString().split('T')[0];
    const hoje = new Date().toISOString().split('T')[0];
    if (dataFormatada < hoje) return false;
    if (datasOcupadas.value.includes(dataFormatada)) return false;
    return true;
};

const avancar = () => {
    if (currentStep.value === 1 && (!nomeCliente.value || !emailCliente.value || !telemovel.value)) {
        mensagem.value = 'Preencha o nome, email e telemovel para continuar.';
        sucesso.value = false;
        return;
    }
    if (currentStep.value === 2 && (!especialidade.value)) {
        mensagem.value = 'Selecione a especialidade e o seguro para continuar.';
        sucesso.value = false;
        return;
    }
    mensagem.value = '';
    currentStep.value++;
};

const gerarHoras = (inicio, fim) => {
    todasHoras.value = [];
    for (let h = inicio; h < fim; h++) {
        todasHoras.value.push(`${String(h).padStart(2, '0')}:00`);
        todasHoras.value.push(`${String(h).padStart(2, '0')}:30`);
    }
    todasHoras.value.push(`${String(fim).padStart(2, '0')}:00`);
    horasDisponiveis.value = [...todasHoras.value];
};

const buscarDatasOcupadas = async (funcionarioId) => {
    if (!funcionarioId) return;
    try {
        const response = await fetch(`/api/buscarDisponibilidade?funcionario=${funcionarioId}`);
        const data = await response.json();

        if (!data.success || !data.data) return;

        const eventos = data.data;
        const ocupadasPorDia = {};
        eventos.forEach(evento => {
            const dia = evento.data;
            if (!ocupadasPorDia[dia]) ocupadasPorDia[dia] = [];
            ocupadasPorDia[dia].push(evento.horaInicio);
        });

        datasOcupadas.value = Object.keys(ocupadasPorDia).filter(dia =>
            todasHoras.value.every(hora => ocupadasPorDia[dia].includes(hora))
        );


    } catch (error) {
        console.log(error);
    }
};


const buscarDatasOcupadasGeral = async (especialidadeId) => {
    if (!especialidadeId) return;
    try {
        const response = await fetch(`/api/buscarDisponibilidadeGeral?especialidade=${especialidadeId}`);
        const data = await response.json();
        const eventos = data.data;

        const ocupadasPorDia = {};
        eventos.forEach(evento => {
            const dia = evento.data;
            if (!ocupadasPorDia[dia]) ocupadasPorDia[dia] = [];
            ocupadasPorDia[dia].push(evento.horaInicio);
        });

        datasOcupadas.value = Object.keys(ocupadasPorDia).filter(dia =>
            todasHoras.value.every(hora => ocupadasPorDia[dia].includes(hora))
        );
    } catch (error) {
        console.log(error);
    }
};

const verificarDia = async () => {
    if (!dataSelecionada.value) return;

    const dataFormatada = new Date(dataSelecionada.value).toISOString().split('T')[0];
    const diaSemana = new Date(dataSelecionada.value).getDay();

    const mapa = {
        0: diasNaoTrabalha.value.naotrabalhadomingos,
        1: diasNaoTrabalha.value.naotrabalhasegundas,
        2: diasNaoTrabalha.value.naotrabalhatercas,
        3: diasNaoTrabalha.value.naotrabalhaQuartas,
        4: diasNaoTrabalha.value.naotrabalhaQuintas,
        5: diasNaoTrabalha.value.naotrabalhasextas,
        6: diasNaoTrabalha.value.naotrabalhasabados,
    };

    const nomes = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    if (mapa[diaSemana]) {
        erroDia.value = `Não há atendimento às ${nomes[diaSemana]}s`;
        dataSelecionada.value = '';
        horasDisponiveis.value = [...todasHoras.value];
        return;
    }

    erroDia.value = '';

    try {
        let url;
        if (funcionario.value) {
            url = `/api/horasOcupadas?data=${dataFormatada}&userId=${funcionario.value}`;
        } else {
            url = `/api/horasOcupadasGeral?data=${dataFormatada}&especialidade=${especialidade.value}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        horasDisponiveis.value = todasHoras.value.filter(h => !data.data.includes(h));
    } catch (error) {
        console.log(error);
        horasDisponiveis.value = [...todasHoras.value];
    }
};

const carregarDefinicoes = async () => {
    try {
        const response = await fetch('/api/adminPage');
        const data = await response.json();
        if (data.success) {
            diasNaoTrabalha.value = {
                naotrabalhasabados: data.data.naotrabalhasabados,
                naotrabalhadomingos: data.data.naotrabalhadomingos,
                naotrabalhasegundas: data.data.naotrabalhasegundas,
                naotrabalhatercas: data.data.naotrabalhatercas,
                naotrabalhaQuartas: data.data.naotrabalhaQuartas,
                naotrabalhaQuintas: data.data.naotrabalhaQuintas,
                naotrabalhasextas: data.data.naotrabalhasextas,
            };
        }
    } catch (error) {
        console.log(error);
    }
};

const adicionarReserva = async () => {
    loading = true;
    if (erroDia.value) return;

    const dataFormatada = dataSelecionada.value
        ? new Date(dataSelecionada.value).toISOString().split('T')[0]
        : null;

    try {

        const response = await fetch('/api/adicionarReserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomeCliente: nomeCliente.value,
                emailCliente: emailCliente.value,
                contribuinteCliente: contribuinteCliente.value,
                moradaCliente: moradaCliente.value,
                especialidade: especialidade.value,
                seguro: seguroSelecionado.value,
                dataMarcacao: dataFormatada,
                horaMarcacao: horaSelecionada.value,
                userId: funcionario.value,
                telemovel: telemovel.value,
            })
        });
        const data = await response.json();
        sucesso.value = !!data.success;
        mensagem.value = data.message;

        if (data.success) {
            loading = false;
            horaSelecionada.value = '';
            setTimeout(() => {
                mensagem.value = '';
                sucesso.value = false;
                router.push('/');
            }, 4000);
        }
    } catch (error) {
        mensagem.value = `Erro ao fazer reserva. Verifique os dados e tente novamente. ${error}`;
    }
};


const listarFuncionarios = async () => {
    try {
        const response = await fetch(`/api/listarFuncionarios?especialidade=${especialidade.value}`);
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            funcionarios.value = [];
            mensagem.value = 'Não há funcionários nesta especialidade';
            return;
        }
        funcionarios.value = data.data;
        mensagem.value = '';
    } catch (error) {
        mensagem.value = `Erro ao listar funcionários: ${error.message}`;
    }
};

const listarEspecialidades = async () => {
    try {
        const response = await fetch('/api/listarEspecialidades');
        const data = await response.json();
        especialidades.value = data.data;
    } catch (error) {
        mensagem.value = `Erro ao listar especialidades: ${error.message}`;
    }
};

const listarSeguros = async () => {
    try {
        const response = await fetch('/api/listarSeguros');
        const data = await response.json();
        seguros.value = data.data;
    } catch (error) {
        mensagem.value = `Erro ao listar seguros: ${error.message}`;
    }
};

watch(especialidade, async (novo) => {
    if (novo) {
        funcionario.value = '';
        funcionarios.value = [];
        await listarFuncionarios();
        await buscarDatasOcupadasGeral(novo);
        dataSelecionada.value = '';
        horasDisponiveis.value = [...todasHoras.value];
    }
});

watch(funcionario, async (novo) => {
    dataSelecionada.value = '';
    horasDisponiveis.value = [...todasHoras.value];
    if (novo) {
        await buscarDatasOcupadas(novo);
    } else {
        await buscarDatasOcupadasGeral(especialidade.value);
    }
});

watch(dataSelecionada, async (novaData) => {
    if (novaData) {
        await verificarDia();
    }
}, { immediate: true });

watch(currentStep, async (novoStep) => {
    if (novoStep === 4) {
        if (funcionario.value) {
            await buscarDatasOcupadas(funcionario.value);
        } else {
            await buscarDatasOcupadasGeral(especialidade.value);
        }
        if (dataSelecionada.value) {
            await verificarDia();
        }
    }
});

onMounted(async () => {
    await listarEspecialidades();
    await listarSeguros();
    gerarHoras(9, 18);
    await carregarDefinicoes();
});
</script>

<style scoped>
h1 {
    color: #64942e;
}

.v-btn {
    background-color: #64942e;
    color: white;
}

.v-btn:hover {
    color: white;
    background-color: orange;
}

.cardReserva{
    height: 100vh;
    width: 100vw;
}
</style>