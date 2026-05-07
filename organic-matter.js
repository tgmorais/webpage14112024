(() => {
  const TIFF_PATH = "assets/data/DHL_2025-03-31_OM.tif";
  const CLASS_CONFIG = [
    { key: "c1", label: "0.6 - 0.8", color: "#3d1f0f", min: 0.6, max: 0.8 },
    { key: "c2", label: "0.8 - 1.2", color: "#8c4f24", min: 0.8, max: 1.2 },
    { key: "c3", label: "1.2 - 1.4", color: "#c4733d", min: 1.2, max: 1.4 },
    { key: "c4", label: "> 1.4", color: "#f19155", min: 1.4, max: Number.POSITIVE_INFINITY }
  ];

  const state = {
    map: null,
    rasterLayer: null,
    georaster: null,
    distribution: [],
    totalValidPixels: 0,
    areaPerPixelHa: 0,
    meanSoc: 0
  };

  const ui = {
    mapStatus: null,
    openDistributionBtn: null,
    closeDistributionBtn: null,
    distributionModal: null,
    distributionList: null,
    classBars: null,
    classTableBody: null,
    kpiMean: null,
    kpiTotalArea: null,
    kpiValidPixels: null,
    kpiDominantClass: null
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    ui.mapStatus = document.getElementById("om-map-status");
    ui.openDistributionBtn = document.getElementById("open-distribution");
    ui.closeDistributionBtn = document.getElementById("close-distribution");
    ui.distributionModal = document.getElementById("distribution-modal");
    ui.distributionList = document.getElementById("distribution-list");
    ui.classBars = document.getElementById("soc-class-bars");
    ui.classTableBody = document.getElementById("soc-class-table-body");
    ui.kpiMean = document.getElementById("soc-mean");
    ui.kpiTotalArea = document.getElementById("soc-total-area");
    ui.kpiValidPixels = document.getElementById("soc-valid-pixels");
    ui.kpiDominantClass = document.getElementById("soc-dominant-class");

    if (window.location.protocol === "file:") {
      setMapStatus("Open this page via http://localhost (file:// blocks GeoTIFF loading in Chrome).");
      return;
    }

    bindModalEvents();
    initMap();
    loadRasterAndRender();
  }

  function bindModalEvents() {
    if (!ui.openDistributionBtn || !ui.closeDistributionBtn || !ui.distributionModal) {
      return;
    }

    ui.openDistributionBtn.addEventListener("click", openDistributionModal);
    ui.closeDistributionBtn.addEventListener("click", closeDistributionModal);

    ui.distributionModal.addEventListener("click", (event) => {
      if (event.target === ui.distributionModal) {
        closeDistributionModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !ui.distributionModal.classList.contains("hidden")) {
        closeDistributionModal();
      }
    });
  }

  function openDistributionModal() {
    if (!ui.distributionModal) {
      return;
    }
    renderDistribution();
    ui.distributionModal.classList.remove("hidden");
    ui.distributionModal.setAttribute("aria-hidden", "false");
  }

  function closeDistributionModal() {
    if (!ui.distributionModal) {
      return;
    }
    ui.distributionModal.classList.add("hidden");
    ui.distributionModal.setAttribute("aria-hidden", "true");
  }

  function setMapStatus(message) {
    if (ui.mapStatus) {
      ui.mapStatus.textContent = message;
    }
  }

  function initMap() {
    if (!window.L) {
      setMapStatus("Leaflet is not available.");
      return;
    }

    state.map = window.L.map("om-map", {
      center: [39.362, -8.553],
      zoom: 12,
      zoomControl: false
    });

    window.L.control.zoom({ position: "bottomleft" }).addTo(state.map);
    state.map.createPane("rasterPane");
    state.map.getPane("rasterPane").style.zIndex = "450";
    state.map.getPane("rasterPane").style.pointerEvents = "none";

    const baseLayers = {
      "CARTO Light": window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 20
      }),
      OpenStreetMap: window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 20
      }),
      "Esri Imagery": window.L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 20
        }
      )
    };

    baseLayers["CARTO Light"].addTo(state.map);
    window.L.control.layers(baseLayers, {}, { position: "topright", collapsed: true }).addTo(state.map);
    state.map.on("baselayerchange", () => {
      state.rasterLayer?.bringToFront?.();
    });
  }

  function getRasterParser() {
    const w = window;
    if (typeof w.parseGeoraster === "function") return w.parseGeoraster;
    if (typeof w.parseGeoRaster === "function") return w.parseGeoRaster;
    if (typeof w.georaster === "function") return w.georaster;
    if (typeof w.georaster?.default === "function") return w.georaster.default;
    if (w.georaster?.default?.parse) return w.georaster.default.parse;
    if (w.georaster?.parse) return w.georaster.parse;
    return null;
  }

  async function loadRasterAndRender() {
    const parser = getRasterParser();
    if (!state.map || !parser || typeof window.GeoRasterLayer !== "function") {
      setMapStatus("Raster libraries are not available.");
      return;
    }

    setMapStatus("Loading GeoTIFF...");

    try {
      const arrayBuffer = await loadArrayBuffer(TIFF_PATH);
      state.georaster = await parser(arrayBuffer);
      if (!state.georaster) {
        throw new Error("GeoTIFF parser returned no raster object.");
      }

      computeDistributionFromRaster();
      drawRasterLayer();
      renderDashboardPanels();

      const crs = String(state.georaster.projection || "unknown");
      setMapStatus(`GeoTIFF loaded (CRS ${crs})`);
    } catch (error) {
      setMapStatus(`Map loading error: ${error?.message || "unknown error"}`);
    }
  }

  async function loadArrayBuffer(relativePath) {
    const pageUrl = new URL(window.location.href);
    const resolvedUrl = new URL(relativePath, pageUrl).toString();
    const baseDir = pageUrl.href.replace(/[^/]*$/, "");

    const candidates = Array.from(
      new Set([relativePath, `./${relativePath}`, resolvedUrl, `${baseDir}${relativePath}`])
    );

    const loadViaXhr = (url) =>
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
            resolve(xhr.response);
            return;
          }
          reject(new Error(`XHR ${xhr.status} for ${url}`));
        };
        xhr.onerror = () => reject(new Error(`XHR network error for ${url}`));
        xhr.send();
      });

    let lastError = null;
    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${candidate}`);
        }
        return await response.arrayBuffer();
      } catch (fetchError) {
        try {
          return await loadViaXhr(candidate);
        } catch (xhrError) {
          lastError = xhrError || fetchError;
        }
      }
    }

    throw lastError || new Error("Could not read GeoTIFF from any candidate path.");
  }

  function getColorForSoc(value) {
    for (let i = 0; i < CLASS_CONFIG.length; i += 1) {
      if (value >= CLASS_CONFIG[i].min && value < CLASS_CONFIG[i].max) {
        return CLASS_CONFIG[i].color;
      }
    }
    return null;
  }

  function drawRasterLayer() {
    if (!state.map || !state.georaster || typeof window.GeoRasterLayer !== "function") {
      return;
    }

    if (state.rasterLayer) {
      state.map.removeLayer(state.rasterLayer);
      state.rasterLayer = null;
    }

    const noDataRaw = state.georaster.noDataValue;
    const noData = Number.isFinite(Number(noDataRaw)) ? Number(noDataRaw) : null;

    state.rasterLayer = new window.GeoRasterLayer({
      georaster: state.georaster,
      pane: "rasterPane",
      pixelValuesToColorFn: (values) => {
        const value = values?.[0];
        if (!Number.isFinite(value)) return null;
        if (noData !== null && Math.abs(value - noData) < 1e-9) return null;
        return getColorForSoc(value);
      },
      resolution: 512,
      resampleMethod: "nearest",
      opacity: 0.9
    });

    state.rasterLayer.addTo(state.map);
    state.map.fitBounds(state.rasterLayer.getBounds());
  }

  function computeDistributionFromRaster() {
    const band = state.georaster?.values?.[0];
    if (!band || !Array.isArray(band)) {
      state.distribution = [];
      state.totalValidPixels = 0;
      state.areaPerPixelHa = 0;
      return;
    }

    const noDataRaw = state.georaster.noDataValue;
    const noData = Number.isFinite(Number(noDataRaw)) ? Number(noDataRaw) : null;
    const counts = new Map(CLASS_CONFIG.map((c) => [c.key, 0]));

    let totalValidPixels = 0;
    let sumSoc = 0;
    for (let row = 0; row < band.length; row += 1) {
      const rowValues = band[row];
      if (!rowValues) continue;
      for (let col = 0; col < rowValues.length; col += 1) {
        const value = rowValues[col];
        if (!Number.isFinite(value)) continue;
        if (noData !== null && Math.abs(value - noData) < 1e-9) continue;

        for (let i = 0; i < CLASS_CONFIG.length; i += 1) {
          const klass = CLASS_CONFIG[i];
          if (value >= klass.min && value < klass.max) {
            counts.set(klass.key, (counts.get(klass.key) || 0) + 1);
            totalValidPixels += 1;
            sumSoc += value;
            break;
          }
        }
      }
    }

    state.totalValidPixels = totalValidPixels;
    state.areaPerPixelHa = estimateAreaPerPixelHa();
    state.meanSoc = totalValidPixels > 0 ? sumSoc / totalValidPixels : 0;

    state.distribution = CLASS_CONFIG.map((klass) => {
      const pixelCount = counts.get(klass.key) || 0;
      const percentage = totalValidPixels > 0 ? (pixelCount / totalValidPixels) * 100 : 0;
      const approxAreaHa = pixelCount * state.areaPerPixelHa;
      return {
        label: klass.label,
        color: klass.color,
        pixelCount,
        percentage,
        approxAreaHa
      };
    });
  }

  function renderDashboardPanels() {
    renderClassBars();
    renderClassTable();
    renderKpis();
  }

  function renderClassBars() {
    if (!ui.classBars) {
      return;
    }

    if (!state.distribution.length) {
      ui.classBars.innerHTML = "<p>No SOC distribution data available.</p>";
      return;
    }

    ui.classBars.innerHTML = state.distribution
      .map((item) => {
        const pctText = `${item.percentage.toFixed(1)}%`;
        return `
          <article class="soc-class-bar-row">
            <div class="soc-class-bar-head">
              <span class="soc-class-label"><i style="background:${item.color}"></i><strong>${item.label}</strong></span>
              <span>${pctText}</span>
            </div>
            <div class="soc-class-track">
              <div class="soc-class-fill" style="width:${item.percentage}%;background:${item.color}"></div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderClassTable() {
    if (!ui.classTableBody) {
      return;
    }

    if (!state.distribution.length) {
      ui.classTableBody.innerHTML = "<tr><td colspan=\"4\">No SOC distribution data available.</td></tr>";
      return;
    }

    ui.classTableBody.innerHTML = state.distribution
      .map((item) => {
        return `
          <tr>
            <td><span class="soc-class-label"><i style="background:${item.color}"></i><strong>${item.label}</strong></span></td>
            <td>${item.pixelCount.toLocaleString()}</td>
            <td>${item.percentage.toFixed(1)}%</td>
            <td>${item.approxAreaHa.toFixed(1)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function renderKpis() {
    if (ui.kpiMean) {
      ui.kpiMean.textContent = state.totalValidPixels > 0 ? `${state.meanSoc.toFixed(2)} %` : "-";
    }
    if (ui.kpiTotalArea) {
      const totalAreaHa = state.totalValidPixels * state.areaPerPixelHa;
      ui.kpiTotalArea.textContent = state.totalValidPixels > 0 ? `${Math.round(totalAreaHa).toLocaleString()} ha` : "-";
    }
    if (ui.kpiValidPixels) {
      ui.kpiValidPixels.textContent = state.totalValidPixels > 0 ? state.totalValidPixels.toLocaleString() : "-";
    }
    if (ui.kpiDominantClass) {
      const dominant = [...state.distribution].sort((a, b) => b.percentage - a.percentage)[0];
      ui.kpiDominantClass.textContent = dominant ? dominant.label : "-";
    }
  }

  function estimateAreaPerPixelHa() {
    const pxW = Math.abs(Number(state.georaster?.pixelWidth || 0));
    const pxH = Math.abs(Number(state.georaster?.pixelHeight || 0));
    if (!Number.isFinite(pxW) || !Number.isFinite(pxH) || pxW <= 0 || pxH <= 0) {
      return 0;
    }

    const projection = Number(state.georaster?.projection);
    if (projection === 4326) {
      const latCenter = (Number(state.georaster.ymin) + Number(state.georaster.ymax)) / 2;
      const latCos = Math.cos((latCenter * Math.PI) / 180);
      const meterPerDegLat = 111132;
      const meterPerDegLon = 111320 * Math.max(0.1, latCos);
      const areaM2 = (pxW * meterPerDegLon) * (pxH * meterPerDegLat);
      return areaM2 / 10000;
    }

    return (pxW * pxH) / 10000;
  }

  function renderDistribution() {
    if (!ui.distributionList) {
      return;
    }

    if (!state.distribution.length || state.totalValidPixels <= 0) {
      ui.distributionList.innerHTML = "<p>No SOC distribution data available.</p>";
      return;
    }

    const totalAreaHa = state.totalValidPixels * state.areaPerPixelHa;
    const rowsHtml = state.distribution
      .map((item) => {
        const pctText = `${item.percentage.toFixed(1)}%`;
        const pxText = `${item.pixelCount.toLocaleString()} px`;
        const areaText = `${item.approxAreaHa.toFixed(1)} ha`;
        return `
          <article class="soc-dist-row">
            <div class="soc-dist-head">
              <span class="soc-dist-label"><i style="background:${item.color}"></i><strong>${item.label}</strong></span>
              <span>${pctText} · ${pxText} · ${areaText}</span>
            </div>
            <div class="soc-dist-track">
              <div class="soc-dist-fill" style="width:${item.percentage}%;background:${item.color}"></div>
            </div>
          </article>
        `;
      })
      .join("");

    ui.distributionList.innerHTML = `
      <p><strong>Total valid pixels:</strong> ${state.totalValidPixels.toLocaleString()} · <strong>Approx. mapped area:</strong> ${totalAreaHa.toFixed(1)} ha</p>
      ${rowsHtml}
    `;
  }
})();
