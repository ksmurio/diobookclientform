<template>
    <v-container class="mt-5">
        <v-card class="text-center">
            <v-card-title><h1>Bem vindo</h1></v-card-title>
            <v-card-text class="text-center">
                <v-row class="justify-center">
                    <v-col cols="6">
                        <v-text-field v-model="linkInstagram" label="Link Instagram"></v-text-field>
                        <v-btn @click="guardarLinks" color="success">Salvar</v-btn>

                        <v-alert>{{ mensagem }}</v-alert>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
const mensagem =  ref('');
const linkInstagram = ref('');
const defautlink = "https://meulink";

const guardarLinks = async () => {
try{
    if(!linkInstagram.value){
        mensagem.value = "Nenhum link preenchido";
    }

    const response = await fetch('http://localhost:3000/api/adminPage',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id_admin: 1,
            link_instagram: linkInstagram,
        })
    });

    if(!response){
        mensagem.value = "Erro ao salvar links"
    }

    mensagem.value = "links salvos";
}catch(error){
    console.log({success:false, message:'Não foi possivel guardar links', error:error.message})
}
}

</script>