// @ts-check
import * as THREE from 'three';

class Normals {
    // @ts-ignore
    #normals;
    #numComponent;

    constructor () {
        this.#normals = [];
        this.#numComponent = 3;
    }

    /**
     * Coordonnées des normals
     * @param {THREE.Vector3} p1
     * @param {THREE.Vector3} p2 
     * @param {THREE.Vector3} p3 
     */
    pushFace(p1, p2, p3) {
        this.#normals.push( ...[p1.x, p1.y, p1.z]);
        this.#normals.push( ...[p2.x, p2.y, p2.z]);
        this.#normals.push( ...[p3.x, p3.y, p3.z]);
    }

    get ValueName() {
        return "normal"
    }

    get Attribute() {
        return new THREE.Float32BufferAttribute(this.#normals, this.#numComponent);
    }
}

export {Normals};