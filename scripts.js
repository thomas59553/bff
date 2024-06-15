document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const clientFilter = document.getElementById('client-filter');

    // Fonction pour charger les données JSON
    const loadData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const products = await response.json();
            displayProducts(products);

            // Remplir le filtre de clients
            const clients = [...new Set(products.map(product => product['Nom Client']))];
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client;
                option.textContent = client;
                clientFilter.appendChild(option);
            });

            // Événements pour la recherche et le filtrage
            searchInput.addEventListener('input', () => filterAndSearchProducts(products));
            clientFilter.addEventListener('change', () => filterAndSearchProducts(products));
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

    // Fonction pour afficher les produits
    const displayProducts = (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';
            productCard.innerHTML = `
                <div class="card h-100">
                    <img src="${product['URL Photo']}" class="card-img-top" alt="${product['Nom Produit']}">
                    <div class="card-body">
                        <h5 class="card-title">${product['Nom Produit']}</h5>
                        <p class="card-text"><strong>Client:</strong> ${product['Nom Client']}</p>
                        <p class="card-text"><strong>Version:</strong> ${product['Version']}</p>                                        
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
    };

    // Filtrage et recherche des produits
    const filterAndSearchProducts = (products) => {
        const searchText = searchInput.value.toLowerCase();
        const selectedClient = clientFilter.value;
        const filteredProducts = products.filter(product => {
            const productName = product['Nom Produit'] ? product['Nom Produit'].toLowerCase() : '';
            const clientName = product['Nom Client'] || '';
            return (productName.includes(searchText) &&
                (selectedClient === '' || clientName === selectedClient));
        });
        displayProducts(filteredProducts);
    };

    // Charger les données au démarrage
    loadData();
});
