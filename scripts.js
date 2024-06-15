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

            const clientProducts = groupedProducts[client];
            const row = document.createElement('div');
            row.className = 'row';

            clientProducts.forEach(product => {
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

 // Afficher les détails du produit
    const showProductDetails = (product) => {
        const detailPage = window.open('', '_blank');
        detailPage.document.write(`
            <html>
            <head>
                <title>${product['Nom Produit']}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

            </head>
            <body>
                <!-- Header -->
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#">
                        <img src="logo.png" alt="Logo" width="30" height="30" class="d-inline-block align-top">
                        Catalogue des Produits
                    </a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">Accueil</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Recettes</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="container mt-4">
                    <!-- Breadcrumb -->
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" onclick="window.close()">Catalogue des Produits</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${product['Nom Produit']}</li>
                        </ol>
                    </nav>
                    <div class="card">
                        <img src="${product['URL Photo']}" class="card-img-top img-fluid" alt="${product['Nom Produit']}">
                        <div class="card-body">
                            <h5 class="card-title">${product['Nom Produit']}</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <p class="card-text"><strong>Client:</strong> ${product['Nom Client']}</p>
                                    <p class="card-text"><strong>Version:</strong> ${product['Version']}</p>
                                    <p class="card-text"><strong>Modèle Boîte:</strong> ${product['Modèle Boite']}</p>
                                    <p class="card-text"><strong>Quantité par boîte:</strong> ${product['Qté Par Boite']}</p>
                                </div>
                                <div class="col-md-6">
                                    <p class="card-text"><strong>Modèle Carton:</strong> ${product['Modèle Carton']}</p>
                                    <p class="card-text"><strong>Quantité par carton:</strong> ${product['Qté par carton']}</p>
                                    <p class="card-text"><strong>Durée DDM:</strong> ${product['Durée DDM']}</p>
                                    <p class="card-text"><strong>DDM:</strong> ${product['DDM']}</p>
                                </div>
                            </div>
                            <a href="${product['Fiche Pdf']}" class="btn btn-primary" target="_blank">Voir la fiche produit</a>
                        </div>
                    </div>
                </div>
                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
                 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

                <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
            </body>
            </html>
        `);
    };

    // Charger les données au démarrage
    loadData();
});
