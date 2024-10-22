import React, { useEffect, useState } from "react";
import { Feature, Map, Overlay, View } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat, Projection, transformExtent } from "ol/proj";
import { getCenter } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import { Point } from "ol/geom";
import { Style as OLStyle, Icon as OLIcon } from "ol/style";
import "@/app/styles/map.css";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { FLOAT } from "ol/webgl";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";

function calculateNewCoordinates(lat: any, long: any, distanceKm: any) {
  const earthRadiusKm = 6371;
  const deltaLat = distanceKm / earthRadiusKm;
  const newLatUp = lat + deltaLat * (180 / Math.PI);
  const newLatDown = lat - deltaLat * (180 / Math.PI);
  const deltaLong =
    distanceKm / (earthRadiusKm * Math.cos(lat * (Math.PI / 180)));
  const newLongRight = long + deltaLong * (180 / Math.PI);
  const newLongLeft = long - deltaLong * (180 / Math.PI);
  return {
    top: { lat: newLatUp, long: long },
    bottom: { lat: newLatDown, long: long },
    right: { lat: lat, long: newLongRight },
    left: { lat: lat, long: newLongLeft },
  };
}

interface InputDataMap {
  data: {
    id: string;
    gateway_id: string;
    imsi: string;
    lat: string;
    lng: string;
    status: string;
    type_schedule: string;
    using_sensor: string;
    last_power: string;
  } | null;
}

export type OutputDataMap = {
  id?: string;
  gateway_id?: string;
  imsi?: string;
  lat?: string;
  lng?: string[];
  status: string;
  type_schedule: string;
  using_sensor: string;
  last_power: string;
};

const StaticMapComponent: React.FC<InputDataMap> = ({ data }: any) => {
  const t = useTranslations("MapTotal");

  useEffect(() => {
    if (data) {
    }

    const lat = Number(process.env.NEXT_PUBLIC_MAP_LAT ?? 14.031702);
    const lng = Number(process.env.NEXT_PUBLIC_MAP_LONG ?? 100.344048);
    const zoom = Number(process.env.NEXT_PUBLIC_MAP_ZOOM ?? 12);
    const km = Number(process.env.NEXT_PUBLIC_MAP_KM ?? 20);

    const icons: { [key: number]: string } = {
      0: "/icon/lamp/lamp-gray-a.png",
      1: "/icon/lamp/lamp-gray-m.png",
      2: "/icon/lamp/lamp-gray-e.png",
      3: "/icon/lamp/lamp-gray-dis.png",
      4: "/icon/lamp/lamp-green-a.png",
      5: "/icon/lamp/lamp-green-m.png",
      6: "/icon/lamp/lamp-green-e.png",
      7: "/icon/lamp/lamp-green-dis.png",
      8: "/icon/lamp/lamp-yellow.png",
      9: "/icon/lamp/lamp-blue-a.png",
      10: "/icon/lamp/lamp-red-dis24.png",
    };

    var dataLatLong = calculateNewCoordinates(lat, lng, km);
    var extent = [
      dataLatLong.left.long,
      dataLatLong.bottom.lat,
      dataLatLong.right.long,
      dataLatLong.top.lat,
    ];

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: process.env.NEXT_PUBLIC_MAP_URL,
            attributions: [
              '© <a href="https://qgis.org/">QGIS</a>',
              '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              '<a href="https://hub.docker.com/r/maptiler/tileserver-gl">TileServer GL</a>',
            ],
          }),
        }),

        new VectorLayer({
          source: new VectorSource({
            features: [],
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: zoom,
        minZoom: zoom - 5,
        maxZoom: zoom + 5,
        extent: transformExtent(extent, "EPSG:4326", "EPSG:3857"),
      }),
    });

    const vectorSource = new VectorSource();
    data?.forEach((item: OutputDataMap) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([Number(item.lng), Number(item.lat)])),
        imsi: item.imsi,
      });

      //var icon_map;
      var icon_map = Number(0);

      switch (item.status) {
        case "0":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 0;
          } else {
            icon_map = 1;
          }
          break;
        case "1":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 4;
          } else {
            icon_map = 5;
          }
          break;
        case "2":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 0;
          } else {
            icon_map = 1;
          }
          break;
        case "3":
          if (parseInt(item.last_power) > 5) {
            icon_map = 6;
          } else {
            icon_map = 2;
          }
          break;
        case "4":
          if (
            item.type_schedule !== "manual" &&
            item.using_sensor.toLowerCase() !== "false"
          ) {
            icon_map = 10;
          } else {
            icon_map = 10;
          }
          break;
        case "5":
          if (parseInt(item.last_power) > 5) {
            icon_map = 7;
          } else {
            icon_map = 3;
          }
          break;
        case "6":
          if (parseInt(item.last_power) > 5) {
            icon_map = 7;
          } else {
            icon_map = 3;
          }
          break;
      }

      console.log(item);
      const style = new OLStyle({
        image: new OLIcon({
          src: icons[icon_map],
          scale: 0.5,
          anchor: [0.5, 1],
        }),
      });

      feature.setStyle(style);
      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    const popupElement = document.createElement("div");
    popupElement.className = "ol-popup";
    popupElement.id = "popup";
    //popupElement.innerHTML = "<p>Hello, this is a popup!</p>";
    const popup = new Overlay({
      element: popupElement,
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -30],
    });
    map.addOverlay(popup);

    map.on("click", async function (event) {
      const pixel = map.getEventPixel(event.originalEvent);
      const feature = map.getFeaturesAtPixel(pixel)[0];

      if (feature) {
        const geometry = feature.getGeometry();
        //const coordinates = feature.getGeometry()!.getCoordinates();
        if (geometry && geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          popup.setPosition(coordinates);
          // popupElement.innerHTML = `<div role="status">
          //     <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          //       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          //       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          //     </svg>
          //     <span class="sr-only">Loading...</span>
          //   </div>`;

          const res = await fetch("/api/get-detail-device", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "API-Key": "1234",
            },
            body: JSON.stringify({
              imsi: feature.get("imsi"),
            }),
          });

          const result = await res.json();
          if (res.status == 200) {
            console.log(result);
            popupElement.innerHTML = `
                <div >
                  <strong>${t(`group`)}:</strong> ${result.data.group_name}<br>
                  <strong>${t(`imsi`)}:</strong> ${result.data.imsi}<br>
                  <strong>${t(`last-update`)}:</strong> ${result.data.last_update}<br>
                  <strong>${t(`last-command`)}:</strong> ${result.data.last_command}<br>
                  <strong>${t(`last-status`)}:</strong> ${result.data.last_status}<br>
                  <strong>${t(`gov`)}:</strong> ${result.data.number_gov}<br>
                  <strong>${t(`streetlight-name`)}:</strong> ${result.data.street_light_name}<br>
                  <strong>${t(`auto-mode`)}:</strong> ${result.data.street_light_name}<br>
                  <button id="popup-command-open" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">${t(`btn-open`)}</button>
                  <button id="popup-command-close" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">${t(`btn-close`)}</button>
                  <button id="popup-command-read" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">${t(`btn-read`)}</button>
                  <button id="popup-close" class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Close</button>
                </div>
              `;
          } else {
          }
        }

        const CommandOpenButton = popupElement.querySelector(
          "#popup-command-open"
        );
        const CommandCloseButton = popupElement.querySelector(
          "#popup-command-close"
        );
        const CommandReadButton = popupElement.querySelector(
          "#popup-command-read"
        );
        const closeButton = popupElement.querySelector("#popup-close");

        if (CommandOpenButton) {
          CommandOpenButton.addEventListener("click", () => {
            CommandOpenButton.textContent = "Opennnn";
            CommandOpenButton.setAttribute("disabled", "");
          });
        }

        if (CommandCloseButton) {
          CommandCloseButton.addEventListener("click", () => {
            CommandCloseButton.textContent = "Cloessss";
            CommandCloseButton.setAttribute("disabled", "");
          });
        }

        if (CommandReadButton) {
          CommandReadButton.addEventListener("click", () => {
            CommandReadButton.textContent = "Readddd";
            CommandReadButton.setAttribute("disabled", "");
          });
        }

        if (closeButton) {
          closeButton.addEventListener("click", () => {
            popup.setPosition(undefined); // Hide the popup
          });
        }
        //const coordinates = feature.getGeometry()!.getCoordinates();
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
  }, [data]);

  return (
    <Card className="m-1">
      <CardBody className="overflow-visible p-0">
        <div id="map" className="w-full h-[700px]"></div>
      </CardBody>
    </Card>
  );
};

export default StaticMapComponent;
