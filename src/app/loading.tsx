import { Spinner } from "components/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center bg-gray-50 h-full">
            <Spinner className="w-8 animate-spin" />
        </div>
    );
}
