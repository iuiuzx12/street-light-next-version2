import React, { useEffect, useRef, useState } from "react";
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
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { tree } from "next/dist/build/templates/app-page";
import { ListLatLong } from "@/app/interface/map";

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
  data: ListLatLong[] | null;
  high  : string;
}
// interface InputDataMap {
//   data: {
//     id: string;
//     gateway_id: string;
//     imsi: string;
//     lat: string;
//     lng: string;
//     status: string;
//     type_schedule: string;
//     using_sensor: string;
//     last_power: string;
//   } | null;
// }

export type OutputDataMap = {
  id?: string;
  gateway_id?: string;
  imsi?: string;
  lat?: string;
  lng?: string;
  status: string;
  type_schedule: string;
  using_sensor: string;
  last_power: string;
};

export type DetailImsi = {
  group?: any | null;
  imsi?: any | null;
  gateway_id?: any | null;
  type_schedule?: any | null;
  using_sensor?: any | null;
  last_update?: any | null;
  last_command?: any | null;
  last_status?: any | null;
  number_gov?: any | null;
  street_light_name: any | null;
} | null;

//const StaticMapXYZComponent: React.FC<InputDataMap> = ({ data }: any) => {
const StaticMapXYZComponent: React.FC<InputDataMap> = ({ data , high }: any) => {
  const t = useTranslations("MapTotal");

  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoadingOpen, setLoadingOpen] = React.useState(false);
  const [isLoadingClose, setLoadingClose] = React.useState(false);
  const [isLoadingRead, setLoadingRead] = React.useState(false);
  const [isDisabledOpen , setDisabledOpen] = React.useState(true);
  const [isDisabledClose , setDisabledClose] = React.useState(true);
  const [isDisabledRead , setDisabledRead] = React.useState(true);
  const [dataDetailImsi, setDataDetailImsi] = React.useState<DetailImsi>(null);
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? "LOCAL";

  var popup: any;
  useEffect(() => {
    if (data) {
      //console.log(data)
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
      //target: "map",
      target: mapRef.current!,
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
        minZoom: zoom - 10,
        maxZoom: zoom + 10,
        extent: transformExtent(extent, "EPSG:4326", "EPSG:3857"),
      }),
    });

    const vectorSource = new VectorSource();
    data?.forEach((item: OutputDataMap) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([Number(item.lng), Number(item.lat)])),
        imsi: item.imsi,
        gateway_id : item.gateway_id,
        type_schedule : item.type_schedule,
        using_sensor : item.using_sensor,
        
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

      //console.log(item);
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

    const popupElement3 = document.createElement("div");
    const popupElement = overlayRef.current;
    popupElement3.className = "ol-popup";
    popupElement3.id = "popup";

    //popupElement.innerHTML = "<p>Hello, this is a popup!</p>";
    //popupElement.innerHTML = "<p>Hello, this is a popup!</p>";
    popup = new Overlay({
      element: popupElement!,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -30],
    });
    map.addOverlay(popup);

    map.on("click", async function (event) {
      const pixel = map.getEventPixel(event.originalEvent);
      const feature = map.getFeaturesAtPixel(pixel)[0];

      //setisBtn(false);

      if (feature) {
        const geometry = feature.getGeometry();
        //const coordinates = feature.getGeometry()!.getCoordinates();
        if (geometry && geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          popup.setPosition(coordinates);
          setOverlayVisible(true);
          setDisabledOpen(true)
          setDisabledClose(true)
          setDisabledRead(true)

          const res = await fetch("/api/map/get-detail-device", {
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
            setIsLoaded(true);
            setDisabledOpen(false)
            setDisabledClose(false)
            setDisabledRead(false)
            setDataDetailImsi({
              group: result.data.group_name,
              imsi: result.data.imsi,
              gateway_id : feature.get("gateway_id"),
              type_schedule : feature.get("type_schedule"),
              last_update: result.data.last_update,
              last_status: result.data.last_status,
              last_command: result.data.last_command,
              number_gov: result.data.number_gov,
              street_light_name: result.data.street_light_name,
            });
            
          } else {

          }
        }

      } else {
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

  const command = async (type: string, imsi : string) => {
    
    
    
    switch (type) {
      case "open":
        setLoadingOpen(true)
        setDisabledClose(true)
        setDisabledRead(true)
        const resOpen = fetchCommand(imsi, "1","100")
        if (await resOpen == true){
          setLoadingOpen(false)
          setDisabledClose(false)
          setDisabledRead(false)
        }
        break;
      case "close":
        setLoadingClose(true)
        setDisabledOpen(true)
        setDisabledRead(true)
        const resClose = fetchCommand(imsi, "0","1")
        if (await resClose == true){
          setLoadingClose(false)
          setDisabledOpen(false)
          setDisabledRead(false)
        }
        break;
      case "read":
        setLoadingRead(true)
        setDisabledOpen(true)
        setDisabledClose(true)
        fetchReadPower(imsi)
        break;
    
      default:
        break;
    }
  };

  const fetchCommand = async (imsi : string , command : string, dim : string) => {
    const res = await fetch("/api/command-mqtt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        type_open: "imsi",
        imsi: imsi,
        subscribe: projectId +"/RESPONSE/" + imsi,
        wait_time: "20",
        command_type: command,
        dim_percent: dim,
      }),
    });

    const result = await res.json();
    if (res.status == 200) {
      return true
    } else {
      setLoadingOpen(false)
      setLoadingClose(false)
      setLoadingRead(false)
      setDisabledOpen(false)
      setDisabledClose(false)
      setDisabledRead(false)
      return false
    }
  };

  const fetchReadPower = async (imsi : string) => {
    const message = {
      Type : "GetPower",
      TOKEN : generateRandomToken(15)
    }
    const res = await fetch("/api/get-data-power", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": "1234",
      },
      body: JSON.stringify({
        topic: dataDetailImsi?.gateway_id + "/" +imsi,
        message: JSON.stringify(message),
        subscribe: projectId + "/" + imsi,
        wait_time: "20"
      }),
    });

    const result = await res.json();
    if (res.status == 200) {

      setLoadingOpen(false)
      setLoadingClose(false)
      setLoadingRead(false)
      setDisabledOpen(false)
      setDisabledClose(false)
      setDisabledRead(false)
      
    } else {

      setLoadingOpen(false)
      setLoadingClose(false)
      setLoadingRead(false)
      setDisabledOpen(false)
      setDisabledClose(false)
      setDisabledRead(false)

    }
  };

  const generateRandomToken = (length : number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomToken = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomToken += chars[randomIndex];
    }
    return randomToken;
  };

  const close = () => {
    setIsLoaded(false);
    setOverlayVisible(false);
  };

  const setModeStreetLight = (imsi : string, type : string) => {
    
  };

  return (
    <Card className="m-1">
      <CardBody className="overflow-visible p-0">
        {/* <div id="map" className="w-full h-[700px]"></div> */}

        <div>
          <div ref={mapRef} className={high} style={{ width: "100%" }} />
          <Card
            ref={overlayRef}
            style={{
              display: overlayVisible ? "block" : "none",
              background: "white",
            }}
            className="w-[350px] space-y-5 p-4"
            radius="lg"
          >
            <Button
              style={{ float: "right" }}
              isIconOnly
              size="sm"
              radius="md"
              className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg -m-15"
              onClick={close}
            >
              <Icon icon="lucide:circle-x" width="auto" height="auto" />
            </Button>
            <div className="space-y-3">
              <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                <p>
                  {t(`group`)} : {dataDetailImsi?.group}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`imsi`)} : {dataDetailImsi?.imsi}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`last-update`)} : {dataDetailImsi?.last_update}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`last-command`)} : {dataDetailImsi?.last_command}{" "}
                  {t(`last-command`)} : {dataDetailImsi?.last_command}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`last-status`)} : {dataDetailImsi?.last_status}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`gov`)} : {dataDetailImsi?.number_gov}
                </p>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="w-5/5 rounded-lg">
                <p>
                  {t(`auto-mode`)} : {" "}
                  {dataDetailImsi?.type_schedule == "manual" ? (
                    <Button
                      size="sm"
                      radius="sm"
                      className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg"
                      onClick={() =>
                        setModeStreetLight(dataDetailImsi?.imsi, "time")
                      }
                      
                    ><Icon icon="lucide:x" /> {t(`btn-close-sensor`)}</Button>
                  ) : dataDetailImsi?.using_sensor == "True" ? (
                    <Button
                      size="sm"
                      radius="sm"
                      className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg"
                      onClick={() =>
                        setModeStreetLight(dataDetailImsi?.imsi, dataDetailImsi?.type_schedule )
                      }
                    ><Icon icon="lucide:check" /> {t(`btn-open-sensor`)}</Button>
                  ) : (
                    <Button
                      size="sm"
                      radius="sm"
                      className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg"
                      onClick={() =>
                        setModeStreetLight(dataDetailImsi?.imsi, "time")
                      }
                    ><Icon icon="lucide:x" />{t(`btn-close-sensor`)}</Button>
                  )}
                </p>
              </Skeleton>

              <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1">
                <Button
                  isLoading={isLoadingOpen}
                  isDisabled={isDisabledOpen}
                  radius="md"
                  className="bg-gradient-to-tr from-green-500 to-green-300 text-white shadow-lg"
                  onClick={() => command("open", dataDetailImsi?.imsi)}
                >
                  {isLoadingOpen ? t(`btn-wait-open`) : t(`btn-open`)}
                </Button>
                <Button
                  isLoading={isLoadingClose}
                  isDisabled={isDisabledClose}
                  radius="md"
                  className="bg-gradient-to-tr from-red-500 to-red-300 text-white shadow-lg mx-1"
                  onClick={() => command("close", dataDetailImsi?.imsi)}
                >
                  {t(`btn-close`)}
                </Button>
                <Button
                  isLoading={isLoadingRead}
                  isDisabled={isDisabledRead}
                  radius="md"
                  className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white shadow-lg"
                  onClick={() => command("read", dataDetailImsi?.imsi)}
                >
                  {t(`btn-read`)}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default StaticMapXYZComponent;
