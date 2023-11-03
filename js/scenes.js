import * as THREE from 'three';

const canvas = document.getElementById("background");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth /
window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

const geometry = new THREE.SphereGeometry( 1, 8, 8);
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.z = -3;
scene.add( cube );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    
}
animate();