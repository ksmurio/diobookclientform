const regrasNome = [
    v => !!v || 'Nome é obrigatorio',
    v => /^[a-zA-ZÀ-ÿ\s   b sczqDQlL-]+$/.test(v) || 'Nome inválido',
]

const regrasEmail = [
    v => !!v || '',
    v => /.+@.+\..+/.test(v) || 'Email inválido',
]

const regrasContribuinte = [
    v => /^\d{9}$/.test(v) || 'Contribuinte deve conter 9 digitos',
    v => /^[1-9]\d{8}$/.test(v) || 'Contribuinte não pode começar com 0',
]

const regrasMorada = [
    v => v.length > 10 || 'Muito curta',   
]

export {regrasNome, regrasEmail, regrasContribuinte, regrasMorada}
