'use client'

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { SearchData } from './interface'

interface IMap {
  config: SearchData
}

export type Place = {
  name: string
  address: string
  latitude: number
  longitude: number
}

const containerStyle = {
  width: '100%',
  height: '100%',
}

const Map = ({ config }: IMap) => {
  const { destination } = config
  const [position, setPosition] = useState({
    lat: 45.815,
    lng: 15.9819,
  })

  const getDestinationPosition = async (city: string) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    const { lat, lng } = geocodeData.results[0].geometry.location
    return { lng, lat }
  }

  useEffect(() => {
    if (destination) {
      getDestinationPosition(destination).then(pos => {
        setPosition(pos)
      })
    }
  }, [destination])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [selectedPlace, setSelectedPlace] = useState<Place>()
  const [places, _setPlaces] = useState<Place[]>([
    {
      name: 'Burger City',
      address: '123 Main St',
      latitude: 45.915,
      longitude: 16,
    },
    {
      name: 'Burger City',
      address: '123 Main St',
      latitude: 45.615,
      longitude: 15.8819,
    },
  ])

  const { resolvedTheme } = useTheme()
  const darkStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ]

  let styles = resolvedTheme === 'dark' ? darkStyle : []
  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: position.lat, lng: position.lng }}
          zoom={11}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: false,
            styles: styles,
          }}
        >
          {places.map(place => (
            <MarkerF
              key={`${place.address}-${place.name}-${place.latitude}-${place.longitude}`}
              onClick={place === selectedPlace ? () => setSelectedPlace(undefined) : () => setSelectedPlace(place)}
              position={{ lat: place.latitude, lng: place.longitude }}
            />
          ))}
          {selectedPlace && (
            <InfoWindowF
              position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
              zIndex={1}
              options={{
                // @ts-ignore
                pixelOffset: { width: 0, height: -40 },
              }}
              onCloseClick={() => setSelectedPlace(undefined)}
            >
              <div>
                <h2>{selectedPlace.name}</h2>
                <p>{selectedPlace.address}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </>
  )
}

export default Map
