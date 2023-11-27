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
  const [error, setError] = useState<{error: string} | null>(null);

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

  const MainContent = () => {
    if (loading) {
      return <CustomLoading className="mt-10" />;
    } else if (results?.data.length === 0) {
      return (
        <p className="text-xl font-semibold text-center mt-10">아직 시험을 치루지 않았습니다!</p>
      );
    } else {
      return <ResultsGrid results={results?.data} />;
    }
  };

  if (error) {
    return <div>{error.error}</div>;
  }

  return (
    <>
      <section className="mx-auto mt-10 max-w-[80rem]">
        <h1 className="text-center text-3xl font-semibold">시험 기록</h1>
        <MainContent />
      </section>
    </>
  );
}
