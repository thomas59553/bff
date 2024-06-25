document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('form').addEventListener('submit', saveProduct);
    document.getElementById('product-photo-file').addEventListener('change', updatePhotoPreview);
});

let currentProductId = null;

const loadProducts = async () => {
    const response = await fetch('fetch_data.php');
    const products = await response.json();
    displayProducts(products);
};

const displayProducts = (products) => {
    const productTable = document.getElementById('product-table');
    productTable.innerHTML = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nom du Produit</th>
                    <th>Client</th>
                    <th>Poids</th>
                    <th>Photo</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product['Nom Produit']}</td>
                        <td>${product['Nom Client']}</td>
                        <td>${product['Qté Par Boite']}</td>
                        <td><img src="${product['URL Photo']}" alt="${product['Nom Produit']}" width="50"></td>
                        <td>
                            <button class="btn btn-warning" onclick="editProduct('${product.id}')">Modifier</button>
                            <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};

const showProductForm = () => {
    document.getElementById('productModalLabel').textContent = 'Ajouter un Produit';
    document.getElementById('form').reset();
    clearDynamicFields();
    $('#productModal').modal('show');
    currentProductId = null;
};

const updatePhotoPreview = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('product-photo-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const clearDynamicFields = () => {
    document.getElementById('palettisation-fields').innerHTML = '';
    document.getElementById('composition-fields').innerHTML = '';
    document.getElementById('gallerie-fields').innerHTML = '';
};

const addPalettisationFields = (palettisation = {Longueur: '', Largeur: '', Hauteur: ''}) => {
    const {Longueur, Largeur, Hauteur} = palettisation;
    const field = document.createElement('div');
    field.className = 'form-group';
    field.innerHTML = `
        <label for="palettisation-longueur">Longueur</label>
        <input type="number" class="form-control mb-2" id="palettisation-longueur" value="${Longueur}" required>
        <label for="palettisation-largeur">Largeur</label>
        <input type="number" class="form-control mb-2" id="palettisation-largeur" value="${Largeur}" required>
        <label for="palettisation-hauteur">Hauteur Max</label>
        <input type="number" class="form-control mb-2" id="palettisation-hauteur" value="${Hauteur}" required>
    `;
    document.getElementById('palettisation-fields').appendChild(field);
};

const addCompositionField = (key = '', value = '') => {
    const field = document.createElement('div');
    field.className = 'form-group';
    field.innerHTML = `
        <input type="text" class="form-control mb-2" placeholder="Clé" value="${key}">
        <input type="text" class="form-control mb-2" placeholder="Valeur" value="${value}">
        <button type="button" class="btn btn-danger" onclick="removeField(this)">Supprimer</button>
    `;
    document.getElementById('composition-fields').appendChild(field);
};

const addGallerieField = (url = '', description = '') => {
    const field = document.createElement('div');
    field.className = 'form-group';
    field.innerHTML = `
        <input type="text" class="form-control mb-2" placeholder="URL" value="${url}">
        <input type="text" class="form-control mb-2" placeholder="Description" value="${description}">
        <button type="button" class="btn btn-danger" onclick="removeField(this)">Supprimer</button>
    `;
    document.getElementById('gallerie-fields').appendChild(field);
};

const removeField = (button) => {
    button.parentElement.remove();
};

const editProduct = async (id) => {
    const response = await fetch(`fetch_data.php?id=${id}`);
    const product = await response.json();
    currentProductId = id;
    document.getElementById('productModalLabel').textContent = 'Modifier un Produit';
    document.getElementById('product-name').value = product['Nom Produit'];
    document.getElementById('product-client').value = product['Nom Client'];
    document.getElementById('product-weight').value = product['Qté Par Boite'];
    document.getElementById('product-photo-url').value = product['URL Photo'];
    document.getElementById('product-photo-preview').src = product['URL Photo'];
    document.getElementById('product-fiche').value = product['Fiche Pdf'];
    document.getElementById('product-model').value = product['Modèle Boite'];
    document.getElementById('product-carton-model').value = product['Modèle Carton'];
    document.getElementById('product-carton-qty').value = product['Qté par carton'];
    document.getElementById('product-ddm').value = product['DDM'];
    document.getElementById('product-ddm-duration').value = product['Durée DDM'];
    document.getElementById('product-particularities').value = product['Particuarités'];

   // clearDynamicFields();

 //   addPalettisationFields(product['Palettisation']);

  //  console.log(product['Palettisation']['Longueur']);
   // console.log(product['Palettisation']['Largeur']);
  //  console.log(product['Palettisation']['Hauteur Max']);
document.getElementById('palettisation-longueur').value = product['Palettisation']['Longueur'];
document.getElementById('palettisation-largeur').value = product['Palettisation']['Largeur'];
document.getElementById('palettisation-hauteur').value = product['Palettisation']['Hauteur Max'];

    for (const key in product['Composition']) {
        addCompositionField(key, product['Composition'][key]);
    }

    for (const url in product['Gallerie']) {
        addGallerieField(url, product['Gallerie'][url]);
    }

    $('#productModal').modal('show');
};

const saveProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', currentProductId);
    formData.append('Nom Produit', document.getElementById('product-name').value);
    formData.append('Nom Client', document.getElementById('product-client').value);
    formData.append('Qté Par Boite', document.getElementById('product-weight').value);

    const photoFile = document.getElementById('product-photo-file').files[0];
    if (photoFile) {
        formData.append('Photo File', photoFile);
    } else {
        formData.append('URL Photo', document.getElementById('product-photo-url').value);
    }

    formData.append('Fiche Pdf', document.getElementById('product-fiche').value);
    formData.append('Modèle Boite', document.getElementById('product-model').value);
    formData.append('Modèle Carton', document.getElementById('product-carton-model').value);
    formData.append('Qté par carton', document.getElementById('product-carton-qty').value);
    formData.append('DDM', document.getElementById('product-ddm').value);
    formData.append('Durée DDM', document.getElementById('product-ddm-duration').value);
    formData.append('Particuarités', document.getElementById('product-particularities').value);

    const palettisation = {
        Longueur: document.getElementById('palettisation-longueur').value,
        Largeur: document.getElementById('palettisation-largeur').value,
        Hauteur: document.getElementById('palettisation-hauteur').value,
    };
    formData.append('Palettisation', JSON.stringify(palettisation));

    const composition = {};
    document.querySelectorAll('#composition-fields > div').forEach(div => {
        const key = div.children[0].value;
        const value = div.children[1].value;
        if (key) {
            composition[key] = value;
        }
    });
    formData.append('Composition', JSON.stringify(composition));

    const gallerie = {};
    document.querySelectorAll('#gallerie-fields > div').forEach(div => {
        const url = div.children[0].value;
        const description = div.children[1].value;
        if (url) {
            gallerie[url] = description;
        }
    });
    formData.append('Gallerie', JSON.stringify(gallerie));

    const response = await fetch('save_product.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        $('#productModal').modal('hide');
        loadProducts();
    } else {
        alert('Erreur: ' + result.error);
    }
};

const deleteProduct = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        const response = await fetch(`delete_product.php?id=${id}`);
        const result = await response.json();
        if (result.success) {
            loadProducts();
        } else {
            alert('Erreur: ' + result.error);
        }
    }
};
