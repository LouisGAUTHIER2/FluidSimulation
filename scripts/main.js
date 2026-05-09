// @ts-nocheck
import * as THREE from 'three';
import { Vector2 } from 'three';
import {UV} from 'uv'
import {Vertices} from 'vertices';
import {Normals} from 'normals';
import {Material} from 'material';

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
    }

    initMesh(fragmentShader, vertexShader) {
        const pos = new Vertices();
        const uv_t = new UV();
        const norm = new Normals();

        pos.pushFace(
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(1, -1, 0),
            new THREE.Vector3(-1, 1, 0)
        );
        uv_t.pushFace(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(0, 1)
        );
        norm.pushFace(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1)
        )
        pos.pushFace(
            new THREE.Vector3(1,  -1,  0),
            new THREE.Vector3(1, 1,  0),
            new THREE.Vector3(-1,  1,  0)
        );
        uv_t.pushFace(
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1)
        );
        norm.pushFace(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1)
        )
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(pos.ValueName ,pos.Attribute);
        geometry.setAttribute(uv_t.ValueName ,uv_t.Attribute);
        geometry.setAttribute(norm.ValueName, norm.Attribute);
        
        this.uniforms = {
            iTime: { value: 0 },
            iResolution:  { value: new THREE.Vector3() },
        };
        
        const material = new Material(
            vertexShader,
            fragmentShader,
            this.uniforms
        ).Material

		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );

        this.camera.position.z = 5;

        const colora = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( colora, intensity );
		light.position.set( - 1, 2, 4 );
		this.scene.add( light );
    }

    render(time) {
        const speed = 0.001;
        const rot = time * speed;
        this.cube.rotation.x = rot;
        this.cube.rotation.y = rot;

        this.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
        this.uniforms.iTime.value = time*0.001;

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }
}

loadData();