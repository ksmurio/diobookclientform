<template>
    <v-app-bar>
        <v-row>
            <v-col cols="12" class="d-flex justify-center">
                <v-icon>
                    <img src="../uploads/logo.png" height="50px"  @click="home()">
                </v-icon>
            </v-col>
        </v-row>

    </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const home = async() =>{
    router.push('/');
}
</script>