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
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product['URL Photo']}" alt="${product['Nom Produit']}">
                <h3>${product['Nom Produit']}</h3>
                <p>Client: ${product['Nom Client']}</p>
                <p>Version: ${product['Version']}</p>
                <p>Modèle Boîte: ${product['Modèle Boite']}</p>
                <p>Quantité par boîte: ${product['Qté Par Boite']}</p>
                <p>Modèle Carton: ${product['Modèle Carton']}</p>
                <p>Quantité par carton: ${product['Qté par carton']}</p>
                <p>Durée DDM: ${product['Durée DDM']}</p>
                <p>DDM: ${product['DDM']}</p>
                <a href="${product['Fiche Pdf']}" target="_blank">Voir la fiche produit</a>
            `;
            productList.appendChild(productCard);
        });
    };

    // Filtrage et recherche des produits
    const filterAndSearchProducts = (products) => {
        const searchText = searchInput.value.toLowerCase();
        const selectedClient = clientFilter.value;
        const filteredProducts = products.filter(product => {
            return (product['Nom Produit'].toLowerCase().includes(searchText) &&
                (selectedClient === '' || product['Nom Client'] === selectedClient));
        });
        displayProducts(filteredProducts);
    };

    // Charger les données au démarrage
    loadData();
});
