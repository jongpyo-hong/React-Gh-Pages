import React, {useState, useContext, useEffect, useRef, createContext} from 'react'
import {BarChart,Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {kakao, Map, MapMarker, MapTypeId, Roadview, useRoadview} from 'react-kakao-maps-sdk';
// import { KakaoRoadviewContext } from "../components/Roadview"
import './App.css';


export default App;

function fetchData(searchYearCd) {
  const serviceKey = 'DmdFibalbWPr3RyfpEc0Q66SC3DJKbPGJ8RxpzYg57ZcDBkFY4FJGs6wXT%2FpHePu3ZVdXaBfFlwhQ4m5GYA0dQ%3D%3D'
  const url = `https://apis.data.go.kr/B552061/jaywalking/getRestJaywalking?serviceKey=${serviceKey}&searchYearCd=${searchYearCd}&siDo=11&guGun=&type=json&numOfRows=10&pageNo=1`

  const promise = fetch(url)
  .then(res => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  })` `

  return promise;
}


function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [searchYearCd, setSearchYearCd] = useState(2015)
  

  console.log(data);

  useEffect(() => {
    // setIsLoaded(false);

    fetchData(searchYearCd)
    .then(data => {
      setData(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() =>setIsLoaded(true))
  }, [searchYearCd])

  if (error) {
    return <p>failed to fetch</p>
  }
  if (!isLoaded) {
    return <p>fatching data...</p>
  }
  return (
    <div style={{margin: "rem"}}>
      <h1>App</h1>

      <div className='year' style={{backgroundColor: ""}}>
        {/* Event */}
        <h2>Year</h2>
        <p>{searchYearCd}</p>
        <button onClick={() => setSearchYearCd(searchYearCd -1)}
          style={{visibility: searchYearCd===2012 && "hidden"}}>Prev</button>
        <button onClick={() => setSearchYearCd(searchYearCd +1)}
          style={{visibility: searchYearCd===2020 && "hidden"}}>Next</button>
     

      
        <h2>Result</h2>
        <ul>
          {data.items.item.map((item, index) => (
            <li key={index} style={{padding:"10px"}}>{item.spot_nm}, 사고건수 {item.occrrnc_cnt}건, {item.se_dnv_cnt}명 중상, {item.dth_dnv_cnt}명 사망</li>
          ))}
        </ul>
      </div>

          <div className='Map'>
            <h2>Map</h2>
            <KakaoMap data={data} />
          </div>    

          <div className='Chart'>
            <h2>Chart</h2>
            <div style={{height: "200px"}}>
              <Rechart data={data}/>
            </div>
          </div>
      </div>           
  )
}

function KakaoMap({data}) {

  const positions = data.items.item.map(item => {
    return {
      title: item.spot_nm,
      
      latlng: {
        lat: item.la_crd,
        lng: item.lo_crd
      }
    }
  })

  // const positions = [
  //   {
  //     title: "사고발생지",
  //     latlng: {lat: 11, lng: 11},
  //   },
  // ]
  return (
    <Map // 지도를 표시할 Container
    center={{
      // 지도의 중심좌표
      lat: 37.5642135,
      lng: 127.0016985,
    }}
    style={{
      // 지도의 크기
      width: "100%",
      height: "450px",
    }}
    level={8} // 지도의 확대 레벨
  >
    {positions.map((position, index) => (
      <MapMarker
        key={`${position.title}-${position.latlng}`}
        position={position.latlng} // 마커를 표시할 위치
        image={{
          src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          size: {
            width: 24,
            height: 35
          }, // 마커이미지의 크기
        }}
        title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        />
    ))}
    
  </Map>
  )
  
}

function Rechart({data}) {
  const chartData = data.items.item.map((item) => {
    const year = item.sido_sgg_nm
    return {
      name: year,
      사상자: item.se_dnv_cnt,
      사고건수: item.occrrnc_cnt,
      amt: item.dth_dnv_cnt,
    }
  })
    ;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar type="monotone" dataKey="사고건수" fill="#8884d8" />
        <Bar type="monotone" dataKey="사상자" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// spot_cd : 지점코드
// sido_sgg_nm: 시, 도시, 군, 구 이름
// spot_nm: 지점명
// occrrnc_cnt: 사고건 수
// caslt_cnt 사상자 수
// dth_dnv_cnt: 사망자 수
// se_dnv_cnt: 중상자 수
// sl_dnv_cnt: 경상자 수
// wnd_dnv_cnt: 부상 신고자 수
// lo_crd: 경도
// la_crd: 위도
// geom_json: 다발지역 폴리곤
// totalCount: 총건 수
// numOfRows: 검색건 수
// pageNo: 페이지 수
