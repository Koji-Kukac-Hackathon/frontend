import { Dispatch, SetStateAction } from 'react'

export interface SearchData {
  destination: string
  radius: number
  priceMin: number
  priceMax: number
  zones: string[]
}

export interface SearchDataSetters {
  setDestination: Dispatch<SetStateAction<string>>
  setRadius: Dispatch<SetStateAction<number>>
  setPriceMin: Dispatch<SetStateAction<number>>
  setPriceMax: Dispatch<SetStateAction<number>>
  setZones: Dispatch<SetStateAction<string[]>>
}
