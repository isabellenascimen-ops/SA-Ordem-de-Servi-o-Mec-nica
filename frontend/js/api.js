const API_URL = '../../backend/api.php';

async function apiRequest(url = API_URL, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    return await response.json();
}

const Auth = {
    login(email, senha) {
        return apiRequest(`${API_URL}?recurso=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });
    },

    exigir() {
        const usuario = sessionStorage.getItem('emu_auth');

        if (!usuario) {
            window.location.href = 'login.html';
            return null;
        }

        return JSON.parse(usuario);
    },

    logout() {
        sessionStorage.removeItem('emu_auth');
        window.location.href = 'login.html';
    }
};