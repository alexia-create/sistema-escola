const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");


const API_URL = 'https://partedobackend.onrender.com';


async function carregarAlunos() {
    tabela.innerHTML = '<tr><td colspan="9">Carregando alunos...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/alunos`);
        if (!response.ok) {
            throw new Error('Erro ao buscar alunos');
        }
        const alunos = await response.json();
        tabela.innerHTML = '';

        if (alunos.length === 0) {
            tabela.innerHTML = '<tr><td colspan="9">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(adicionarLinha);

    } catch (error) {
        console.error(error);
        tabela.innerHTML = '<tr><td colspan="9">Erro ao carregar alunos.</td></tr>';
    }
}


function adicionarLinha(aluno) {
    const novaLinha = document.createElement("tr");
    novaLinha.classList.add("fade-in");
    novaLinha.dataset.id = aluno.id;

    novaLinha.innerHTML = `
    <td>${aluno.nome_aluno}</td>
    <td>${aluno.data_nascimento}</td>
    <td>${aluno.nome_pai}</td>
    <td>${aluno.nome_mae}</td>
    <td>${aluno.email}</td>
    <td>${aluno.telefone}</td>
    <td>${aluno.curso || 'N/A'}</td> 
    <td>${aluno.turno || 'N/A'}</td>
    <td>
      <button class="delete-btn">
        <img src="lixeira.png" alt="Excluir" class="icon-lixeira">
      </button>
    </td>
  `;

    novaLinha.querySelector(".delete-btn").addEventListener("click", async () => {
        const idParaDeletar = aluno.id;

        if (!confirm(`Tem certeza que deseja excluir ${aluno.nome_aluno}?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/alunos/${idParaDeletar}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                novaLinha.remove();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar com o servidor para deletar.');
        }
    });

    tabela.appendChild(novaLinha);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAluno = {
        nome: document.getElementById("nome").value.trim(),
        dataNascimento: document.getElementById("dataNascimento").value,
        pai: document.getElementById("nomePai").value.trim(),
        mae: document.getElementById("nomeMae").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
    };

    if (!dadosAluno.nome || !dadosAluno.mae || !dadosAluno.dataNascimento) {
        alert("Por favor, preencha Nome, Data de Nascimento e Nome da Mãe!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAluno),
        });

        const data = await response.json();

        if (response.status === 201) {
            alert(data.message);
            carregarAlunos();
            form.reset();
        } else {
            alert(`Erro: ${data.message}`);
        }

    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});

carregarAlunos();
