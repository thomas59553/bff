document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const clientFilter = document.getElementById('client-filter');
    const productDetail = document.getElementById('product-detail');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchContainer = document.querySelector('.search-container');

    let products = [];

    const loadData = async () => {
        try {
            const response = await fetch('fetch_data.php');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            products = await response.json();
            displayProducts(products);

            window.sharedData = products.map(product => ({ id: product.id }));

        const clients = [...new Set(products.map(product => product['Nom Client']).filter(client => client !== null && client !== undefined))];
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

  /*  const filterAndSearchProducts = (products) => {
        const searchTerm = searchInput.value.toLowerCase();
        const clientFilterValue = clientFilter.value;
        const filteredProducts = products.filter(product => {
            const matchesSearch = product['Nom Produit'].toLowerCase().includes(searchTerm);
            const matchesClient = clientFilterValue === '' || product['Nom Client'] === clientFilterValue;
            return matchesSearch && matchesClient;
        });
        displayProducts(filteredProducts);
    };*/
    
const filterAndSearchProducts = (products) => {
    const searchTerm = searchInput.value ? searchInput.value.toLowerCase() : '';
    const clientFilterValue = clientFilter.value;

    const filteredProducts = products.filter(product => {
        const productName = product['Nom Produit'] ? product['Nom Produit'].toLowerCase() : '';
        const productClient = product['Nom Client'] ? product['Nom Client'] : '';

        const matchesSearch = productName.includes(searchTerm);
        const matchesClient = clientFilterValue === '' || productClient === clientFilterValue;

        return matchesSearch && matchesClient;
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
          //  { label: 'Version', value: product['Version'] },
            { label: 'Modèle Boîte', value: product['Modèle Boite'] },
            { label: 'Quantité par boîte', value: product['Qté Par Boite'] },
            { label: 'Modèle Carton', value: product['Modèle Carton'] },
            { label: 'Quantité par carton', value: product['Qté par carton'] },
            { label: 'Durée DDM', value: product['Durée DDM'] },
            { label: 'DDM', value: product['DDM'] },
         { label: 'Fiche PDF', value: `<a href="${product['Fiche Pdf']}" target="_blank">Lire PDF</a>` },

        ];

        const detailsContainer = document.getElementById('details-container');
        detailsContainer.innerHTML = '';

        mainFields.forEach(field => {
            if (field.value) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
                colDiv.innerHTML = `<p class="card-text"><strong>${field.label}:</strong> <span>${field.value}</span></p>`;
                detailsContainer.appendChild(colDiv);
            }
        });


 if (product['Gallerie'] && Object.keys(product['Gallerie']).length > 0) {
    const gallerieContainer = document.getElementById('images-container');
  
     const gallerieDetailsContainer = document.getElementById('images-details-container');

    // Vider le contenu du compositionDetailsContainer avant de le remplir à nouveau
    gallerieDetailsContainer.innerHTML = '';

    gallerieContainer.style.display = 'block';

   // Ensure gallerieContainer is defined and points to the correct DOM element

for (const [key, value] of Object.entries(product['Gallerie'])) {
    // Create anchor element
    var anchor = document.createElement('a');
    anchor.className = 'example-image-link';
    anchor.href = key; // Use the key directly
    anchor.setAttribute('data-lightbox', 'example-set');
    anchor.setAttribute('data-title', value); // Use the value directly

    // Create image element
    var img = document.createElement('img');
    img.className = 'example-image';
    img.src = key;
    img.alt = '';
    img.width = 300; // Set the width to 150 pixels
    img.height = 300; // Set the height to 150 pixels
    
    // Append the image to the anchor
    anchor.appendChild(img);

    // Append the anchor to the desired parent element in the DOM
    gallerieDetailsContainer.appendChild(anchor); // Change 'document.body' to the desired parent element



      /*  const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
        colDiv.innerHTML = `<p class="card-text"><strong>${key}:</strong> <span>${value}...</span></p>`;
        gallerieContainer.appendChild(colDiv);*/
    }
} else {
    document.getElementById('composition-container').style.display = 'none';
}




   if (product['Composition'] && Object.keys(product['Composition']).length > 0) {
    const compositionContainer = document.getElementById('composition-container');
    const compositionDetailsContainer = document.getElementById('composition-details-container');

    // Vider le contenu du compositionDetailsContainer avant de le remplir à nouveau
    compositionDetailsContainer.innerHTML = '';

    compositionContainer.style.display = 'block';

    for (const [key, value] of Object.entries(product['Composition'])) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
        colDiv.innerHTML = `<p class="card-text"><strong>${key}:</strong> <span>${value}</span></p>`;
        compositionDetailsContainer.appendChild(colDiv);
    }
} else {
    document.getElementById('composition-container').style.display = 'none';
}

       if (product['Palettisation'] && Object.keys(product['Palettisation']).length > 0) {
    const palettisationContainer = document.getElementById('palettisation-container');
    const palettisationDetailsContainer = document.getElementById('palettisation-details-container');

    // Vider le contenu du palettisationDetailsContainer avant de le remplir à nouveau
    palettisationDetailsContainer.innerHTML = '';

    palettisationContainer.style.display = 'block';
    const paletteContainer = document.getElementById('palette-container');
    paletteContainer.style.display = 'block';

    for (const [key, value] of Object.entries(product['Palettisation'])) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-3 col-md-4 col-sm-6 mb-2';
        colDiv.innerHTML = `<p class="card-text"><strong>${key}:</strong> <span>${value}</span></p>`;
        palettisationDetailsContainer.appendChild(colDiv);
    }

    // Appeler la fonction de rendu 3D
    render3DProduct(product);
} else {
    document.getElementById('palettisation-container').style.display = 'none';
    document.getElementById('palette-container').style.display = 'none';
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






function render3DProduct(product) {
    fetch('palette.php?id=' + product.id)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const config = data[0];
            const palettisation = config.Palettisation;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            const canvasContainer = document.getElementById('canvas-container');
  // Vider le contenu du canvas-container avant d'ajouter un nouveau rendu
            canvasContainer.innerHTML = '';
    
              
            const width = canvasContainer.clientWidth;
            const height = canvasContainer.clientHeight;

            renderer.setSize(width, height);
            canvasContainer.appendChild(renderer.domElement);

            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = true;

            const paletteWidth = 1.2;
            const paletteDepth = 0.8;
            const paletteHeight = 0.1;
            const cartonWidth = paletteWidth / palettisation.L;
            const cartonDepth = paletteDepth / palettisation.l;
            const cartonHeight = config.HauteurCarton;

            const paletteGeometry = new THREE.BoxGeometry(paletteWidth, paletteHeight, paletteDepth);
            const paletteMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
            const palette = new THREE.Mesh(paletteGeometry, paletteMaterial);
            palette.position.y = paletteHeight / 2;
            scene.add(palette);

            const textureLoader = new THREE.TextureLoader();
            const textures = {
                front: textureLoader.load('box-front.png'),
                back: textureLoader.load('box-back.png'),
                top: textureLoader.load('box-top.png'),
                bottom: textureLoader.load('box-bottom.png'),
                left: textureLoader.load('box-left.png'),
                right: textureLoader.load('box-right.png')
            };

            const boxGeometry = new THREE.BoxGeometry(cartonWidth, cartonHeight, cartonDepth);
            const boxMaterials = [
                new THREE.MeshBasicMaterial({ map: textures.front }),
                new THREE.MeshBasicMaterial({ map: textures.back }),
                new THREE.MeshBasicMaterial({ map: textures.top }),
                new THREE.MeshBasicMaterial({ map: textures.bottom }),
                new THREE.MeshBasicMaterial({ map: textures.left }),
                new THREE.MeshBasicMaterial({ map: textures.right })
            ];
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

            const boxesLength = palettisation.L;
            const boxesWidth = palettisation.l;
            //const boxesHeight = palettisation.H;
                const boxesHeight = 4;


            for (let h = 0; h < boxesHeight; h++) {
                for (let l = 0; l < boxesLength; l++) {
                    for (let w = 0; w < boxesWidth; w++) {
                        const box = new THREE.Mesh(boxGeometry, boxMaterials);
                        box.position.set(
                            l * cartonWidth - (cartonWidth * (boxesLength - 1)) / 2,
                            h * cartonHeight + cartonHeight / 2 + paletteHeight,
                            w * cartonDepth - (cartonDepth * (boxesWidth - 1)) / 2
                        );
                        scene.add(box);

                        const edges = new THREE.EdgesGeometry(boxGeometry);
                        const line = new THREE.LineSegments(edges, lineMaterial);
                        line.position.copy(box.position);
                        scene.add(line);
                    }
                }
            }

            camera.position.set(1.4, 1.1, 1.6);
            controls.target.set(0, 0, 0);
            controls.update();

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(10, 20, 10).normalize();
            scene.add(light);


            


            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();

        
window.addEventListener('resize', () => {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    console.log('Resized width:', width);
    console.log('Resized height:', height);

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
              

        })
        .catch(error => console.error('Error fetching carton configuration:', error));
}
