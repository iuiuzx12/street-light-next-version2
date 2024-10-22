import React, { useEffect } from 'react';
import { Feature, Map, Overlay, View } from "ol";
import { fromLonLat, Projection, transformExtent } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import { Point } from "ol/geom";
import { Style as OLStyle, Icon as OLIcon } from "ol/style";
import "@/app/styles/map.css"
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
interface BProps {
  data: { A: string; B: string } | null;
}

function calculateNewCoordinates(lat : any, long : any, distanceKm : any) {
    const earthRadiusKm = 6371;

    const deltaLat = distanceKm / earthRadiusKm;
    const newLatUp = lat + deltaLat * (180 / Math.PI);
    const newLatDown = lat - deltaLat * (180 / Math.PI);

    const deltaLong = distanceKm / (earthRadiusKm * Math.cos(lat * (Math.PI / 180)));
    const newLongRight = long + deltaLong * (180 / Math.PI);
    const newLongLeft = long - deltaLong * (180 / Math.PI);

    return {
        top: { lat: newLatUp, long: long },
        bottom: { lat: newLatDown, long: long },
        right: { lat: lat, long: newLongRight },
        left: { lat: lat, long: newLongLeft }
    };
}

const B: React.FC<BProps> = ({ data }) => {
  useEffect(() => {
    if (data) {
      console.log('Data received in B:', data);
    }
    const lat = 14.031702;
    const lng = 100.344048; 
    const zoom = 12;
    const km = 20;

    

    var dataLatLong = calculateNewCoordinates(lat,lng,km);
    var extent = [
        dataLatLong.left.long,
        dataLatLong.bottom.lat,
        dataLatLong.right.long,
        dataLatLong.top.lat];

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "http://localhost:8080/data/thai/{z}/{x}/{y}.png",
            attributions: [
                '© <a href="https://qgis.org/">QGIS</a>',
                '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                '<a href="https://hub.docker.com/r/maptiler/tileserver-gl">TileServer GL</a>'
            ]
          }),
        }),

        new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(
                  fromLonLat(
                    [100.344048, 14.031702],
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
        center: fromLonLat([lng, lat]),
        zoom: zoom,
        minZoom: zoom - 5,
        maxZoom: zoom + 5,
        extent: transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
      }),
    });

    // สร้าง Overlay สำหรับ Popup
    const popupElement = document.createElement("div");
    popupElement.className = "ol-popup";
    popupElement.id = "popup";
    popupElement.innerHTML = "<p>Hello, this is a popup!</p>";
    const popup = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -30],
    });
    map.addOverlay(popup);

    // การจัดการเหตุการณ์คลิก
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
            popup.setPosition(undefined); // Hide the popup
          });
        }
      } else {
        popup.setPosition(undefined); // ซ่อน popup ถ้าไม่คลิกที่หมุด
      }
    });

    // เพิ่ม Event Listener สำหรับการเลื่อนเมาส์
    map.getViewport().addEventListener("mousemove", (event) => {
      const pixel = map.getEventPixel(event);
      const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);
      if (feature) {
        map.getViewport().style.cursor = "pointer"; // เปลี่ยนเคอร์เซอร์เมื่ออยู่บนฟีเจอร์
      } else {
        map.getViewport().style.cursor = ""; // รีเซ็ตเคอร์เซอร์เมื่อไม่อยู่บนฟีเจอร์
      }
    });

    // การทำความสะอาดเมื่อ component ถูก unmount
    return () => {
      map.setTarget(undefined);
    };

  }, [data]);

  return (
    
    <div>
        <div id="map" className="w-full h-full"></div>
      <h2>Component B</h2>
      {data ? (
        <>
          <p>A: {data.A}</p>
          <p>B: {data.B}</p>
        </>
      ) : (
        <p>No data received</p>
      )}

    
    </div>
  );
};

export default B;