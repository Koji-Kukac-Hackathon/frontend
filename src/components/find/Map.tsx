import { SearchData } from './interface'

interface IMap {
  config: SearchData
}

const Map = ({ config }: IMap) => {
  return <main className="h-full w-full">Map</main>
}

export default Map
