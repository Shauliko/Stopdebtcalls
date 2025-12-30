import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Stop the calls</h1>
      <p className="text-zinc-600">
        Fill out a short form and we’ll generate a formal cease communication letter.
      </p>
      <Link
        href="/form"
        className="inline-block rounded bg-zinc-900 px-4 py-2 text-white"
      >
        Start now
      </Link>
    </div>
  );
}
