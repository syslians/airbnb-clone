'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[]
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({ center }) => {
  return (
      <MapContainer 
        center={center as L.LatLngExpression || [51, -0.09]} 
        zoom={center ? 4 : 2} 
        scrollWheelZoom={false} 
        className="h-[35vh] rounded-lg"
      >
        <TileLayer
          url={url}
          attribution={attribution}
        />
        {center && (
          <Marker position={center as L.LatLngExpression} />
        )}
        {center && (
          <Marker 
           position={center as L.LatLngExpression}
          /> 
        )}
      </MapContainer>
  )
}

export default Map

/*위의 코드는 리액트기반의 웹 어플리케이견에서 지도를 표시하기 위한 Map 
컴포넌트를 정의하고 있습니다.이 컴포넌트는 react-leaflet 라이브러리를
사용하여 자도를 렌더링하며 leaflet 라이브러리를 사용하여 지도 아이콘
이미지를 설정하는 부분이 포함되어 있습니다*/

/*
1. 모듈 및 라이브러리 임포트
 - L : leaflet 라이브러리의 기본 네임스페이ㅏ스
 - MapContainer , Marker, TileLayer : react-leaflet 에서 
   제공하는 지도 컴포넌트들
 - leaflet/dist/leaflet.css: leaflet 라이브러의 스타일시트
   leaflet/dist/images/marker-icon-2x.png, 
   eaflet/dist/images/marker-icon.png, 
   leaflet/dist/images/marker-shadow.png: 마커 아이콘 이미지들
*/

/*
2. L.Icon.Default 설정
 - 기본 마커 아이콘의 이미지를 재설정하는 부분입니다.이 코드를 통해 
   React에서 정적 이미지를 불러와 마커 아이콘 이미지로 사용할수 있습니다
*/

/*
3. Map 컴포넌트 정의
  - MapProps : Map 컴포넌트에 전달되는 속성(props)타입을 정의한 인터페이스입니다
  - url, attribution : 타일 레이어(Tile Layer)에서 사용할 지도 타일 URL과 저작권 정보입니다
  - Marker : react-leaflet 에서 제공하는 타일 레이어 컴포넌트로 , 지도 타일을 보여줍니다
    OpenStreet에서 제공하는 지도 타일을 사용하고 있습니다
 - Marker : react-leaflet에서 제공하는 마커 컴포넌트로, center 속성에 
   지저된 좌표에 마커를 표시합니다.center가 존재하는 경우에만 마커를 표시합니다
*/

/*
5. Map 컴포넌트의 속성 및 기본값
center?: number[]: Map 컴포넌트에 전달되는 속성으로, 지도의 중심 좌표를 지정합니다. 기본값은 [51, -0.09]입니다.
*/

/*
이렇게 구현된 Map 컴포넌트를 사용하면 리액트 애플리케이션에서 지도를 표시할 수 있습니다.
center 속성을 통해 특정 위치에 마커를 표시하거나, center를 전달하지 않으면 기본 중심 좌표로 지도를 렌더링합니다.
*/