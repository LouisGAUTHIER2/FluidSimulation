// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Vector2 } from 'three';
import {UV} from 'uv'
import {Vertices} from 'vertices';
import {Normals} from 'normals';
import {Material} from 'material';
import {Plane} from 'plane';

async function loadData() {
    const responseF = await fetch('/scripts/shader/fragmentShader.frag');
    const fragmentShader = await responseF.text();

    const responseV = await fetch("/scripts/shader/vertexShader.vert");
    const vertexShader = await responseV.text();

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