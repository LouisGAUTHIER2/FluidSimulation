// @ts-nocheck
import * as THREE from 'three';

class Material {
    #fragmentShader;
    #vertexShader;
    #uniforms;
    #THREEmaterial;

    /**
     * 
     * @param {String} fragmentShader 
     * @param {String} vertexShader 
     * @param {any} uniforms
     */
    constructor(vertexShader, fragmentShader, uniforms) {
        this.#fragmentShader = fragmentShader;
        this.#vertexShader = vertexShader;
        this.#uniforms = uniforms;

        this.#THREEmaterial = new THREE.ShaderMaterial({
            fragmentShader: this.#fragmentShader,
            vertexShader: this.#vertexShader,
            uniforms: this.#uniforms
        })
    }

    get Material() {
        return this.#THREEmaterial;
    }
}

export {Material};