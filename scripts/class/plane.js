// @ts-nocheck
import * as THREE from 'three';

class Plane {
    #material;
    #geometry;
    #uniforms;
    #mesh;
    #resolution;

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
            iHeightmap: {value :null},
            iDiffuse: {value: null},
            iMaxHeight: {value: 10},
        };

        this.#material = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: this.#uniforms
        })

        // creation de la geometrie
        var uv = [];
        var norm = [];
        var vert = [];
        var index = [];

        // creation des vertex
        const x_f = size.x/numCell.x;
        const y_f = size.y/numCell.y;
        this.#resolution = new THREE.Vector2(x_f, y_f)

        for (var x = 0; x < numCell.x; x++) {
            for (var y = 0; y < numCell.y; y++) {
                vert.push(...[x*x_f, 0, y*y_f])
                norm.push(...[0, 1, 0])
                uv.push(...[x/numCell.x, y/numCell.y])
            }
        }

        // ajout des faces
        for (var x = 0; x < numCell.x - 1; x++) {
            for (var y = 0; y < numCell.y - 1; y++) {
                index.push((x+1)+y*numCell.x)
                index.push(x+(y+1)*numCell.x)
                index.push(x+y*numCell.x)

                index.push((x+1)+y*numCell.x)
                index.push((x+1)+(y+1)*numCell.x)
                index.push(x+(y+1)*numCell.x)
            }
        }

        this.#geometry = new THREE.BufferGeometry();
        this.#geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vert),3));
        this.#geometry.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(norm),3));
        this.#geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv),2));
        this.#geometry.setIndex(index);

        // creation du mesh
        this.#mesh = new THREE.Mesh(this.#geometry, this.#material);

        // initialisation des textures
        const loader = new THREE.TextureLoader();
        const Heightmap = loader.load("/public/image/heightmap.png");
        const Diffuse = loader.load("/public/image/diffuse.png");
        
        this.#uniforms.iHeightmap.value = Heightmap;
        this.#uniforms.iDiffuse.value = Diffuse;
    }

    UpdateHeight(newHeight) {
        this.#uniforms.iMaxHeight.value = newHeight;
    }

    Update(time) {
        this.#uniforms.iTime.value = time*0.001;
        this.#uniforms.iResolution.value.set(this.#resolution.x, this.#resolution.y, 1)
    }

    get Mesh() {
        return this.#mesh;
    }
}

export {Plane}