import { prisma } from "@/lib/prisma";
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Spinner } from "components/spinner";
import Link from "next/link";
import { Suspense } from "react";
import SearchInput from "./search-input";


export default async function Page({
  searchParams }: {
    searchParams: {
      [key: string]: string | string[] | undefined
    }
  }
) {

  const search = typeof searchParams.search == "string" ? searchParams.search : undefined

  return (
    <div className="px-8 bg-gray-50 pt-12 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="w-80">
          <div className="relative mt-1 rounded-md shadow-sm">
            <SearchInput search={search} />
          </div>
        </div>
        <div className="mt-0 ml-16 flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <UserTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center grow justify-center bg-gray-50 h-full">
      <Spinner className="w-8 animate-spin" />
    </div>
  );
}



async function UserTable({
  searchParams }: {
    searchParams: {
      [key: string]: string | string[] | undefined
    }
  }
) {

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const perPage = 6;
  const search = typeof searchParams.search == "string" ? searchParams.search : undefined

  const totalUsers = await prisma.user.count({
    where: {
      name: {
        contains: search
      }
    }
  })


  const totalPages = Math.ceil(totalUsers / perPage);
  const page = typeof searchParams.page == "string" && +searchParams.page > 1
    && +searchParams.page <= totalPages
    ? +searchParams.page : 1;



  const users = await prisma.user.findMany(
    {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        name: {
          contains: search
        }
      }
    },

  )

  const currentSearchParams = new URLSearchParams()
  if (search) {
    currentSearchParams.set("search", search)
  }

  if (page > 1) {
    currentSearchParams.set("page", `${page + 1}`)
  }



  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 pl-6">
                      Id
                    </th>
                    <th className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 pl-6">
                      Name
                    </th>
                    <th className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ">
                      Email
                    </th>
                    <th className="relative py-3.5 pl-3 pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-6">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-6">
                        {user.name}
                      </td>
                      <td className="text-ellipsis whitespace-nowrap px-3 py-4 text-sm text-gray-500 ">
                        {user.email}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-4 pr-6 text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          Edit
                          <ChevronRightIcon className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex align-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-bold">
            {(page - 1) * perPage + 1}
          </span> to <span className="font-bold">{Math.min((page * perPage), totalUsers)}</span>  of <span className="font-bold">{totalUsers}</span> Users
        </p>
        <div className="space-x-2">
          <PreviousPage
            page={page}
            currentSearchParams={currentSearchParams}
          />
          <NextPage
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </div>
    </>
  );
}

function PreviousPage({
  page,
  currentSearchParams
}: { page: number; currentSearchParams: URLSearchParams }) {


  const newSearchParams = new URLSearchParams(currentSearchParams)


  if (page > 2) {

    newSearchParams.set("page", `${page - 1}`)
  } else {
    newSearchParams.delete("page")

  }

  return (
    page > 1 ?
      <Link className="border border-gray-300 bg-white px-3 py-2 inline-flex items-center justify-center rounded-md text-sm font-bold hover:bg-gray-50"
        href={`/?${newSearchParams}`}
      >Previous</Link> : <button
        className="border border-gray-300 bg-white px-3 py-2 inline-flex items-center justify-center rounded-md text-sm font-bold text-gray-400"
        disabled
      >Previous</button >
  )
}

function NextPage({ page, totalPages, currentSearchParams }: { page: number; totalPages: number; search?: string, currentSearchParams: URLSearchParams }) {

  const newSearchParams = new URLSearchParams(currentSearchParams)

  newSearchParams.set("page", `${page + 1}`)

  return page < totalPages ? <Link
    className="border border-gray-300 bg-white px-3 py-2 inline-flex items-center justify-center rounded-md text-sm font-bold hover:bg-gray-50"
    href={`/?${newSearchParams}`}
  >Next</Link> : (
    <button
      className="border border-gray-300 bg-white px-3 py-2 inline-flex items-center justify-center rounded-md text-sm font-bold text-gray-400"
      disabled
    >Next</button >
  )
}