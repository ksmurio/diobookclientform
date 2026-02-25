<template>
    <v-container class="mt-5" max-width="600">
        <v-card>
            <v-card-title class="text-center"><h1>Fazer Reserva</h1></v-card-title>
            <v-card-text>
                <v-form v-model="valid" validate-on="blur">
                    <v-text-field v-model="nomeCliente" label="Nome" :rules="regrasNome" validate-on="blur" required />

                    <v-text-field v-model="emailCliente" label="Email" :rules="regrasEmail"  validate-on="blur" required />

                    <v-text-field v-model="contribuinteCliente" label="Contribuinte" type="number"  :rules="regrasContribuinte"  validate-on="blur"/>

                    <v-text-field v-model="moradaCliente" label="morada" :rules="regrasMorada" required />

                    <v-select v-model="especialidade" :items="especialidades" item-title="name" item-value="id" :return-object="false" label="Especialidade"  required />

                    <v-switch inset v-model="seguro" color="success" label="Possuo Seguro" hide-details />

                    <v-date-picker class="mx-auto" v-model="dataSelecionada"></v-date-picker>

                    <v-btn @click="adicionarReserva" color="primary" block class="mt-4">
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
import { regrasNome, regrasEmail, regrasContribuinte, regrasMorada } from '../rules/inputRules';


const nomeCliente = ref('');
const emailCliente = ref('');
const contribuinteCliente = ref('');
const moradaCliente = ref('');
const especialidade = ref('');
const seguro = ref(false);
const dataSelecionada = ref(new Date());
const mensagem = ref('')
const sucesso = ref(false);

const especialidades = ref([]);

const adicionarReserva = async () => {
    const result = formRef.value.validate();
    if(!result) {
        mensagem.value = 'Preencha todos os campos corretamente.';
        return;
    }
    
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
                seguro: seguro.value,
                data:  dataSelecionada.value ? new Date(dataSelecionada.value).toISOString().split('T')[0] : ''
            })
        });
        const data = await response.json();
        if(data.success) {
            sucesso.value = true;
        }else{
            sucesso.value = false;
        }

        mensagem.value = data.message;
    } catch (error) {
        mensagem.value = 'Erro ao fazer reserva. verifique os dados e tente novamente.';
    }
} 

const listarEspecialidades = async () => {
    try{
        const response =  await fetch('http://localhost:3000/api/listarEspecialidades',{
            method: 'GET',
        });

        const data = await response.json();

        especialidades.value = data.data;
        console.log(especialidades.value)
    }catch(error){
        mensagem.value = `Erro ao listar especialidades: ${error.message}`;
    }
}

onMounted(() => {
    listarEspecialidades();

});

</script>
