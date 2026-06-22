 const API_URL = "http://localhost:3000/produtos";

        
        function formatPrice(preco) {
            return preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }


        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');

        async function carregarDetalhes() {
            const container = document.getElementById("details-content");

            if (!produtoId) {
                container.innerHTML = `<div class="loading-msg">Erro: Nenhuma fruta foi selecionada.</div>`;
                return;
            }

            try {
  
                const response = await fetch(`${API_URL}/${produtoId}`);
                
                if (!response.ok) {
                    throw new Error("Fruta não encontrada");
                }

                const produto = await response.json();
                const estoqueStatus = produto.emEstoque ? "Em estoque" : "Fora de estoque";


                container.innerHTML = `
                    <div class="details-container">
                        <div class="details-image">
                            <img src="${produto.imagem}" alt="${produto.nome}">
                        </div>
                        <div class="details-info">
                            <span class="category">${produto.categoria}</span>
                            <h1>${produto.nome}</h1>
                            <p class="price">${formatPrice(produto.preco)}</p>
                            <p class="description">${produto.descricao}</p>
                            <p style="margin-bottom: 20px; font-weight: 500;">Status: ${estoqueStatus}</p>
                            
                            <a href="index.html" class="back-btn">Voltar para a Vitrine</a>
                        </div>
                    </div>
                `;

            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
                container.innerHTML = `
                    <div class="loading-msg" style="color: #DD3B26;">
                        <p>Não foi possível carregar os detalhes desta fruta.</p>
                        <br>
                        <a href="index.html" class="back-btn" style="float: none; display: inline-block;">Voltar</a>
                    </div>
                `;
            }
        }

        // Executa a busca assim que a página carregar
        carregarDetalhes();