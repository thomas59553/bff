document.addEventListener('DOMContentLoaded', () => {
    // Écouter l'événement personnalisé productViewed
    document.addEventListener('productViewed', (event) => {
        const productId = event.detail.id;
        console.log('Product ID:', productId);

  // Fetch carton configuration from the API
   fetch(`palette.php?id=${productId}`)
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
      const boxesHeight = palettisation.H;

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

           // Set the camera position and controls target
      camera.position.set(1.4, 1.1, 1.6);
      camera.position.set(1.3, 0.9, -1.6);
      controls.target.set(0, 1, 0);
      controls.update(); // Make sure to call update to apply the changes

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
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      });
    })
    .catch(error => console.error('Error fetching carton configuration:', error));
     });

});