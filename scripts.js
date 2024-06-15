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

    document.getElementById('detail-fiche').href = product['Fiche Pdf'];

    // Mise à jour des breadcrumbs
    const breadcrumbProduct = document.createElement('li');
    breadcrumbProduct.className = 'breadcrumb-item active';
    breadcrumbProduct.setAttribute('aria-current', 'page');
    breadcrumbProduct.textContent = product['Nom Produit'];
    breadcrumb.appendChild(breadcrumbProduct);
};
