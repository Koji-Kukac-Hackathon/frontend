'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const MapSchema = z.object({
  city: z.string().min(1, {
    message: 'City is required',
  }),
})

const containerStyle = {
  width: '100%',
  height: '400px',
}

async function getLatLonForCity(city: string) {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    city + ', USA'
  )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  const geocodeResponse = await fetch(geocodeUrl)
  const geocodeData = await geocodeResponse.json()
  const { lat, lng } = geocodeData.results[0].geometry.location
  return { lon: lng, lat }
}

export type Place = {
  name: string
  address: string
  latitude: number
  longitude: number
}

export default function DashboardPage() {
  const [places, _setPlaces] = useState<Place[]>([
    {
      name: 'Burger City',
      address: '123 Main St',
      latitude: 40.7128,
      longitude: -74.006,
    },
  ])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [position, setPosition] = useState({
    lat: places[0].latitude,
    lon: places[0].longitude,
  })

  const form = useForm<z.infer<typeof MapSchema>>({
    resolver: zodResolver(MapSchema),
    defaultValues: {
      city: '',
    },
  })

  async function onSubmit(data: z.infer<typeof MapSchema>) {
    const { lat, lon } = await getLatLonForCity(data.city)
    setPosition({ lat, lon })
  }

  const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined)

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="mx-auto w-[350px]" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="city">Enter City</FormLabel>
                <FormControl>
                  <Input placeholder="Zagreb" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="p-10" />
      <div>
        {isLoaded && (
          <GoogleMap mapContainerStyle={containerStyle} center={{ lat: position.lat, lng: position.lon }} zoom={11}>
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
      </div>
    </div>
  )
}
