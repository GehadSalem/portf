declare module "three-geojson-geometry" {
  import { BufferGeometry } from "three";

  export default class GeoJsonGeometry extends BufferGeometry {
    constructor(geoJson: any, radius?: number);
  }
}
