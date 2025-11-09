const formTurma = document.getElementById("formTurma");
const tabelaTurmas = document.querySelector("#tabelaTurmas tbody");


const API_URL = 'https://partedobackend.onrender.com';


async function carregarTurmas() {
    tabelaTurmas.innerHTML = '<tr><td colspan="4">Carregando turmas...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/turmas`);
        if (!response.ok) {
            throw new Error('Erro ao buscar turmas');
        }
        const turmas = await response.json();
        tabelaTurmas.innerHTML = '';

        if (turmas.length === 0) {
            tabelaTurmas.innerHTML = '<tr><td colspan="4">Nenhuma turma cadastrada.</td></tr>';
            return;
        }

        turmas.forEach(turma => criarLinha(turma.nome_turma, turma.codigo_turma, turma.turno));

    } catch (error) {
        console.error(error);
        tabelaTurmas.innerHTML = '<tr><td colspan="4">Erro ao carregar turmas.</td></tr>';
    }
}

function criarLinha(nome, codigo, turno) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
    <td>${nome}</td>
    <td>${codigo}</td>
    <td>${turno}</td>
    <td><button class="delete-btn">Excluir</button></td>
  `;

    linha.querySelector(".delete-btn").addEventListener("click", () => {
        alert('Função de deletar turma não implementada no backend.');
    });

    tabelaTurmas.appendChild(linha);
}

formTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosTurma = {
        nome: document.getElementById("nomeTurma").value.trim(),
        codigo: document.getElementById("codigoTurma").value.trim(),
        turno: document.getElementById("turnoTurma").value
    };

    if (!dadosTurma.nome || !dadosTurma.codigo || !dadosTurma.turno) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/turmas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosTurma),
        });

        const data = await response.json();

        if (response.status === 201) {
            alert(data.message);
            criarLinha(dadosTurma.nome, dadosTurma.codigo, dadosTurma.turno);
            formTurma.reset();
        } else {
            alert(`Erro: ${data.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com o servidor.');
    }
});

carregarTurmas();