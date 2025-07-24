"use client";

import { SelectAdvocate } from '@/db/schema';
import { useEffect, useRef, useState } from "react";

const PAGINATION_LIMIT = 10;

export default function Home() {
  const [advocates, setAdvocates] = useState<SelectAdvocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<SelectAdvocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const searchTerm = useRef<string>('');

  const fetchAdvocates = async (page = 1) => {
    // TODO: upgrade to use react-query
    try {
      setIsLoading(true);
      const response = await fetch(`/api/advocates?limit=${PAGINATION_LIMIT}&page=${page}`);

      if (!response.ok) {
        setError(`HTTP error.  Please reload to try again.  Status: ${response.status}`);
        return;
      }

      const json = await response.json();
      setAdvocates(json.data);
      setFilteredAdvocates(json.data);
    } catch (err) {
      setError("Error fetching advocates.  Please reload to try again");
    } finally {
      setIsLoading(false);
    }
};

  useEffect(() => {
    fetchAdvocates(1);
  }, []);

  useEffect(() => {
    fetchAdvocates(pageNumber);
  }, [pageNumber]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchTerm.current = e.target.value;

    console.log("filtering advocates...");
    const lowerCaseSearch = searchTerm.current.toLowerCase();

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(lowerCaseSearch) ||
        advocate.lastName.toLowerCase().includes(lowerCaseSearch) ||
        advocate.city.toLowerCase().includes(lowerCaseSearch) ||
        advocate.degree.toLowerCase().includes(lowerCaseSearch) ||
        advocate.specialties.some((specialty) => {
          specialty.toLowerCase().includes(lowerCaseSearch)
        }) ||
        advocate.yearsOfExperience.toString().includes(lowerCaseSearch)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    searchTerm.current = '';
  };

  const handlePrevPage = () => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber(prevPage => prevPage - 1);
  };

  const handleNextPage = () => {
    // TODO: check page count and return early if on last page
    setPageNumber(prevPage => prevPage + 1);
  };

  return (
    <main className="relative">
      <h1 className="fixed top-0 py-4 flex w-full justify-center items-center bg-green-900 text-white text-2xl border-b-2 border-green-300">Solace Advocates</h1>

      {isLoading ? (
        <p className="pt-32 text-center min-h-screen bg-green-950 text-white">Loading Advocates...</p>
      ) : (
        <section className="mt-16 px-10 bg-green-950 text-white min-h-screen flex flex-col items-center">
          <div className="fixed px-10 flex justify-between items-end mb-8 w-full bg-green-950 pb-8 border-b-2 border-green-300">
            <div>
              <p className="text-xl py-4 text-gray-300">Search</p>
              <div className="flex justify-between">
                <p>
                  Searching for: <span id="search-term">{searchTerm.current}</span>
                </p>

                {error && <p className="text-red-600">{error}</p>}
              </div>
              <input className="border border-black text-black px-2" onChange={onChange} value={searchTerm.current} />
              <button className="pl-3" onClick={onClick}>Reset Search</button>
            </div>

            <div>
              <button className="ml-2 px-3 border border-black bg-green-300 text-green-950 rounded-md" onClick={handlePrevPage}>Prev</button>
              <button className="ml-2 px-3 border border-black bg-green-300 text-green-950 rounded-md" onClick={handleNextPage}>Next</button>
            </div>
          </div>

          <table className="w-full mt-44 md:w-4/5 border-4 border-green-300 rounded-lg mb-32">
            <thead className="">
              <tr className="border-b-4 border-green-300">
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Degree</th>
                <th>Specialties</th>
                <th>Years of Experience</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => {
                return (
                  <tr key={advocate.id} className="border-b-2 border-green-300">
                    <td className="border-x-2 border-green-900">{advocate.firstName}</td>
                    <td className="border-x-2 border-green-900">{advocate.lastName}</td>
                    <td className="border-x-2 border-green-900">{advocate.city}</td>
                    <td className="border-x-2 border-green-900">{advocate.degree}</td>
                    <td className="border-x-2 border-green-900">
                      {advocate.specialties.map((s) => (
                        <div key={s}>- {s}</div>
                      ))}
                    </td>
                    <td className="border-x-2 border-green-900">{advocate.yearsOfExperience}</td>
                    <td className="border-x-2 border-green-900">{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
