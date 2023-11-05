'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Column,
  ColumnDef,
  Table as ReactTable,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { fetchApi, fetchApiRaw } from '@/lib/api'
import { ParkingSpot, User } from '@/lib/api/types'

export default function PageAdminDashboardHome() {
  return (
    <div className="flex flex-col gap-4">
      <SectionUsers />

      <SectionParkingSpots />
    </div>
  )
}

const defaultParkingSpotColumns = [
  {
    id: 'id',
    accessorKey: 'id',
    header: () => 'ID',
    cell: info => info.getValue<ParkingSpot['id']>(),
  },
  {
    id: 'latitude',
    accessorKey: 'latitude',
    header: () => 'Lat',
    cell: info => info.getValue<ParkingSpot['latitude']>(),
  },
  {
    id: 'longitude',
    accessorKey: 'longitude',
    header: () => 'Long',
    cell: info => info.getValue<ParkingSpot['longitude']>(),
  },
  {
    id: 'parkingSpotZone',
    accessorKey: 'parkingSpotZone',
    header: () => 'Zone',
    cell: info => info.getValue<ParkingSpot['parkingSpotZone']>() ?? '/',
  },
  {
    id: 'occupied',
    accessorKey: 'occupied',
    header: () => 'Occupied',
    accessorFn: row => {
      if (row.occupied) {
        return 'Yes'
      } else {
        return 'No'
      }
    },
    cell: info => info.getValue<string>(),
  },
  {
    id: 'occupiedTimestamp',
    accessorKey: 'occupiedTimestamp',
    header: () => 'Occupied Timestamp',
    accessorFn: row => new Date(row.occupiedTimestamp),
    cell: info => info.getValue<Date>().toLocaleString(),
  },
] satisfies ColumnDef<ParkingSpot>[]

function SectionParkingSpots() {
  const sectionsQuery = useQuery({
    queryKey: ['parking-spots'],
    queryFn: async () => {
      const response = await fetchApiRaw('/parking-spot')

      return response as ParkingSpot[]
    },
    refetchInterval: 2500,
  })

  const tableData = useMemo(() => {
    return sectionsQuery.data ?? []
  }, [sectionsQuery.data])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'occupiedTimestamp',
      desc: true,
    },
  ])

  const table = useReactTable({
    data: tableData,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    columns: defaultParkingSpotColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (sectionsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 rounded-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl">Parking spots</h2>
        <hr className="h-0.5 dark:bg-white/20 mx-8 bg-black/30" />
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col gap-4 p-4 rounded-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl">Parking spots</h2>
      <hr className="h-0.5 dark:bg-white/20 mx-8 bg-black/30" />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-2">
                        <div
                          className="cursor-pointer flex gap-2 items-center"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                          <span>
                            {{
                              asc: '🔼',
                              desc: '🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        </div>

                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={defaultParkingSpotColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-2">
        <Button className="border rounded" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button className="border rounded" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button className="border rounded" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button
          className="border rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
        <span className="flex items-center gap-1 mx-auto">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          Go to page:
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={value => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="basis-32">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {[1, 2, 5, 10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem value={pageSize.toString()} key={pageSize}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <LoadingSpinner
        className={[
          'absolute top-2 right-2 w-12 h-auto select-none pointer-events-none',
          {
            hidden: !sectionsQuery.isFetching,
          },
        ]}
      />
    </div>
  )
}

const EditUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.enum(['admin', 'user']),
})

const defaultUserColumns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => 'Name',
    cell: info => info.getValue<User['name']>(),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => 'Email',
    cell: info => info.getValue<User['email']>(),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: () => 'Role',
    cell: info => info.getValue<User['role']>() ?? '/',
  },
  {
    id: 'CreatedAt',
    accessorKey: 'CreatedAt',
    header: () => 'Created At',
    cell: info => {
      const val = info.getValue<User['CreatedAt']>()
      const date = new Date(val)

      return date.toLocaleString()
    },
  },
  {
    id: 'actions',
    header: () => 'Actions',
    accessorFn: row => row,
    cell: info => {
      const val = info.getValue() as User
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const queryClient = useQueryClient()

      return (
        <div className="flex gap-2 flex-wrap">
          <EditUserDialog user={val} />

          <Button
            variant="destructive"
            onClick={() => {
              if (!confirm('Are you sure you want to delete this user?')) return

              fetchApi(`/admin/users/${val.ID}`, {
                method: 'DELETE',
              }).then(res => {
                if (res?.status === 'success') {
                  toast({
                    title: 'User deleted!',
                    description: 'User has been deleted.',
                  })

                  queryClient.invalidateQueries({
                    queryKey: ['admin', 'users'],
                  })

                  return
                }

                toast({
                  title: 'User deletion failed!',
                  description: res?.message ?? 'Something went wrong!',
                  variant: 'destructive',
                })
              })
            }}
          >
            Delete
          </Button>
        </div>
      )
    },
  },
] satisfies ColumnDef<User>[]

function SectionUsers() {
  const columns = useMemo(() => [...defaultUserColumns], [])

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetchApi<{
        items: User[]
        filter: unknown
        totalItems: number
      }>('/admin/users')

      return response?.status === 'success' ? response.data : null
    },
  })

  const tableData = useMemo(() => {
    return usersQuery.data?.items ?? []
  }, [usersQuery.data])
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (usersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 rounded-md bg-white dark:bg-gray-800">
        <h2 className="text-2xl">Users</h2>
        <hr className="h-0.5 dark:bg-white/20 mx-8 bg-black/30" />
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col gap-4 p-4 rounded-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl">Users</h2>

      <hr className="h-0.5 dark:bg-white/20 mx-8 bg-black/30" />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-2">
                        <div
                          className="cursor-pointer flex gap-2 items-center"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                          <span>
                            {{
                              asc: '🔼',
                              desc: '🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        </div>

                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center gap-2">
        <Button className="border rounded" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button className="border rounded" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>
        <Button className="border rounded" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button
          className="border rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
        <span className="flex items-center gap-1 mx-auto">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          Go to page:
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={value => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="basis-32">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {[1, 2, 5, 10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem value={pageSize.toString()} key={pageSize}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <LoadingSpinner
        className={[
          'absolute top-2 right-2 w-12 h-auto select-none pointer-events-none',
          {
            hidden: !usersQuery.isFetching,
          },
        ]}
      />
    </div>
  )
}
function CreateParkingSpotDialog(props: { parkingSpot: ParkingSpot; onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      lat: props.parkingSpot.latitude,
      long: props.parkingSpot.longitude,
      spot: props.parkingSpot.parkingSpotZone,
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof EditUserSchema>) => {
      const response = await fetchApi<{ user: User }>(`/admin/users/${props.user.ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      return response
    },

    onSuccess: response => {
      if (response?.status === 'success') {
        toast({
          title: 'User updated!',
          description: "You're now logged in!",
        })
        queryClient.invalidateQueries({
          queryKey: ['admin', 'users'],
        })
        props.onSuccess?.()
        return
      }

      toast({
        title: 'User update failed!',
        description: response?.message ?? 'Something went wrong!',
        variant: 'destructive',
      })
    },
  })

  const isLoading = false

  return (
    <Dialog key={JSON.stringify(props.user)}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(data =>
              updateUserMutation.mutate({
                ...data,
                role: data.role as never,
              })
            )}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Marko Filip Horvat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="marko.filip.horvat@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="change password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pick a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button className="w-full select-none" type="submit" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog(props: { user: User; onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: props.user.name ?? '',
      email: props.user.email,
      role: props.user.role,
      password: undefined,
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof EditUserSchema>) => {
      const response = await fetchApi<{ user: User }>(`/admin/users/${props.user.ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      return response
    },

    onSuccess: response => {
      if (response?.status === 'success') {
        toast({
          title: 'User updated!',
          description: "You're now logged in!",
        })
        queryClient.invalidateQueries({
          queryKey: ['admin', 'users'],
        })
        props.onSuccess?.()
        return
      }

      toast({
        title: 'User update failed!',
        description: response?.message ?? 'Something went wrong!',
        variant: 'destructive',
      })
    },
  })

  const isLoading = false

  return (
    <Dialog key={JSON.stringify(props.user)}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(data =>
              updateUserMutation.mutate({
                ...data,
                role: data.role as never,
              })
            )}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Marko Filip Horvat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="marko.filip.horvat@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="change password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pick a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button className="w-full select-none" type="submit" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function Filter({ column, table }: { column: Column<any, any>; table: ReactTable<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder="Min"
        className="w-24 border shadow rounded"
      />
      <Input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder="Max"
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <Input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="w-36 border shadow rounded"
    />
  )
}
