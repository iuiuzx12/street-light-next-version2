"use client";
import React, { useEffect } from "react";
import { Feature, Map, Overlay, View } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat, Projection } from "ol/proj";
import { getCenter } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import { Point } from "ol/geom";
import { Style as OLStyle, Icon as OLIcon } from "ol/style";
import "@/app/styles/map.css"

const StaticMapImgComponent: React.FC = () => {
  useEffect(() => {
    const imageSize = [5000, 4354];
    const imageExtent = [0, 0, 5000, 4354];
    const projection = new Projection({
      code: "EPSG:3857",
      units: "pixels",
      extent: imageExtent,
    });
    const map = new Map({
      target: "map",
      layers: [
        new ImageLayer({
          source: new ImageStatic({
            url: "/img/map/map3.jpg", 
            attributions: '© <a href="https://openlayers.org">OpenLayers</a>',
            projection: projection,
            imageExtent: imageExtent,
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(
                  fromLonLat(
                    [0.0027488447694057356, 0.005051900572524914],
                    "EPSG:3857"
                  )
                ),
                name: "Point 1",
                date: "2024-08-02",
                info1: "Info 1",
                info2: "Info 2",
                info3: "Info 3",
                info4: "Info 4",
              }),
              new Feature({
                geometry: new Point(
                  fromLonLat(
                    [0.0027498447694077356, 0.006051900572534914],
                    "EPSG:3857"
                  )
                ),
                name: "Point 2",
                date: "2024-08-02",
                info1: "Info 1",
                info2: "Info 2",
                info3: "Info 3",
                info4: "Info 4",
              }),
              new Feature({
                geometry: new Point(
                  fromLonLat(
                    [0.0027498447694077356, 0.007051900572534914],
                    "EPSG:3857"
                  )
                ),
                name: "Point 3",
                date: "2024-08-02",
                info1: "Info 1",
                info2: "Info 2",
                info3: "Info 3",
                info4: "Info 4",
              }),
            ],
          }),
          style: new OLStyle({
            image: new OLIcon({
              src: "/icon/lamp/lamp-blue-a.png",
              scale: 0.5,
              anchor: [0.5, 1],
            }),
          }),
        }),
      ],
      view: new View({
        projection: projection,
        center: getCenter(imageExtent),
        zoom: 3,
        maxZoom: 8,
      }),
    });

    const popupElement = document.createElement("div");
    popupElement.className = "ol-popup";
    //popupElement.className = "popup";
    popupElement.id = "popup";
    popupElement.innerHTML = "<p>Hello, this is a popup!</p>";
    //popupElement.style.backgroundColor = "white";
    //popupElement.style.border = "1px solid #ccc;";
    //popupElement.style.padding = "10px";
    //popupElement.style.borderRadius = "4px";
    //popupElement.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    const popup = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -30],
    });
    map.addOverlay(popup);

    map.on("click", function (event) {
      const pixel = map.getEventPixel(event.originalEvent);
      const feature = map.getFeaturesAtPixel(pixel)[0];

      if (feature) {
        const geometry = feature.getGeometry();
        //const coordinates = feature.getGeometry()!.getCoordinates();
        if (geometry && geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          popup.setPosition(coordinates);
          popupElement.innerHTML = `
            <div >
              <strong>Name:</strong> ${feature.get("name")}<br>
              <strong>Date:</strong> ${feature.get("date")}<br>
              <strong>Info 1:</strong> ${feature.get("info1")}<br>
              <strong>Info 2:</strong> ${feature.get("info2")}<br>
              <strong>Info 3:</strong> ${feature.get("info3")}<br>
              <strong>Info 4:</strong> ${feature.get("info4")}<br>
              <button id="popup-close" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Close</button>
              <button id="popup-send" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Send</button>
            </div>
          `;
        }

        //const coordinates = feature.getGeometry()!.getCoordinates();
        const closeButton = popupElement.querySelector("#popup-close");
        const sendButton = popupElement.querySelector("#popup-send");

        if (sendButton) {
          sendButton.addEventListener("click", () => {
            console.log("ddddd")
            sendButton.textContent = "FFF"
            sendButton.setAttribute("disabled","");
          });
        }
        
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            popup.setPosition(undefined); 
          });
        }
      } else {
        popup.setPosition(undefined);
      }
    });

    map.getViewport().addEventListener("mousemove", (event) => {
      const pixel = map.getEventPixel(event);
      const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
      if (feature) {
        map.getViewport().style.cursor = "pointer"; 
      } else {
        map.getViewport().style.cursor = ""; 
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return <div id="map" className="w-full h-full"></div>;
};

export default StaticMapImgComponent;
