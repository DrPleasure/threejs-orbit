


const planetsData = [
    { name: 'Sun', size: 20, distance: 0, texture: 'sun.jpg', orbitSpeed: 0, rotationSpeed: 0.0002, mass: '1.989 × 10^30 kg', diameter: '1,392,700 km', surfaceGravity: '274 m/s²', avgTemperature: '5,500 °C', funFact: 'The Sun is the largest object in our solar system. However, its size is average compared to other stars.' },
    { name: 'Mercury', size: 1, distance: 25, texture: 'mercury.jpg', orbitSpeed: 0.0000478 * 7, rotationSpeed: 0.000000174 * 7, mass: '3.301 × 10^23 kg', diameter: '4,880 km', surfaceGravity: '3.7 m/s²', avgTemperature: '167 °C', funFact: 'Mercury is the smallest planet in our solar system, and it is shrinking every day!' },
    { name: 'Venus', size: 1.8, distance: 45, texture: 'venus.jpg', orbitSpeed: 0.0000185 * 7, rotationSpeed: -0.000000074 * 7, mass: '4.867 × 10^24 kg', diameter: '12,104 km', surfaceGravity: '8.87 m/s²', avgTemperature: '462 °C', funFact: 'Venus is the brightest natural object in the sky after the moon.' },
    { name: 'Earth', size: 2, distance: 65, texture: 'earth.jpg', orbitSpeed: 0.0000125 * 7, rotationSpeed: 0.000694 * 7, mass: '5.97 × 10^24 kg', diameter: '12,742 km', surfaceGravity: '9.81 m/s²', avgTemperature: '15 °C', funFact: 'Earth is the only planet proven to have life (that we know of).' },
    { name: 'Mars', size: 1.2, distance: 85, texture: 'mars.jpg', orbitSpeed: 0.0000064 * 7, rotationSpeed: 0.000677 * 7, mass: '6.39 × 10^23 kg', diameter: '6,779 km', surfaceGravity: '3.721 m/s²', avgTemperature: '-63 °C', funFact: 'Mars, the red planet, is named after the Roman god of war.' },
    { name: 'Jupiter', size: 6, distance: 160, texture: 'jupiter.jpg', orbitSpeed: 0.00000105 * 7, rotationSpeed: 0.041 * 7, mass: '1.898 × 10^27 kg', diameter: '139,822 km', surfaceGravity: '24.79 m/s²', avgTemperature: '-108 °C', funFact: 'Jupiter is the largest planet in the solar system – so big that it would fit every other planet inside it twice!' },
    { name: 'Saturn', size: 5, distance: 220, texture: 'saturn.jpg', orbitSpeed: 0.00000038 * 7, rotationSpeed: 0.036 * 7, mass: '5.683 × 10^26 kg', diameter: '116,460 km', surfaceGravity: '10.44 m/s²', avgTemperature: '-139 °C', funFact: 'Saturn has a whopping 82 moons.' },
    { name: 'Uranus', size: 4, distance: 300, texture: 'uranus.jpg', orbitSpeed: 0.00000014 * 7, rotationSpeed: 0.012 * 7, mass: '8.681 × 10^25 kg', diameter: '50,724 km', surfaceGravity: '8.69 m/s²', avgTemperature: '-197 °C', funFact: 'Uranus is the coldest planet in the solar system.' },
    { name: 'Neptune', size: 3.8, distance: 380, texture: 'neptune.jpg', orbitSpeed: 0.00000007 * 7, rotationSpeed: 0.018 * 7, mass: '1.024 × 10^26 kg', diameter: '49,244 km', surfaceGravity: '11.15 m/s²', avgTemperature: '-201 °C', funFact: 'Neptune, the blue planet, is named after the Roman god of the sea.' }
  ]
      

const moonsData = [
    {
      name: 'Moon',
      parentPlanet: 'Earth',
      size: 0.5,
      distance: 4,
      texture: 'moon.jpg',
      orbitSpeed: 0.0002 * 7,
      rotationSpeed: 0.0002 * 7,
    },
    {
      name: 'Io',
      parentPlanet: 'Jupiter',
      size: 0.3,
      distance: 12,
      texture: 'io.jpg',
      orbitSpeed: 0.0008 * 7,
      rotationSpeed: 0.0008 * 7,
    },
  ];
  



// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.addEventListener('mousemove', onMouseMove);


// Create a scene 
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 200;


const raycaster = new THREE.Raycaster();


let timeScale = 1;

function increaseTimeScale() {
    timeScale *= 2;
  }
  
  function decreaseTimeScale() {
    timeScale /= 2;
  }


// Add lighting
const pointLight = new THREE.PointLight(0xffffff, 2, 0);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
scene.add(ambientLight);


function createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const skyboxTextures = [
        './textures/px.jpg',
        './textures/nx.jpg',
        './textures/py.jpg',
        './textures/ny.jpg',
        './textures/pz.jpg',
        './textures/nz.jpg',
    ];

    loader.load(skyboxTextures, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        scene.background = texture;
    });
}


createSkybox();

// function createOrbitLine(distance, orbitColor) {
//     const points = [];
//     const divisions = 50;
//     for (let i = 0; i <= divisions; i++) {
//       const radians = (i / divisions) * Math.PI * 2;
//       const x = Math.cos(radians) * distance;
//       const z = Math.sin(radians) * distance;
//       points.push(new THREE.Vector3(x, 0, z));
//     }
  
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color: orbitColor });
//     const orbitLine = new THREE.Line(geometry, material);
//     orbitLine.rotation.x = Math.PI / 2;
//     scene.add(orbitLine);
//   }
  
let hoveredPlanet = null;

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  
    // Raycast from camera to scene
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true); // Add 'true' to include child objects
  
    // Get the planet/moon name HTML element
    const celestialObjectNameElement = document.getElementById('planet-name');
  
    // Display planet/moon name if intersecting with a planet/moon
    const celestialObject = intersects.find((intersect) => intersect.object.isCelestialObject);
    if (celestialObject) {
      const { name } = celestialObject.object.userData; // get the name from userData
      celestialObjectNameElement.innerHTML = name;
      celestialObjectNameElement.style.left = event.clientX + 'px';
      celestialObjectNameElement.style.top = event.clientY + 'px';
      celestialObjectNameElement.style.display = 'block';
  
      // Apply hover effect
      if (hoveredPlanet !== celestialObject.object) {
        if (hoveredPlanet) {
          // Reset previous hovered planet/moon
          hoveredPlanet.material.color.set(0xffffff);
          hoveredPlanet.material.emissive.set(0x000000);
          hoveredPlanet.material.emissiveIntensity = 0;
          hoveredPlanet.material.needsUpdate = true;
          hoveredPlanet.scale.set(1, 1, 1);
        }
        hoveredPlanet = celestialObject.object;
        // Apply hover effect to the new hovered planet/moon
        hoveredPlanet.material.color.set(0xff0000);
        hoveredPlanet.material.emissive.set(0xff0000);
        hoveredPlanet.material.emissiveIntensity = 0.2;
        hoveredPlanet.material.needsUpdate = true;
        hoveredPlanet.scale.set(1.2, 1.2, 1.2);
      }
    } else {
      celestialObjectNameElement.style.display = 'none';
  
      // Reset hover effect when no planet/moon is intersected
      if (hoveredPlanet) {
        hoveredPlanet.material.color.set(0xffffff);
        hoveredPlanet.material.emissive.set(0x000000);
        hoveredPlanet.material.emissiveIntensity = 0;
        hoveredPlanet.material.needsUpdate = true;
        hoveredPlanet.scale.set(1, 1, 1);
        hoveredPlanet = null;
      }
    }
  }
  
  renderer.domElement.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  
    // Raycast from camera to scene
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
  
    // Display planet information if intersecting with a celestial object
    const celestialObject = intersects.find((intersect) => intersect.object.isCelestialObject);
    if (celestialObject) {
      const { name } = celestialObject.object.userData; // get the name from userData
      const planetData = planetsData.find((planetData) => planetData.name === name);
      if (planetData) {
        showInfoPanel(planetData);
      }
    } else {
      hideInfoPanel();
    }
  });
  
  
  
  function createPlanetName(name) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "Bold 14px Arial";
    context.fillStyle = "white";
    context.fillText(name, 0, 14);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(40, 20, 1);
    sprite.name = "planetName";
    return sprite;
  }
  
  
  function createPlanet(planetData) {
    return new Promise((resolve) => {
      const { name, size, distance, texture, orbitSpeed, rotationSpeed } = planetData;

  
      // Load texture
      const loader = new THREE.TextureLoader();
      loader.load(`textures/${texture}`, (planetTexture) => {
        // Create planet geometry and material
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshPhongMaterial({ map: planetTexture, color: 0xffffff });
  
        // Create planet mesh
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(distance, 0, 0);
  
        planet.userData = { name, orbitSpeed, rotationSpeed };
        scene.add(planet);
        planet.isCelestialObject = true;

        // Add isPlanet property
        planet.isPlanet = true;
  
        resolve(planet);
      });
    });
  }

  function createMoon(moonData, parentPlanet) {
    return new Promise((resolve) => {
      const { name, size, distance, texture, orbitSpeed, rotationSpeed } = moonData;


      // Load texture
      const loader = new THREE.TextureLoader();
      loader.load(`textures/${texture}`, (moonTexture) => {
        // Create moon geometry and material
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshPhongMaterial({ map: moonTexture, color: 0xffffff });
  
        // Create moon mesh
        const moon = new THREE.Mesh(geometry, material);
        moon.position.set(distance, 0, 0);
  
        moon.userData = { name, orbitSpeed, rotationSpeed };
        parentPlanet.add(moon);
        moon.isCelestialObject = true;

        // Add isPlanet property
        moon.isPlanet = true;
  
        resolve(moon);
      });
    });
  }




// Create planets
planetsData.forEach(createPlanet);

camera.position.set(0, 100, 300);
camera.rotation.set(-0.2, 0, 0);


function animate() {
    requestAnimationFrame(animate);
  
    // Rotate the planets and their moons
    scene.traverse((object) => {
      if (object.isMesh) {
        // Rotate around the Sun or parent planet
        const { orbitSpeed, rotationSpeed } = object.userData;
        const elapsedTime = Date.now() * orbitSpeed * timeScale; // <-- Add timeScale here
        object.position.x = Math.cos(elapsedTime) * object.position.length();
        object.position.z = Math.sin(elapsedTime) * object.position.length();
  
        // Rotate around its own axis
        object.rotation.y += rotationSpeed * timeScale; // <-- Add timeScale here
      }
    });
  
    // Render the scene
    renderer.render(scene, camera);
  }
  
  moonsData.forEach((moonData) => {
    const parentPlanet = scene.getObjectByName(moonData.parentPlanet);
    if (parentPlanet) {
      createMoon(moonData, parentPlanet);
    }
  });
  

  Promise.all(planetsData.map(createPlanet)).then(() => {
    moonsData.forEach((moonData) => {
      const parentPlanet = scene.getObjectByName(moonData.parentPlanet);
      if (parentPlanet) {
        createMoon(moonData, parentPlanet);
      }
    });
  });
  
  function showInfoPanel(planetData) {
    const infoPanel = document.getElementById('info-panel');
    const { name, mass, diameter, surfaceGravity, funFact } = planetData;
    infoPanel.innerHTML = `<h3>${name}</h3><p><strong>Mass: </strong>${mass}</p><p><strong>Diameter: </strong> ${diameter}</p><p><strong>Surface Gravity: </strong>${surfaceGravity}</p><p><strong>Random Fun Fact: </strong>${funFact} </p>`;
    infoPanel.style.display = 'block';
  }
  
  function hideInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    infoPanel.style.display = 'none';
  }
  

  

// Start the animation loop
animate();
