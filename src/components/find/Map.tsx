'use client'

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import darkStyle from './darkMapStyle.json'
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
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      city
    )}&libraries=places&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
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
  let styles = resolvedTheme === 'dark' ? darkStyle.style : []

  const destinationPlace = {
    name: 'Your Destination',
    address: destination,
    latitude: position.lat,
    longitude: position.lng,
  }

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

          {destination && (
            <MarkerF
              key={`${destinationPlace.address}-${destinationPlace.name}-${destinationPlace.latitude}-${destinationPlace.longitude}`}
              position={{ lat: position.lat, lng: position.lng }}
              onClick={
                destinationPlace === selectedPlace
                  ? () => setSelectedPlace(undefined)
                  : () => setSelectedPlace(destinationPlace)
              }
            />
          )}

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
              <div className="p-1">
                <h2 className="dark:text-zinc-900 text-zinc-50 font-bold">{selectedPlace.name}</h2>
                <p className="text-zinc-500 dark:text-zinc-400">{selectedPlace.address}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </>
  )
}

export default Map
