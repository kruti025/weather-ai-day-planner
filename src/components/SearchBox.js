"use client";

import { useState } from "react";

export default function SearchBox({ onSearch }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    onSearch(trimmedValue);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter a city, e.g. Ahmedabad"
          aria-label="Search for a city"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-white/30"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🔍 Search
        </button>
      </div>
    </form>
  );
}
