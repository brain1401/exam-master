"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { ExamResultsResponse } from "@/types/problems";
import CustomLoading from "../ui/CustomLoading";
import { resolve } from "path";
import Link from "next/link";
export default function Results() {
  const [results, setResults] = useState<ExamResultsResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/getExamResults");
      setResults(res.data);
    };

    setLoading(true);

    try {
      fetchData();
    } catch (e) {
      if (isAxiosError(e)) {
        setError(e?.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log(results);
  }, [results]);

  if (loading) {
    return <CustomLoading className="mt-10" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {results && (
        <ul className="mx-auto mt-10 flex w-[70%] flex-wrap justify-center gap-x-2 gap-y-5">
          {results.data.map((result) => (
            <li key={result.uuid}>
              <Link href={`/result/${result.uuid}`}>
                <div className="rounded-lg border border-black p-5">
                  <h2 className="mb-5 text-center">{result.problemSetName}</h2>
                  <p className="text-center">
                    {result.createdAt.toLocaleString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
