/**
 * @typedef {Object} Dam
 * @property {string} link_key - Unique ID or key for the dam
 * @property {string} csv_key - Short name used in CSV or dataset
 * @property {string} display_name - Full display name of the dam
 * @property {number} elevation - Elevation of the dam (in feet)
 * @property {Array<number>} lon_lat - [longitude, latitude] coordinates
 */
/**
 * 
 * @param {Dam[]} nodes 
 * @returns {{ xMin: number, yMin: number, xMax: number, yMax: number}}
 */
export const calculateDataExtent = (nodes) => {
    return nodes.reduce(
        (acc, curr) => {
            const [currLon, currLat] = curr.lon_lat;
            return {
                xMin: Math.min(currLon, acc.xMin),
                yMin: Math.min(currLat, acc.yMin),
                xMax: Math.max(currLon, acc.xMax),
                yMax: Math.max(currLat, acc.yMax),
            };
        },
        {
            xMin: nodes[0].lon_lat[0],
            yMin: nodes[0].lon_lat[1],
            xMax: nodes[0].lon_lat[0],
            yMax: nodes[0].lon_lat[1],
        }
    );
}

const TILE_SIZE = 516;
const WORLD_METERS = 40075016.686;

/**
 * Takes a Mapbox zoom level and calculates meters per pixel
 * Assumes projection 3857 (web mercator) is used
 * @param {number} zoom Mapbox zoom
 * @returns {number}
 */
export const metersPerPixel = (zoom) => {
    return WORLD_METERS / (TILE_SIZE * Math.pow(2, zoom)) * 1.5;
};

/**
 * Convert meters per pixel at equator to meters per pixel at given latitude
 * @param {number} mppe Meters per pixel at equator
 * @param {number} lat Latitude coordinate
 * @returns {number} Meters per pixel at given latitude
 */
export const metersPerPixelLocal = (mppe, lat) => {
    // Latitude to radians
    const rad = lat * (Math.PI / 180)
    // Cosine of radian
    const cos = Math.cos(rad)
    // Apply to mppe
    return mppe * cos
}

/**
 * Convert EPSG 3857 into 4326
 */
export const mercatorToLonLat = (x, y) => {
    const R = 6378137;
    const lon = (x / R) * (180 / Math.PI);
    const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
    return [lon, lat];
}

/**
 * Convert EPSG 4326 into 3857
 */
export const lonLatToMercator = (lon, lat) => {
    const R = 6378137; // Earth radius in meters
    const x = R * (lon * Math.PI / 180);
    const y = R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 360)));
    return [x, y];
}

export const calculateImageBounds = (imageDimensions) => {
    const { zoom, width, height, center } = imageDimensions;

    const mppe = metersPerPixel(zoom);

    const mpplat = metersPerPixelLocal(mppe, center[1]);

    const halfWidth = (width / 2) * mpplat;
    const halfHeight = (height / 2) * mpplat;

    const centerMercator = lonLatToMercator(center[0], center[1]);

    const xMin = centerMercator[0] - halfWidth,
        xMax = centerMercator[0] + halfWidth,
        yMin = centerMercator[1] - halfHeight,
        yMax = centerMercator[1] + halfHeight;

    const bottomLeftLonLat = mercatorToLonLat(xMin, yMin);
    const topRightLonLat = mercatorToLonLat(xMax, yMax);

    const imageGeo = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [bottomLeftLonLat[0], bottomLeftLonLat[1]], // bottom-left
                    [topRightLonLat[0], bottomLeftLonLat[1]], // bottom-right
                    [topRightLonLat[0], topRightLonLat[1]], // top-right
                    [bottomLeftLonLat[0], topRightLonLat[1]], // top-left
                ],
            ],
        },
    };
    return { imageGeo, bottomLeftLonLat, topRightLonLat }

}