const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");
const submitBtn = document.querySelector(".submit-btn"); // Pega o botão de submit

const API_URL = 'https://partedobackend.onrender.com';

let idEmEdicao = null;


async function carregarAlunos() {
    tabela.innerHTML = '<tr><td colspan="9">Carregando alunos...</td></tr>';
    try {
        const response = await fetch(`${API_URL}/alunos`);
        if (!response.ok) throw new Error('Erro ao buscar alunos');
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
    <td>${aluno.nome_pai || 'N/A'}</td>
    <td>${aluno.nome_mae}</td>
    <td>${aluno.email || 'N/A'}</td>
    <td>${aluno.telefone || 'N/A'}</td>
    <td>${aluno.curso || 'N/A'}</td> 
    <td>${aluno.turno || 'N/A'}</td>
    <td>
      <button class="edit-btn">Editar</button> 
      <button class="delete-btn">
        <img src="lixeira.png" alt="Excluir" class="icon-lixeira">
      </button>
    </td>
  `;

    novaLinha.querySelector(".edit-btn").addEventListener("click", () => {

        window.scrollTo(0, 0);

        document.getElementById("nome").value = aluno.nome_aluno;
        document.getElementById("dataNascimento").value = aluno.data_nascimento;
        document.getElementById("nomePai").value = aluno.nome_pai;
        document.getElementById("nomeMae").value = aluno.nome_mae;
        document.getElementById("email").value = aluno.email;
        document.getElementById("telefone").value = aluno.telefone;

        idEmEdicao = aluno.id;

        submitBtn.textContent = "Salvar Alterações";
    });

    novaLinha.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm(`Tem certeza que deseja excluir ${aluno.nome_aluno}?`)) return;
        try {
            const response = await fetch(`${API_URL}/alunos/${aluno.id}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                carregarAlunos();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor para deletar.');
        }
    });

    tabela.appendChild(novaLinha);
}

function resetarFormulario() {
    form.reset();
    idEmEdicao = null;
    submitBtn.textContent = "Cadastrar Aluno";
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
        endereco: null
    };

    if (!dadosAluno.nome || !dadosAluno.mae || !dadosAluno.dataNascimento) {
        alert("Por favor, preencha Nome, Data de Nascimento e Nome da Mãe!");
        return;
    }

    if (idEmEdicao) {
        try {
            const response = await fetch(`${API_URL}/alunos/${idEmEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAluno),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                resetarFormulario();
                carregarAlunos();
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor para atualizar.');
        }
    } else {
        try {
            const response = await fetch(`${API_URL}/alunos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAluno),
            });
            const data = await response.json();
            if (response.status === 201) {
                alert(data.message);
                resetarFormulario();
                carregarAlunos();
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            alert('Erro ao conectar ao servidor para cadastrar.');
        }
    }
});

carregarAlunos();