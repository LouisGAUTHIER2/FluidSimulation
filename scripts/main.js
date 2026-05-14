// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Vector2 } from 'three';
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
    settings;

    /**
     * 
     * @param {String} fragmentShader 
     */
    constructor(fragmentShader, vertexShader) {
        this.fov = 40;
        this.aspect = window.innerWidth/window.innerHeight;
        this.near = 0.1;
        this.far = 10000;

        // initialisation
        this.init(fragmentShader, vertexShader);

        // entrée dans la boucle de rendering
        requestAnimationFrame(this.render);
    }

    init(fragmentShader, vertexShader) {
        this.initScene();
        this.initMesh(fragmentShader, vertexShader);
        this.initDebug();
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
        this.scene.background = new THREE.Color( 'lightblue' );

        // controle de la camera
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = 1.6*Math.PI/4;
        this.controls.minDistance = 10
        this.controls.update();
    }

    initDebug() {
        this.settings = {
            height: 10,
        };
        const gui = new GUI( { width: 300 } );
        gui.add( this.settings, 'height', 0, 20 ).onChange(this.updateDebug.bind(this));
    }

    initMesh(fragmentShader, vertexShader) {
        

		this.cube = new Plane(fragmentShader, vertexShader, new THREE.Vector2(20,20), new THREE.Vector2(500,500));
		this.scene.add( this.cube.Mesh );

        this.controls.target.set( 10, 2, 10 );

        const colora = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( colora, intensity );
		light.position.set( 0, 10, 0);
		this.scene.add( light );
    }

    updateDebug() {
        this.cube.UpdateHeight(this.settings.height);
    }

    render(time) {
        const speed = 0.001;
        const rot = time * speed;

        this.cube.Update(time);

        this.renderer.render(this.scene, this.camera);

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls.update();

        requestAnimationFrame(this.render);
    }
}

loadData();