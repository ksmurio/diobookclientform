import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    persist: true,
    state: () => ({
        admin: null,
        token: null,
        isAuthenticated: false,
    }),
    getters: {
        isAdmin: (state) => state.isAuthenticated && state.admin?.role === 'admin',
        nomeAdmin: (state) => state.admin?.name || '',
    },
    actions: {
        async login(username, senha) {
            try {
                const response = await fetch('http://localhost:3000/api/loginAdmin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, senha }),
                });
                const data = await response.json();
                if (data.success) {
                    this.admin = data.admin;
                    this.token = data.token;
                    this.isAuthenticated = true;
                }
                return data;
            } catch (error) {
                return { success: false, message: 'Erro ao fazer login' };
            }
        },
        logout() {
            this.admin = null;
            this.token = null;
            this.isAuthenticated = false;
        },
    },
});