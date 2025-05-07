const perguntas = [
  {
    texto: "Você já teve experiência com vendas ou marketing digital?",
    opcoes: [
      { emoji: "✅", texto: "Sim" },
      { emoji: "❌", texto: "Não" }
    ]
  },
  {
    texto: "Quantas horas por dia pode se dedicar à corretora?",
    opcoes: [
      { emoji: "⏱️", texto: "Menos de 1h" },
      { emoji: "⏳", texto: "1 a 3h" },
      { emoji: "🕒", texto: "Mais de 3h" }
    ]
  },
  {
    texto: "Tem familiaridade com investimentos ou mercado financeiro?",
    opcoes: [
      { emoji: "📊", texto: "Sim" },
      { emoji: "🙅", texto: "Não" }
    ]
  },
  {
    texto: "Você possui um público ou audiência nas redes sociais?",
    opcoes: [
      { emoji: "👥", texto: "Sim" },
      { emoji: "🚫", texto: "Não" }
    ]
  },
  {
    texto: "Prefere trabalhar como afiliado ou gestor de equipe?",
    opcoes: [
      { emoji: "🧑‍💻", texto: "Afiliado" },
      { emoji: "🧑‍🏫", texto: "Gestor de equipe" }
    ]
  },
  {
    texto: "Qual seu principal objetivo ao se tornar afiliado?",
    opcoes: [
      { emoji: "💰", texto: "Renda extra" },
      { emoji: "🌍", texto: "Liberdade financeira" },
      { emoji: "📈", texto: "Crescer profissionalmente" }
    ]
  },
  {
    texto: "Você quer voar sendo afiliado da Dólar Broker ou ir aos poucos?",
    estilo: "emoji-top",
    opcoes: [
      { emoji: "🚀", texto: "Quero voar com a Dólar Broker!" },
      { emoji: "🐢", texto: "Prefiro ir com calma" }
    ]
  },
  {
    texto: "Você está pronto para começar agora?",
    opcoes: [
      { emoji: "🔥", texto: "Sim, imediatamente" },
      { emoji: "💬", texto: "Preciso de mais informações" }
    ]
  }
];

let respostas = [];
let etapaAtual = 0;

const quiz = document.getElementById("quiz");
const progress = document.querySelector(".progress");

function mostrarPergunta() {
  const pergunta = perguntas[etapaAtual];
  const total = perguntas.length;
  const porcentagem = ((etapaAtual) / total) * 100;
  progress.style.width = `${porcentagem}%`;

  const botoes = pergunta.opcoes.map(opcao => {
    if (pergunta.estilo === "emoji-top") {
      return `<button onclick="responder('${opcao.texto}')" class="emoji-top">
                <span class="emoji">${opcao.emoji}</span>
                <span class="label">${opcao.texto}</span>
              </button>`;
    } else {
      return `<button onclick="responder('${opcao.texto}')">${opcao.emoji} ${opcao.texto}</button>`;
    }
  }).join("");

  quiz.innerHTML = `
    <div class="question">${pergunta.texto}</div>
    <div class="options">${botoes}</div>
  `;
}

function responder(resposta) {
  respostas.push(resposta);
  etapaAtual++;

  if (etapaAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    mostrarSlideFinal();
  }
}

function mostrarSlideFinal() {
  progress.style.width = '100%';

  const resumo = respostas.map((r, i) => `${i + 1}. ${perguntas[i].texto} - ${r}`).join("<br>");

  quiz.innerHTML = `
    <img src="assets/final-slide.png" class="final-image" alt="Slide final">
    <p class="final-text">Parabéns por chegar até aqui! Veja suas respostas abaixo e digite seu nome para enviar no WhatsApp:</p>
    <div style="text-align:left; font-size:14px; margin: 10px 0; background: #222; padding: 10px; border-radius: 10px;">${resumo}</div>
    <input type="text" id="nome" placeholder="Digite seu nome">
    <button onclick="enviarParaWhatsApp()">Enviar para o WhatsApp</button>
  `;
}

function enviarParaWhatsApp() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) {
    alert("Por favor, digite seu nome.");
    return;
  }

  const numero = "5599999999999";
  const mensagem = `Olá! Quero ser afiliado(a). Me chamo ${nome} e aqui estão minhas respostas:\n\n` +
    respostas.map((r, i) => `${i + 1}. ${perguntas[i].texto} - ${r}`).join("\n");

  const texto = encodeURIComponent(mensagem);
  const linkLongo = `https://api.whatsapp.com/send?phone=${numero}&text=${texto}`;
  const linkCurto = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(
    `Olá! Quero ser afiliado(a). Me chamo ${nome} e completei o quiz com sucesso. Favor entrar em contato para ver as respostas completas.`
  )}`;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const urlFinal = texto.length > 2000 ? linkCurto : linkLongo;

  if (isMobile) {
    window.location.href = urlFinal;
  } else {
    window.open(urlFinal.replace("api.whatsapp.com", "web.whatsapp.com"), "_blank");
  }
}

mostrarPergunta();
