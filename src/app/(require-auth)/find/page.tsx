'use client'

import { useState } from 'react'

import Configurator from '@/components/find/Configurator'
import { SearchData } from '@/components/find/interface'
import * as I from '@/components/find/interface'
import Map from '@/components/find/Map'

const Find = () => {
  const [destination, setDestination] = useState<string>('')
  const [radius, setRadius] = useState<number>(0)
  const [priceMin, setPriceMin] = useState<number>(0)
  const [priceMax, setPriceMax] = useState<number>(0)
  const [zones, setZones] = useState<string[]>([])

  const configAndSetters: I.SearchData & I.SearchDataSetters = {
    destination,
    setDestination,
    radius,
    setRadius,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    zones,
    setZones,
  }

  const config: SearchData = {
    destination,
    radius,
    priceMin,
    priceMax,
    zones,
  }

  return (
    <div className="w-full h-full flex">
      <Configurator configAndSetters={configAndSetters} />
      <Map config={config} />
    </div>
  )
}

export default Find
