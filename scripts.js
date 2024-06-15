document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const clientFilter = document.getElementById('client-filter');
    const productDetail = document.getElementById('product-detail');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchContainer = document.querySelector('.search-container'); // Assurez-vous d'avoir une classe search-container pour le conteneur de recherche et filtre

    // Déclarer products en dehors de loadData pour la rendre globale
    let products = [];

    // Fonction pour charger les données JSON
    const loadData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            products = await response.json(); // Initialiser products
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

    // Fonction pour afficher les produits groupés par client
    const displayProducts = (products) => {
        productList.innerHTML = '';

        const groupedProducts = products.reduce((acc, product) => {
            const client = product['Nom Client'];
            if (!acc[client]) {
                acc[client] = [];
            }
            acc[client].push(product);
            return acc;
        }, {});

        Object.keys(groupedProducts).forEach(client => {
            const clientGroup = document.createElement('div');
            clientGroup.className = 'client-group';

            const clientName = document.createElement('h2');
            clientName.className = 'client-name';
            clientName.textContent = client;
            clientGroup.appendChild(clientName);

            const row = document.createElement('div');
            row.className = 'row';

            groupedProducts[client].forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-4 mb-4';
                productCard.innerHTML = `
                    <div class="card h-100 product-card" data-product='${JSON.stringify(product)}'>
                        <img src="${product['URL Photo']}" class="card-img-top" alt="${product['Nom Produit']}">
                        <div class="card-body">
                            <h5 class="card-title">${product['Nom Produit']}</h5>
                            <p class="card-text"><strong>Client:</strong> ${product['Nom Client']}</p>
                            <p class="card-text"><strong>Poids:</strong> ${product['Qté Par Boite']}</p>
                        </div>
                    </div>
                `;
                productCard.addEventListener('click', () => showProductDetails(product));
                row.appendChild(productCard);
            });

            clientGroup.appendChild(row);
            productList.appendChild(clientGroup);
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
const showProductDetails = (product) => {
    productList.style.display = 'none';
    productDetail.style.display = 'block';
    searchContainer.style.display = 'none'; // Cacher la recherche et le filtre

    // Détails du produit
    document.getElementById('detail-img').src = product['URL Photo'];
    document.getElementById('detail-img').alt = product['Nom Produit'];
    document.getElementById('detail-title').textContent = product['Nom Produit'];

    // Tableau des champs principaux à afficher
    const mainFields = [
        { id: 'detail-client', label: 'Client', value: product['Nom Client'] },
        { id: 'detail-version', label: 'Version', value: product['Version'] },
        { id: 'detail-modele-boite', label: 'Modèle Boîte', value: product['Modèle Boite'] },
        { id: 'detail-quantite-boite', label: 'Quantité par boîte', value: product['Qté Par Boite'] },
        { id: 'detail-modele-carton', label: 'Modèle Carton', value: product['Modèle Carton'] },
        { id: 'detail-quantite-carton', label: 'Quantité par carton', value: product['Qté par carton'] },
        { id: 'detail-duree-ddm', label: 'Durée DDM', value: product['Durée DDM'] },
        { id: 'detail-ddm', label: 'DDM', value: product['DDM'] },
    ];

    // Tableau des autres paramètres à afficher
    const additionalFields = [
        { id: 'detail-produit-1', label: 'Produit 1', value: product['Produit 1'] },
        { id: 'detail-produit-2', label: 'Produit 2', value: product['Produit 2'] },
        { id: 'detail-produit-3', label: 'Produit 3', value: product['Produit 3'] },
        { id: 'detail-produit-4', label: 'Produit 4', value: product['Produit 4'] },
        { id: 'detail-produit-5', label: 'Produit 5', value: product['Produit 5'] },
        { id: 'detail-produit-6', label: 'Produit 6', value: product['Produit 6'] },
    ];

    // Conteneur pour les détails principaux
    const mainDetailsContainer = document.getElementById('main-details-container');
    mainDetailsContainer.innerHTML = ''; // Réinitialiser le contenu

    // Conteneur pour les autres paramètres
    const additionalDetailsContainer = document.getElementById('additional-details-container');
    additionalDetailsContainer.innerHTML = ''; // Réinitialiser le contenu

    // Générer les champs principaux dynamiquement
    mainFields.forEach(field => {
        if (field.value) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
            colDiv.innerHTML = `<p class="card-text"><strong>${field.label}:</strong> <span>${field.value}</span></p>`;
            mainDetailsContainer.appendChild(colDiv);
        }
    });

    // Générer les autres paramètres dynamiquement
    additionalFields.forEach(field => {
        if (field.value) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
            colDiv.innerHTML = `<p class="card-text"><strong>${field.label}:</strong> <span>${field.value}</span></p>`;
            additionalDetailsContainer.appendChild(colDiv);
        }
    });
// Vérifier si au moins un autre paramètre existe
    let hasAdditionalParams = false;
    additionalFields.forEach(field => {
        if (field.value) {
            hasAdditionalParams = true;
        }
    });

    // Si au moins un autre paramètre existe, ajouter le titre et les champs
    if (hasAdditionalParams) {
        const title = document.createElement('h6');
        title.textContent = 'Autres Paramètres';
        additionalDetailsSection.appendChild(title);

        const additionalDetailsContainer = document.createElement('div');
        additionalDetailsContainer.className = 'row';

        additionalFields.forEach(field => {
            if (field.value) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
                colDiv.innerHTML = `<p class="card-text"><strong>${field.label}:</strong> <span>${field.value}</span></p>`;
                additionalDetailsContainer.appendChild(colDiv);
            }
        });

        additionalDetailsSection.appendChild(additionalDetailsContainer);
    }
    document.getElementById('detail-fiche').href = product['Fiche Pdf'];

    // Mise à jour des breadcrumbs
    const breadcrumbProduct = document.createElement('li');
    breadcrumbProduct.className = 'breadcrumb-item active';
    breadcrumbProduct.setAttribute('aria-current', 'page');
    breadcrumbProduct.textContent = product['Nom Produit'];
    breadcrumb.appendChild(breadcrumbProduct);
};



    // Retour à la liste des produits
    const returnToProductList = () => {
        productList.style.display = 'block';
        productDetail.style.display = 'none';
        searchContainer.style.display = 'block'; // Réafficher la recherche et le filtre
        const lastBreadcrumb = breadcrumb.lastChild;
        if (lastBreadcrumb && lastBreadcrumb.textContent !== 'Conditionnement') {
            breadcrumb.removeChild(lastBreadcrumb);
        }
        filterAndSearchProducts(products);  // Mettre à jour l'affichage avec les filtres et la recherche actifs
    };

    document.getElementById('breadcrumb-home').addEventListener('click', (e) => {
        e.preventDefault();
        returnToProductList();
    });

    // Charger les données au démarrage
    loadData();
});
