let candidatos = [];

// ===============================
// CARREGAR CANDIDATOS
// ===============================

function carregarCandidatos() {
  fetch("candidatos.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Não foi possível carregar candidatos.json");
      }

      return response.json();
    })
    .then((data) => {
      candidatos = data["PDC"] || [];
      preencherLista();
    })
    .catch((error) => {
      console.error("Erro ao carregar candidatos:", error);

      document.getElementById("msgErroPartido").textContent =
        "Erro ao carregar a lista de candidatos.";
    });
}

// ===============================
// PREENCHER LISTA
// ===============================

function preencherLista() {
  const lista = document.getElementById("lstCandidatos");

  lista.innerHTML = "";

  candidatos.forEach((candidato, indice) => {
    const option = document.createElement("option");

    option.value = indice;
    option.textContent = candidato.nome;

    lista.appendChild(option);
  });
}

// ===============================
// PROCESSAR PARTIDO
// ===============================

function processarPartido() {
  const numeroPartido = document
    .getElementById("txtNumeroPartido")
    .value.trim();

  const msgErro = document.getElementById("msgErroPartido");
  const lista = document.getElementById("lstCandidatos");
  const painel = document.getElementById("painelCandidato");

  msgErro.textContent = "";

  lista.innerHTML = "";

  painel.style.display = "none";

  if (numeroPartido !== "93") {
    msgErro.textContent = "Partido inválido. O número do PDC é 93.";

    document.getElementById("lblNomePartido").innerHTML = "<b>---</b>";

    return;
  }

  document.getElementById("lblNomePartido").innerHTML = "<b>PDC</b>";

  carregarCandidatos();
}

// ===============================
// SELECIONAR CANDIDATO
// ===============================

function selecionarCandidato() {
  const indice = document.getElementById("lstCandidatos").value;

  const candidato = candidatos[indice];

  if (!candidato) {
    return;
  }

  const cargo = document.getElementById("lstCargos").value;

  const numeroCandidato = document
    .getElementById("txtNumeroCandidato")
    .value.trim();

  // Preenche informações
  document.getElementById("infoNome").textContent = candidato.nome;

  document.getElementById("infoCargo").textContent = cargo || "-";

  document.getElementById("infoNumero").textContent = numeroCandidato || "-";

  // ===============================
  // CARREGAR FOTO
  // ===============================

  const imgElement = document.getElementById("infoFoto");

  imgElement.src = candidato.foto;
  imgElement.alt = candidato.nome;

  // Mostra erro caso a imagem não carregue
  imgElement.onerror = function () {
    console.error("Erro ao carregar imagem:", candidato.foto);

    this.alt = "Imagem não encontrada";
  };

  imgElement.onload = function () {
    console.log("Imagem carregada:", candidato.foto);
  };

  // Mostra painel
  document.getElementById("painelCandidato").style.display = "block";
}

// ===============================
// VALIDAR NÚMERO
// ===============================

function validarNumeroCandidato(numero, cargo) {
  // Precisa começar com 93
  if (!numero.startsWith("93")) {
    return false;
  }

  // Apenas números
  if (!/^\d+$/.test(numero)) {
    return false;
  }

  if (cargo === "Presidente") {
    return numero.length === 4;
  }

  if (cargo === "Senador(a)") {
    return numero.length === 5;
  }

  if (cargo === "Governador(a)" || cargo === "Deputado(a) Federal") {
    return numero.length === 6;
  }

  if (cargo === "Deputado(a) Estadual") {
    return numero.length === 7;
  }

  return false;
}

// ===============================
// REGISTRAR CANDIDATURA
// ===============================

function registrarCandidatura() {
  const candidatoIndice = document.getElementById("lstCandidatos").value;

  const candidato = candidatos[candidatoIndice];

  const cargo = document.getElementById("lstCargos").value;

  const numero = document.getElementById("txtNumeroCandidato").value.trim();

  const msgErro = document.getElementById("msgErroNumero");

  const feedback = document.getElementById("msgFeedbackAcao");

  msgErro.textContent = "";
  feedback.textContent = "";

  if (!candidato) {
    feedback.textContent = "Selecione um candidato.";

    feedback.className = "erro";

    return;
  }

  if (!validarNumeroCandidato(numero, cargo)) {
    msgErro.textContent =
      "Número do candidato inválido para o cargo selecionado.";

    return;
  }

  // Atualiza o número mostrado
  document.getElementById("infoNumero").textContent = numero;

  feedback.textContent = "Candidatura registrada com sucesso!";

  feedback.className = "sucesso";
}

// ===============================
// ENVIAR AO TSE
// ===============================

function gravarEEnviarTSE() {
  const feedback = document.getElementById("msgFeedbackAcao");

  const candidatoIndice = document.getElementById("lstCandidatos").value;

  const candidato = candidatos[candidatoIndice];

  if (!candidato) {
    feedback.textContent = "Selecione um candidato antes de enviar.";

    feedback.className = "erro";

    return;
  }

  feedback.textContent = "Dados preparados para envio ao TSE.";

  feedback.className = "sucesso";
}

// ===============================
// INICIALIZAÇÃO
// ===============================

console.log("Sistema PDC carregado.");
