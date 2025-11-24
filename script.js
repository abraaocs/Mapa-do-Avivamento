const cardContainer = document.querySelector(".card-container");
const inputBusca = document.querySelector("#input-busca");
const tagContainer = document.querySelector("#tag-filter-container");
let dados = [];

let resultadosAcumulados = new Set(); // Usamos um Set para evitar duplicatas facilmente
// 1. Função para carregar os dados do JSON.
//    Será chamada apenas uma vez.
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        // Assim que os dados carregam, renderizamos as tags
        renderizarTags();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>";
    }
}

// 2. Função que realiza a busca com base no termo digitado.
function realizarBusca() {
    const termoBusca = inputBusca.value.toLowerCase();

    if (!termoBusca) return; // Não faz nada se a busca estiver vazia

    const resultados = dados.filter(dado => {
        const name = dado.nome.toLowerCase(); // Corrigido de 'name' para 'nome'
        const descricao = dado.descricao.toLowerCase();
        return name.includes(termoBusca) || descricao.includes(termoBusca);
    });

    // Adiciona os novos resultados ao Set (duplicatas são ignoradas automaticamente)
    resultados.forEach(resultado => resultadosAcumulados.add(resultado));

    renderizarCards(Array.from(resultadosAcumulados)); // Converte o Set para Array e renderiza
}

// Função para renderizar os botões de tag
function renderizarTags() {
    const todasAsTags = new Set();
    dados.forEach(dado => {
        dado.tags.forEach(tag => todasAsTags.add(tag));
    });

    // Ordena as tags alfabeticamente para uma melhor visualização
    const tagsOrdenadas = Array.from(todasAsTags).sort();

    tagsOrdenadas.forEach(tag => {
        const tagButton = document.createElement("button");
        tagButton.className = "tag-button";
        tagButton.innerText = tag;
        tagButton.onclick = () => filtrarPorTag(tag, tagButton);
        tagContainer.appendChild(tagButton);
    });
}

// Função para filtrar por tag
function filtrarPorTag(tagSelecionada, botaoClicado) {
    // Remove a classe 'active' de todos os botões
    document.querySelectorAll('.tag-button').forEach(btn => btn.classList.remove('active'));
    // Adiciona a classe 'active' apenas ao botão clicado
    botaoClicado.classList.add('active');

    const resultados = dados.filter(dado => dado.tags.includes(tagSelecionada));
    renderizarCards(resultados);
}

// Função para explorar todos os avivalistas (limpa filtros)
function explorarTodos() {
    // Remove a classe 'active' de qualquer botão de tag
    document.querySelectorAll('.tag-button').forEach(btn => btn.classList.remove('active'));
    
    // Limpa o campo de busca
    inputBusca.value = "";

    // Renderiza todos os dados originais
    renderizarCards(dados);
}

// 3. Função para renderizar os cards na tela.
//    Agora ela limpa o container e renderiza a lista de resultados acumulados.
function renderizarCards(cardsParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa o container

    if (cardsParaRenderizar.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (const dado of cardsParaRenderizar) {
        const article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p class="card-year">${dado.data_criacao}</p>
            <p class="card-description">${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}

// Renomeei a função no onclick do botão no HTML de "iniciarBusca" para "realizarBusca"
document.getElementById("botao-busca").onclick = realizarBusca;
document.getElementById("botao-explorar").onclick = explorarTodos;

// Adiciona um evento para buscar ao pressionar "Enter" no input
inputBusca.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        realizarBusca();
    }
});

// Carrega os dados assim que o script é executado
carregarDados();