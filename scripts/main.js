// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Vector2 } from 'three';
import {UV} from 'uv'
import {Vertices} from 'vertices';
import {Normals} from 'normals';
import {Material} from 'material';
import {Plane} from 'planex';

async function loadData() {
    const fragmentShader = `
    #include <common>

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iTexture;

varying float height;
varying vec2 vUV;

// By iq: https://www.shadertoy.com/user/iq
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUV;

    vec4 colorTexture = texture2D(iTexture, uv);

    fragColor = colorTexture;
}
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
    `
    const vertexShader = `
    #define GLSLIFY 1
// Common uniforms
uniform float iTime;

varying float height;
varying vec2 vUV;

/*
 * The main program
 */
void main() {
	height = cos(iTime+sqrt((position.x-100.0)*(position.x-100.0) + (position.z-100.0)*(position.z-100.0)));

	vUV = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0,height,0), 1.0);
}
    `

    const simu = new SimulationScene(fragmentShader, vertexShader);
}

class SimulationScene {
    renderer;
    camera;
    scene;
    cube;
    uniforms;

    /**
     * 
     * @param {String} fragmentShader 
     */
    constructor(fragmentShader, vertexShader) {
        this.fov = 75;
        this.aspect = window.innerWidth/window.innerHeight;
        this.near = 0.1;
        this.far = 200;

        // initialisation
        this.init(fragmentShader, vertexShader);

        // entrée dans la boucle de rendering
        requestAnimationFrame(this.render);
    }

    init(fragmentShader, vertexShader) {
        this.initScene();
        this.initMesh(fragmentShader, vertexShader);
    }

    initScene() {
        // création du renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.render = this.render.bind(this);

        // création de la caméra
        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);

        // création de la scéne
        this.scene = new THREE.Scene();

        // controle de la camera
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
    }

    initMesh(fragmentShader, vertexShader) {
        

		this.cube = new Plane(fragmentShader, vertexShader, new THREE.Vector2(200,200), new THREE.Vector2(500,500));
		this.scene.add( this.cube.Mesh );

        this.controls.target.set( 100, 0, 100 );

        const colora = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( colora, intensity );
		light.position.set( - 1, 2, 4 );
		this.scene.add( light );
    }

    render(time) {
        const speed = 0.001;
        const rot = time * speed;

        this.cube.Update(time);

        this.renderer.render(this.scene, this.camera);

        this.controls.update();

        requestAnimationFrame(this.render);
    }
}

loadData();