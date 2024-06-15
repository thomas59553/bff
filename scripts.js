document.addEventListener('DOMContentLoaded', () => {
    const products = [
        // Les données JSON ici (copier/coller les données de votre fichier JSON)
    ];

    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const clientFilter = document.getElementById('client-filter');

    // Remplir le filtre de clients
    const clients = [...new Set(products.map(product => product['Nom Client']))];
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client;
        option.textContent = client;
        clientFilter.appendChild(option);
    });

    // Fonction pour afficher les produits
    const displayProducts = (filteredProducts) => {
        productList.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product['URL Photo']}" alt="${product['Nom Produit']}">
                <h3>${product['Nom Produit']}</h3>
                <p>Client: ${product['Nom Client']}</p>
                <a href="${product['Fiche Pdf']}" target="_blank">Voir la fiche produit</a>
            `;
            productList.appendChild(productCard);
        });
    };

    // Filtrage et recherche des produits
    const filterAndSearchProducts = () => {
        const searchText = searchInput.value.toLowerCase();
        const selectedClient = clientFilter.value;
        const filteredProducts = products.filter(product => {
            return (product['Nom Produit'].toLowerCase().includes(searchText) &&
                (selectedClient === '' || product['Nom Client'] === selectedClient));
        });
        displayProducts(filteredProducts);
    };

    // Événements pour la recherche et le filtrage
    searchInput.addEventListener('input', filterAndSearchProducts);
    clientFilter.addEventListener('change', filterAndSearchProducts);

    // Afficher tous les produits au chargement
    displayProducts(products);
});
