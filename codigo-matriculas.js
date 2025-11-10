document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.querySelector("#tabelaMatriculas tbody");
    const API_URL = 'https://partedobackend.onrender.com';

    async function carregarMatriculas() {
        tabela.innerHTML = '<tr><td colspan="3">Carregando matrículas...</td></tr>';
        try {
            const response = await fetch(`${API_URL}/alunos`);
            if (!response.ok) throw new Error('Erro ao buscar dados');

            const alunos = await response.json();

            const alunosMatriculados = alunos.filter(aluno => aluno.turmaID !== null);

            tabela.innerHTML = '';

            if (alunosMatriculados.length === 0) {
                tabela.innerHTML = '<tr><td colspan="3">Nenhum aluno matriculado encontrado.</td></tr>';
                return;
            }

            alunosMatriculados.forEach(aluno => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
          <td>${aluno.nome_aluno}</td>
          <td>${aluno.nome_turma}</td>
          <td>${aluno.turno}</td>
        `;
                tabela.appendChild(linha);
            });

        } catch (error) {
            console.error(error);
            tabela.innerHTML = '<tr><td colspan="3">Erro ao carregar matrículas.</td></tr>';
        }
    }

    carregarMatriculas();
});