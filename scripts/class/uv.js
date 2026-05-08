// @ts-check
import * as THREE from 'three';

class UV {
    // @ts-ignore
    #uv;
    #numComponent;

    constructor () {
        this.#uv = [];
        this.#numComponent = 2;
    }

    /**
     * Donne les coordonnées des textures
     * @param {THREE.Vector3} p1
     * @param {THREE.Vector3} p2 
     * @param {THREE.Vector3} p3 
     */
    pushFace(p1, p2, p3) {
        this.#uv.push( ...[p1.x, p1.y]);
        this.#uv.push( ...[p2.x, p2.y]);
        this.#uv.push( ...[p3.x, p3.y]);
    }

    get ValueName() {
        return "uv"
    }

    get Attribute() {
        return new THREE.Float32BufferAttribute(this.#uv, this.#numComponent);
    }
}

export {UV};