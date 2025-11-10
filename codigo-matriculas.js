(function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Acesso negado. Por favor, faça o login.');
        window.location.href = 'index.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Agora selecionamos o 'container' em vez da 'tabela'
    const container = document.querySelector("#relatorio-container");
    const API_URL = 'https://partedobackend.onrender.com';

    async function carregarMatriculas() {
        container.innerHTML = '<p style="text-align: center;">Carregando matrículas...</p>';
        try {
            const response = await fetch(`${API_URL}/alunos`);
            if (!response.ok) throw new Error('Erro ao buscar dados');

            const alunos = await response.json();
            const alunosMatriculados = alunos.filter(aluno => aluno.turmaID !== null);

            if (alunosMatriculados.length === 0) {
                container.innerHTML = '<p style="text-align: center;">Nenhum aluno matriculado encontrado.</p>';
                return;
            }

            const gruposDeTurma = {};
            alunosMatriculados.forEach(aluno => {
                const turmaNome = aluno.nome_turma;

                if (!gruposDeTurma[turmaNome]) {
                    gruposDeTurma[turmaNome] = {
                        turno: aluno.turno,
                        alunos: []
                    };
                }
                gruposDeTurma[turmaNome].alunos.push(aluno);
            });

            container.innerHTML = '';

            const turmasOrdenadas = Object.keys(gruposDeTurma).sort();

            for (const nomeTurma of turmasOrdenadas) {
                const grupo = gruposDeTurma[nomeTurma];

                const titulo = document.createElement('h3');
                titulo.className = 'turma-title'; // Usa o CSS que criamos
                titulo.textContent = `${nomeTurma} (${grupo.turno})`;
                container.appendChild(titulo);

                const tabela = document.createElement('table');
                tabela.innerHTML = `
          <thead>
            <tr>
              <th>Nome do Aluno</th>
              <th>Data de Nascimento</th>
              <th>Nome da Mãe</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        `;

                const tbody = tabela.querySelector('tbody');

                grupo.alunos.forEach(aluno => {
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
            <td>${aluno.nome_aluno}</td>
            <td>${aluno.data_nascimento}</td>
            <td>${aluno.nome_mae}</td>
          `;
                    tbody.appendChild(linha);
                });

                container.appendChild(tabela);
            }

        } catch (error) {
            console.error(error);
            container.innerHTML = '<p style="text-align: center; color: red;">Erro ao carregar matrículas.</p>';
        }
    }

    carregarMatriculas();
});