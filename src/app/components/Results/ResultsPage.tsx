"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { ExamResultsResponse } from "@/types/problems";
import CustomLoading from "../ui/CustomLoading";
import ResultsGrid from "./ResultsGrid";
export default function ResultsPage() {
  const [results, setResults] = useState<ExamResultsResponse | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getExamResults", {
          params: {
            page,
          },
        });
        setResults(res.data);
      } catch (e) {
        if (isAxiosError(e)) {
          setError(e.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  const MainContent = () => {
    if (loading) {
      return <CustomLoading className="mt-10" />;
    } else {
      return <ResultsGrid results={results?.data} />;
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1 className="text-center text-2xl">시험 기록</h1>
      <MainContent />
    </>
  );
}
