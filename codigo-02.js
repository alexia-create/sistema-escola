const tabela = document.getElementById("tabelaAlunos");

function renderTabela() {
  tabela.innerHTML = "";
  alunos.forEach((aluno, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.matricula}</td>
      <td>${aluno.serie}</td>
      <td>${aluno.turma}</td>
      <td>${aluno.professor}</td>
      <td class="status">
        <span class="${aluno.matriculado ? 'ativo' : 'inativo'}">
          ${aluno.matriculado ? "✅ Matriculado" : "❌ Não Matriculado"}
        </span>
        <button onclick="alternarStatus(${index})">Editar</button>
      </td>
      <td>${aluno.vagas}</td>
      <td><input type="text" value="${aluno.obs}" oninput="atualizarObs(${index}, this.value)"></td>
    `;

    tabela.appendChild(tr);
  });
}

function alternarStatus(index) {
  alunos[index].matriculado = !alunos[index].matriculado;
  renderTabela();
}

function atualizarObs(index, texto) {
  alunos[index].obs = texto;
}

renderTabela();
