
    let produtos = [];
    let meuGrafico;   

    function carregarDados() {
        fetch('../db/db.json')
            .then(response => {
                if (!response.ok) throw new Error('db.json não encontrado');
                return response.json();
            })
            .then(data => {
                produtos = data.produtos;

                
                const salvo = localStorage.getItem('produtos');
                if (salvo) {
                    const produtosSalvos = JSON.parse(salvo);
                    produtos.forEach(p => {
                        const salvo = produtosSalvos.find(ps => ps.id === p.id);
                        if (salvo) {
                            p.quantidade = salvo.quantidade ?? (p.emEstoque ? 1 : 0);
                            p.emEstoque = salvo.emEstoque !== false;
                        }
                    });
                } else {
                    produtos.forEach(p => {
                        p.quantidade = p.quantidade ?? (p.emEstoque ? 1 : 0);
                        p.emEstoque = p.emEstoque !== false;
                    });
                }

                criarGrafico();
                renderizarEstoque();
            })
            .catch(err => {
                console.error(err);
                document.querySelector('.chart-container').innerHTML += 
                    `<p style="color:#DD3B26; text-align:center; margin-top:20px;">
                        ⚠️ Erro ao carregar db.json
                    </p>`;
            });
    }

    function criarGrafico() {
        const ctx = document.getElementById('fruitChart');
        if (!ctx) return;

        
        if (meuGrafico) meuGrafico.destroy();

        const contadorEstoque = {};
        produtos.forEach(p => {
            contadorEstoque[p.categoria] = (contadorEstoque[p.categoria] || 0) + (p.quantidade || 0);
        });

        const labels = Object.keys(contadorEstoque);
        const valores = Object.values(contadorEstoque);

        meuGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade em Estoque por Categoria',
                    data: valores,
                    backgroundColor: '#DD3B26',
                    borderColor: '#20492F',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: '#20492F', font: { size: 15 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, color: '#20492F' }
                    },
                    x: {
                        ticks: { color: '#20492F' }
                    }
                }
            }
        });
    }

    function renderizarEstoque() {
        let html = '';
        produtos.forEach((produto, index) => {
            html += `
                <div class="produto-item">
                    <div>
                        <strong>${produto.nome}</strong> 
                        <small>(${produto.categoria})</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <button class="btn-estoque" onclick="alterarEstoque(${index}, -1)">–</button>
                        <span class="quantidade">${produto.quantidade || 0}</span>
                        <button class="btn-estoque" onclick="alterarEstoque(${index}, 1)">+</button>
                        <button onclick="toggleEstoque(${index})" style="margin-left:8px; font-size:1.3rem;">
                            ${produto.emEstoque ? '✅' : '❌'}
                        </button>
                    </div>
                </div>`;
        });
        document.getElementById('listaEstoque').innerHTML = html;
    }

    function alterarEstoque(index, delta) {
        let qtd = produtos[index].quantidade || 0;
        qtd = Math.max(0, qtd + delta);
        produtos[index].quantidade = qtd;
        produtos[index].emEstoque = qtd > 0;

        renderizarEstoque();
        criarGrafico();
        salvarNoLocalStorage();
    }

    function toggleEstoque(index) {
        produtos[index].emEstoque = !produtos[index].emEstoque;
        if (!produtos[index].emEstoque) produtos[index].quantidade = 0;

        renderizarEstoque();
        criarGrafico();
        salvarNoLocalStorage();
    }

    function salvarNoLocalStorage() {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    
    window.onload = carregarDados;
