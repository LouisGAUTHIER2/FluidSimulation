// @ts-nocheck
import * as THREE from 'three';
import {UV} from 'uv'
import {Vertices} from 'vertices';
import {Normals} from 'normals';
import {Material} from 'material';

class Plane {
    #material;
    #geometry;
    #uniforms;
    #mesh;

    /**
     * 
     * @param {String} vertexShader 
     * @param {String} fragmentShader 
     * @param {THREE.Vector2} size 
     * @param {THREE.Vector2} numCell
     */
    constructor(fragmentShader, vertexShader, size, numCell) {
        // creation du material
        this.#uniforms = {
            iTime: { value: 0 },
            iResolution:  { value: new THREE.Vector3() },
            iTexture: {value :null}
        };

        this.#material = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: this.#uniforms
        })

        // creation de la geometrie
        const uv = new UV();
        const vert = new Vertices();
        const norm = new Normals();

        const x_f = size.x/numCell.x;
        const y_f = size.y/numCell.y;
        for (var x = 0; x < numCell.x - 1; x++) {
            for (var y = 0; y < numCell.y - 1; y++) {
                vert.pushFace(
                    new THREE.Vector3((x+1)*x_f, 0, y*y_f),
                    new THREE.Vector3(x*x_f, 0, y*y_f),
                    new THREE.Vector3((x+1)*x_f, 0, (y+1)*y_f)
                );
                norm.pushFace(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(0, 1, 0),
                );
                uv.pushFace(
                    new THREE.Vector2(x/numCell.x, y/numCell.y),
                    new THREE.Vector2((x+1)/numCell.x, y/numCell.y),
                    new THREE.Vector2(x/numCell.x, (y+1)/numCell.y),
                );

                vert.pushFace(
                    new THREE.Vector3((x+1)*x_f, 0, (y+1)*y_f),
                    new THREE.Vector3(x*x_f, 0, y*y_f),
                    new THREE.Vector3(x*x_f, 0, (y+1)*y_f)
                );
                norm.pushFace(
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(0, 1, 0),
                );
                uv.pushFace(
                    new THREE.Vector2(x/numCell.x, y/numCell.y),
                    new THREE.Vector2((x+1)/numCell.x, y/numCell.y),
                    new THREE.Vector2(x/numCell.x, (y+1)/numCell.y),
                )
            }
        }

        this.#geometry = new THREE.BufferGeometry();
        this.#geometry.setAttribute(vert.ValueName, vert.Attribute);
        this.#geometry.setAttribute(norm.ValueName, norm.Attribute);
        this.#geometry.setAttribute(uv.ValueName, uv.Attribute);

        // creation du mesh
        this.#mesh = new THREE.Mesh(this.#geometry, this.#material);

        // initialisation des textures
        const loader = new THREE.TextureLoader();
        const texture = loader.load("/public/image/test.png")

        this.#uniforms.iTexture.value = texture;
    }

    Update(time) {
        this.#uniforms.iTime.value = time*0.001;
        this.#uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1)
    }

    get Mesh() {
        return this.#mesh;
    }
}

export {Plane}