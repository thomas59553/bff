document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const clientFilter = document.getElementById('client-filter');
    const productDetail = document.getElementById('product-detail');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchContainer = document.querySelector('.search-container'); // Assurez-vous d'avoir une classe search-container pour le conteneur de recherche et filtre

    let products = [];

    const loadData = async () => {
        try {
            const response = await fetch('fetch_data.php');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            products = await response.json();
            displayProducts(products);

            // Initialiser window.sharedData pour le rendre accessible globalement
            window.sharedData = products.map(product => ({
                id: product.id
            }));

            const clients = [...new Set(products.map(product => product['Nom Client']))];
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client;
                option.textContent = client;
                clientFilter.appendChild(option);
            });

            searchInput.addEventListener('input', () => filterAndSearchProducts(products));
            clientFilter.addEventListener('change', () => filterAndSearchProducts(products));
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    };

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
        searchContainer.style.display = 'none';

        document.getElementById('detail-img').src = product['URL Photo'];
        document.getElementById('detail-img').alt = product['Nom Produit'];
        document.getElementById('detail-title').textContent = product['Nom Produit'];

        const mainFields = [
            { label: 'Client', value: product['Nom Client'] },
            { label: 'Version', value: product['Version'] },
            { label: 'Modèle Boîte', value: product['Modèle Boite'] },
            { label: 'Quantité par boîte', value: product['Qté Par Boite'] },
            { label: 'Modèle Carton', value: product['Modèle Carton'] },
            { label: 'Quantité par carton', value: product['Qté par carton'] },
            { label: 'Durée DDM', value: product['Durée DDM'] },
            { label: 'DDM', value: product['DDM'] },
            { label: 'Fiche PDF', value: product['Fiche Pdf'] },
        ];

        // Émettre un événement personnalisé avec l'ID du produit
        const event = new CustomEvent('productViewed', { detail: { id: product.id } });
        document.dispatchEvent(event);

        const detailsContainer = document.getElementById('details-container');
        detailsContainer.innerHTML = '';

        const compositionContainer = document.getElementById('composition-container');
        compositionContainer.innerHTML = '';

        const palettisationContainer = document.getElementById('palettisation-container');
        palettisationContainer.innerHTML = '';

      
        mainFields.forEach(field => {
            if (field.value) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
                colDiv.innerHTML = `<p class="card-text"><strong>${field.label}:</strong> <span>${field.value}</span></p>`;
                detailsContainer.appendChild(colDiv);
            }
        });

        if (product['Composition'] && Object.keys(product['Composition']).length > 0) {
            compositionContainer.style.display = 'block';
            const title = document.createElement('h5');
            title.className = 'text-center';
            title.textContent = 'Composition';
            compositionContainer.appendChild(title);

            const compositionDetailsContainer = document.createElement('div');
            compositionDetailsContainer.className = 'row';

            for (const [key, value] of Object.entries(product['Composition'])) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
                colDiv.innerHTML = `<p class="card-text"><strong>${key}:</strong> <span>${value}</span></p>`;
                compositionDetailsContainer.appendChild(colDiv);
            }

            compositionContainer.appendChild(compositionDetailsContainer);
        } else {
            compositionContainer.style.display = 'none';
        }

        if (product['Palettisation'] && Object.keys(product['Palettisation']).length > 0) {
            palettisationContainer.style.display = 'block';
            const title = document.createElement('h5');
            title.className = 'text-center';
            title.textContent = 'Palettisation';
            palettisationContainer.appendChild(title);

            const palettisationDetailsContainer = document.createElement('div');
            palettisationDetailsContainer.className = 'row';

            for (const [key, value] of Object.entries(product['Palettisation'])) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
                colDiv.innerHTML = `<p class="card-text"><strong>${key}:</strong> <span>${value}</span></p>`;
                palettisationDetailsContainer.appendChild(colDiv);
            }

            palettisationContainer.appendChild(palettisationDetailsContainer);

      
        } else {
            palettisationContainer.style.display = 'none';
        }

        while (breadcrumb.children.length > 1) {
            breadcrumb.removeChild(breadcrumb.lastChild);
        }
        
        const breadcrumbProduct = document.createElement('li');
        breadcrumbProduct.className = 'breadcrumb-item active';
        breadcrumbProduct.setAttribute('aria-current', 'page');
        breadcrumbProduct.textContent = product['Nom Produit'];
        breadcrumb.appendChild(breadcrumbProduct);
    };

      const returnToProductList = () => {
        productList.style.display = 'block';
        productDetail.style.display = 'none';
        searchContainer.style.display = 'block';
        const lastBreadcrumb = breadcrumb.lastChild;
        if (lastBreadcrumb && lastBreadcrumb.textContent !== 'Conditionnement') {
            breadcrumb.removeChild(lastBreadcrumb);
        }
    };

    document.getElementById('breadcrumb-home').addEventListener('click', (event) => {
        event.preventDefault();
        returnToProductList();
    });

    loadData();
});
