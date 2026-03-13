<template>
    <v-container class="mt-5" max-width="600">
        <v-card>
            <v-card-title class="text-center"><h1>Fazer Reserva</h1></v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-card @click="$router.push('/reservaRapida')" hover class="pa-4 mb-3 text-center">
                            <v-icon size="32" color="#64942e">mdi-lightning-bolt</v-icon>
                            <div class="text-h6 mt-2">Marcação Rápida</div>
                            <div class="text-caption text-medium-emphasis">Nome, email, especialidade e hora</div>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card @click="$router.push('/reservaNormal')" hover class="pa-4 mb-3 text-center">
                            <v-icon size="32" color="#64942e">mdi-calendar-check</v-icon>
                            <div class="text-h6 mt-2">Marcação Normal</div>
                            <div class="text-caption text-medium-emphasis">Todos os dados</div>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-card @click="$router.push('/profissionalIndiferente')" hover class="pa-4 text-center">
                            <v-icon size="32" color="#64942e">mdi-account-question</v-icon>
                            <div class="text-h6 mt-2">Profissional Indiferente</div>
                            <div class="text-caption text-medium-emphasis">Primeiro disponível</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
