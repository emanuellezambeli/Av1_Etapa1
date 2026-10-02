let candidatos = [];

function carregarCandidatos() {
  fetch("candidatos.json")
    .then((response) => response.json())
    .then((data) => {
      candidatos = data["PDC"] || [];
      preencherLista();
    })
    .catch((error) =>
      console.error("Erro ao carregar candidatos do PDC:", error),
    );
}

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

function processarPartido() {
  const numeroPartido = document
    .getElementById("txtNumeroPartido")
    .value.trim();
  const msgErro = document.getElementById("msgErroPartido");
  const lista = document.getElementById("lstCandidatos");

  msgErro.textContent = "";
  lista.innerHTML = "";

  if (numeroPartido !== "93") {
    msgErro.textContent = "Partido inválido. O número do PDC é 93.";
    document.getElementById("lblNomePartido").innerHTML = "<b>---</b>";
    document.getElementById("painelCandidato").style.display = "none";
    return;
  }

  document.getElementById("lblNomePartido").innerHTML = "<b>PDC</b>";
  carregarCandidatos();
}

function selecionarCandidato() {
  const indice = document.getElementById("lstCandidatos").value;
  const candidato = candidatos[indice];
  const cargo = document.getElementById("lstCargos").value || "";
  const numeroCandidato = document
    .getElementById("txtNumeroCandidato")
    .value.trim();
  const msgErroNumero = document.getElementById("msgErroNumero");

  // Limpa mensagem de erro anterior
  msgErroNumero.textContent = "";

  // Valida o número de acordo com o cargo selecionado antes de exibir
  if (!validarNumeroCandidato(numeroCandidato, cargo)) {
    msgErroNumero.textContent =
      "Número do candidato inválido para o cargo selecionado.";
    document.getElementById("painelCandidato").style.display = "none";
    return;
  }

  if (!candidato) return;

  document.getElementById("infoNome").textContent = candidato.nome;
  document.getElementById("infoCargo").textContent = cargo || "-";
  document.getElementById("infoNumero").textContent = numeroCandidato || "-";

  // Atualiza a imagem corretamente
  const imgElement = document.getElementById("infoFoto");
  imgElement.src = candidato.foto;
  imgElement.alt = candidato.nome;

  document.getElementById("painelCandidato").style.display = "block";
}

// Função corrigida conforme as regras informadas no seu HTML (total de dígitos incluindo o 93)
function validarNumeroCandidato(numero, cargo) {
  // Garante que o número começa com "93"
  if (!numero.startsWith("93")) return false;

  if (cargo === "Presidente") return numero.length === 4; // 93 + 2 dígitos

  if (cargo === "Senador(a)") return numero.length === 5; // 93 + 3 dígitos

  if (cargo === "Governador(a)" || cargo === "Deputado(a) Federal")
    return numero.length === 6; // 93 + 4 dígitos

  if (cargo === "Deputado(a) Estadual") return numero.length === 7; // 93 + 5 dígitos

  return false;
}
