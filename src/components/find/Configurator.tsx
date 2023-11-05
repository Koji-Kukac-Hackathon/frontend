import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import * as I from './interface'
import { toast } from '../ui/use-toast'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface IConfigurator {
  configSetters: I.SearchDataSetters
}

const zonesConfig = [
  {
    id: 'Zone1',
    label: 'Zone 1',
  },
  {
    id: 'Zone2',
    label: 'Zone 2',
  },
  {
    id: 'Zone3',
    label: 'Zone 3',
  },
  {
    id: 'Zone4',
    label: 'Zone 4',
  },
] as const

const ConfiguratorSchema = z.object({
  destination: z.string(),
  radius: z
    .number()
    .min(0, {
      message: 'Radius must be at least 0.',
    })
    .max(100, {
      message: 'Radius must be at most 100.',
    })
    .default(0),
  priceMin: z.string().refine(value => +value >= 0, {
    message: 'Price has to be greater than or equals to 0.',
  }),
  priceMax: z.string().refine(value => +value <= 100, {
    message: 'Price has to be less than or equals to 100.',
  }),
  zones: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one zone.',
  }),
})

const Configurator = ({ configSetters }: IConfigurator) => {
  const { setDestination, setRadius, setPriceMin, setPriceMax, setZones } = configSetters

  const form = useForm<z.infer<typeof ConfiguratorSchema>>({
    resolver: zodResolver(ConfiguratorSchema),
    defaultValues: {
      destination: undefined,
      radius: 1,
      priceMin: '0',
      priceMax: undefined,
      zones: [],
    },
  })

  function onSubmit(data: z.infer<typeof ConfiguratorSchema>) {
    setDestination(data.destination)
    setRadius(+data.radius)
    setPriceMin(+data.priceMin)
    setPriceMax(+data.priceMax)
    setZones(data.zones)
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
  return (
    <div className="w-[500px] h-full bg-white dark:bg-gray-800 pt-4 px-4 text-3xl font-bold">
      <h1>Configurator</h1>
      <Form {...form}>
        <form className="mx-auto w-[350px] flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="destination">Destination</FormLabel>
                <FormDescription>
                  Enter the destination address and we will show you closest parking spots.
                </FormDescription>
                <FormControl>
                  <Input placeholder="Ul. Vjekoslava Heinzela 60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="radius"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel htmlFor="radius">Radius{value ? `: ${+value} km` : ': 0 km'}</FormLabel>
                <FormDescription>
                  This is the radius in which we are going to search for your parking spot.
                </FormDescription>
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={[value]}
                    onValueChange={vals => {
                      onChange(vals[0])
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-8">
            <FormField
              control={form.control}
              name="priceMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priceMin">Min Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0" defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priceMax">Max Price</FormLabel>
                  <FormControl>
                    <Input placeholder="100" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="zones"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Zones</FormLabel>
                  <FormDescription>Select zones you want to park in.</FormDescription>
                </div>
                {zonesConfig.map(zone => (
                  <FormField
                    key={zone.id}
                    control={form.control}
                    name="zones"
                    render={({ field }) => {
                      return (
                        <FormItem key={zone.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(zone.id)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...field.value, zone.id])
                                  : field.onChange(field.value?.filter(value => value !== zone.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{zone.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2 select-none">
            Search
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Configurator
