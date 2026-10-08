let candidatos = [];
let candidatoSelecionado = null;
let registros = [];

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

function preencherLista() {
  const lista = document.getElementById("listaCandidatos");

  lista.innerHTML = "";

  candidatos.forEach((candidato, indice) => {
    const card = document.createElement("div");

    card.className = "candidato";

    card.innerHTML = `
      <img src="${candidato.foto}" alt="${candidato.nome}">
      <p>${candidato.nome}</p>
    `;

    card.onclick = function () {
      selecionarCandidato(indice);
    };

    lista.appendChild(card);
  });
}

function processarPartido() {
  const numeroPartido = document
    .getElementById("txtNumeroPartido")
    .value.trim();

  const msgErro = document.getElementById("msgErroPartido");
  const painel = document.getElementById("painelCandidato");

  msgErro.textContent = "";

  painel.style.display = "none";

  if (numeroPartido !== "93") {
    msgErro.textContent = "Partido inválido. O número do PDC é 93.";

    document.getElementById("lblNomePartido").innerHTML = "<b>---</b>";

    document.getElementById("listaCandidatos").innerHTML = "";

    return;
  }

  document.getElementById("lblNomePartido").innerHTML = "<b>PDC</b>";

  carregarCandidatos();
}

function selecionarCandidato(indice) {
  const candidato = candidatos[indice];

  if (!candidato) {
    return;
  }

  candidatoSelecionado = candidato;

  const cards = document.querySelectorAll(".candidato");

  cards.forEach((card) => {
    card.classList.remove("selecionado");
  });

  cards[indice].classList.add("selecionado");

  const cargo = document.getElementById("lstCargos").value;

  const numeroCandidato = document
    .getElementById("txtNumeroCandidato")
    .value.trim();

  document.getElementById("infoNome").textContent = candidato.nome;

  document.getElementById("infoCargo").textContent = cargo || "-";

  document.getElementById("infoNumero").textContent =
    numeroCandidato || "-";

  const imgElement = document.getElementById("infoFoto");

  imgElement.src = candidato.foto;

  imgElement.alt = candidato.nome;

  document.getElementById("painelCandidato").style.display = "block";
}

function validarNumeroCandidato(numero, cargo) {
  if (!numero.startsWith("93")) {
    return false;
  }

  if (!/^\d+$/.test(numero)) {
    return false;
  }

  if (cargo === "Presidente") {
    return numero.length === 4;
  }

  if (cargo === "Senador(a)") {
    return numero.length === 5;
  }

  if (
    cargo === "Governador(a)" ||
    cargo === "Deputado(a) Federal"
  ) {
    return numero.length === 6;
  }

  if (cargo === "Deputado(a) Estadual") {
    return numero.length === 7;
  }

  return false;
}

function registrarCandidatura() {
  const cargo = document.getElementById("lstCargos").value;

  const numero = document
    .getElementById("txtNumeroCandidato")
    .value.trim();

  const msgErro = document.getElementById("msgErroNumero");

  const feedback = document.getElementById("msgFeedbackAcao");

  msgErro.textContent = "";

  feedback.textContent = "";

  if (!candidatoSelecionado) {
    feedback.textContent = "Selecione um candidato.";

    feedback.className = "erro";

    return;
  }

  if (!validarNumeroCandidato(numero, cargo)) {
    msgErro.textContent =
      "Número do candidato inválido para o cargo selecionado.";

    return;
  }

  const registro = {
    nome: candidatoSelecionado.nome,
    cargo: cargo,
    numero: numero
  };

  registros.push(registro);

  document.getElementById("infoNumero").textContent = numero;

  feedback.textContent =
    "Candidatura registrada com sucesso!";

  feedback.className = "sucesso";

  console.log(registros);
}

function gravarEEnviarTSE() {
  const feedback = document.getElementById("msgFeedbackAcao");

  if (registros.length === 0) {
    feedback.textContent =
      "Registre pelo menos uma candidatura antes de gerar o JSON.";

    feedback.className = "erro";

    return;
  }

  const dadosJSON = JSON.stringify(registros, null, 2);

  const arquivo = new Blob(
    [dadosJSON],
    { type: "application/json" }
  );

  const link = document.createElement("a");

  link.href = URL.createObjectURL(arquivo);

  link.download = "votacao.json";

  link.click();

  URL.revokeObjectURL(link.href);

  feedback.textContent =
    "Arquivo votacao.json gerado com sucesso!";

  feedback.className = "sucesso";
}

console.log("Sistema PDC carregado.");
