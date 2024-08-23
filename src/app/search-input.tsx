"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchInput({ search }: { search?: string; }) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition()
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
    const isSearching = timeoutId || isPending

    return (
        <>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 pl-10 focus:ring-0 focus:border-gray-400 focus:outline-none text-sm"
                onChange={(event) => {

                    clearTimeout(timeoutId)

                    const id = setTimeout(() => {
                        startTransition(() => {

                            if (event.target.value) {

                                router.push(`/?search=${event.target.value}`);
                            } else {

                                router.push(`/`);
                            }
                        })
                        setTimeoutId(undefined)
                    }, 500)

                    setTimeoutId(id)


                }}
                defaultValue={search}
                placeholder="Search"
            />
            {
                isSearching &&
                <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center pl-3">
                    <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400 animate-bounce"
                        aria-hidden="true"
                    />
                </div>
            }

        </>
    );
}
