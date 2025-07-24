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
    <main style={{ margin: "24px" }}>
      {error && (
        <h3>{error}</h3>
      )}

      {isLoading ? (
        <p>Loading Advocates...</p>
      ) : (
        <>
          <h1 className="py-4 flex w-full justify-center items-center bg-slate-800 text-white">Solace Advocates</h1>

          <div className="flex justify-between items-end">
            <div>
              <p>Search</p>
              <p>
                Searching for: <span id="search-term">{searchTerm.current}</span>
              </p>
              <input style={{ border: "1px solid black" }} onChange={onChange} value={searchTerm.current} />
              <button className="pl-3" onClick={onClick}>Reset Search</button>
            </div>

            <div>
              <button className="ml-2 px-3 border border-black" onClick={handlePrevPage}>Prev</button>
              <button className="ml-2 px-3 border border-black" onClick={handleNextPage}>Next</button>
            </div>
          </div>
          <br />
          <br />
          <table>
            <thead>
              <tr>
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
                  <tr key={advocate.id}>
                    <td>{advocate.firstName}</td>
                    <td>{advocate.lastName}</td>
                    <td>{advocate.city}</td>
                    <td>{advocate.degree}</td>
                    <td>
                      {advocate.specialties.map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td>{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
