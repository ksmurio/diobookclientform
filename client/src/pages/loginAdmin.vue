<template>
    <v-container class="fill-height d-flex justify-center align-center"  >
        <v-card min-width="500" min-height="500">
            <v-card-title>Admin Login</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field label="Username" v-model="username" required/>
                    <v-text-field label="Senha" type="password" v-model="senha" required/>
                    <v-btn @click="loginAdmin">Login</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');              
const senha = ref('');

const loginAdmin = async () => {
    try{
        const response = await fetch('http://localhost:3000/api/loginAdmin',{
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                senha: senha.value,
            })
        });

        if (!response.ok) {
            const text = await response.text(); // pega o que veio
            console.log(text);
        }

        const data = await response.json();
        if(data.success){
            console.log('Login successful');
            router.push('/adminPage');
        }else{
            console.log('Login failed:', data.message);
        }
    }catch(error){
        console.log({success: false, message: 'Não foi possivel logar como admin'});
    }
}
</script>