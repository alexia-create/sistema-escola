const form = document.querySelector(".form-container form");
const emailInput = document.querySelector("input[type='email']");
const passwordInput = document.querySelector("input[type='password']");


const API_URL = 'https://partedobackend.onrender.com';

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Por favor, preencha todos os campos!");
        return;
    }


    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Login bem-sucedido! Bem-vindo(a), ${data.user.nome}`);


            localStorage.setItem('usuarioLogado', JSON.stringify(data.user));


            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        alert('Não foi possível conectar ao servidor. Tente novamente.');
    }
});

const forgotPassword = document.querySelector(".forgot-password");
forgotPassword.addEventListener("click", () => {
    const email = prompt("Digite seu email para recuperar a senha:");
    if (email) {
        alert(`Enviamos um link de recuperação para ${email}`);
    }
});