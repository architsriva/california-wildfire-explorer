const container = document.getElementById("globeViz");

const myGlobe = new Globe(container)
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
  .backgroundColor("rgba(0,0,0,0)")
  .showAtmosphere(true)
  .atmosphereColor("#5bd6ff")
  .atmosphereAltitude(0.18);

myGlobe.width(container.clientWidth);
myGlobe.height(container.clientHeight);

myGlobe.pointOfView(
  { lat: 36.7783, lng: -119.4179, altitude: 1.8 },
  1500
);

const controls = myGlobe.controls();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.45;
controls.enablePan = false;
controls.minDistance = 220;
controls.maxDistance = 420;

window.addEventListener("resize", () => {
  myGlobe.width(container.clientWidth);
  myGlobe.height(container.clientHeight);
});

// California polygon highlight
const californiaGeoJsonUrl =
  "https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson";

let pulse = 1;
let direction = 1;

fetch(californiaGeoJsonUrl)
  .then((res) => res.json())
  .then((californiaGeoJson) => {
    const features =
      californiaGeoJson.type === "FeatureCollection"
        ? californiaGeoJson.features
        : [californiaGeoJson];

    myGlobe
      .polygonsData(features)
      .polygonCapColor(() => {
        const alpha = 0.35 + pulse * 0.35;
        return `rgba(255,106,61,${alpha})`;
      })
      .polygonSideColor(() => "rgba(255,106,61,0.12)")
      .polygonStrokeColor(() => "rgba(255,170,120,0.95)")
      .polygonAltitude(() => 0.02 + pulse * 0.025)
      .polygonsTransitionDuration(0);

    function animateCaliforniaPulse() {
      pulse += 0.015 * direction;

      if (pulse >= 1 || pulse <= 0) {
        direction *= -1;
      }

      myGlobe
        .polygonCapColor(() => {
          const alpha = 0.35 + pulse * 0.35;
          return `rgba(255,106,61,${alpha})`;
        })
        .polygonAltitude(() => 0.02 + pulse * 0.025);

      requestAnimationFrame(animateCaliforniaPulse);
    }

    animateCaliforniaPulse();
  })
  .catch((err) => {
    console.error("Failed to load California polygon GeoJSON:", err);
  });
