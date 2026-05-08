// @ts-check
import * as THREE from 'three';

class Vertices {
    // @ts-ignore
    #positions;
    #numComponent;

    constructor () {
        this.#positions = [];
        this.#numComponent = 3;
    }

    /**
     * Donner les coordonnées des coins dans le sens anti-horaire
     * 3\
     * | \
     * |  \
     * 1---2
     * @param {THREE.Vector3} p1
     * @param {THREE.Vector3} p2 
     * @param {THREE.Vector3} p3 
     */
    pushFace(p1, p2, p3) {
        this.#positions.push( ...[p1.x, p1.y, p1.z]);
        this.#positions.push( ...[p2.x, p2.y, p2.z]);
        this.#positions.push( ...[p3.x, p3.y, p3.z]);
    }

    get ValueName() {
        return "position"
    }

    get Attribute() {
        return new THREE.Float32BufferAttribute(this.#positions, this.#numComponent);
    }
}

export {Vertices};