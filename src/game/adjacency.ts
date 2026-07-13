import { Coord, Edges } from "../types";
import { getCoordKey, toVector } from "../utils";

/** A double-nested Map to help navigate the level */
// The first layer is used to lookup whatever node a Carrier is at
// The second layer contains every valid relative vector from that node
export class Adjacency {
    map: Map<string, Map<string, Coord>>;

    constructor(edges: Edges) {
        this.map = new Map();
        edges.forEach((edge) => {
            for (const coord of edge) {
                const coordKey = getCoordKey(coord);
                const otherCoord = getCoordKey(edge[0]) === coordKey ? edge[1] : edge[0];
                const vector = toVector([coord, otherCoord]);
                const vectorKey = getCoordKey(vector);
                const coordMap = this.map.get(coordKey);
                if (coordMap) {
                    // Node is already on the map, append to it
                    coordMap.set(vectorKey, vector);
                } else {
                    // First time we're adding this node to the map
                    this.map.set(coordKey, new Map());
                    this.map.get(coordKey)!.set(vectorKey, vector);
                }
            }
        });
    }

    /** Returns a map of relative nodes accessible from the provided coordKey */
    atNode(coordKey: string): Map<string, Coord> {
        return this.map.get(coordKey) || new Map(); // Empty map if none
    }

    /** Returns if the provided vectorKey is available from the given coordKey node */
    available(coordKey: string, vectorKey: string): boolean {
        const m = this.atNode(coordKey);
        return m.has(vectorKey);
    }
}
