"use client";

import { SelectAdvocate } from '@/db/schema';
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<SelectAdvocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<SelectAdvocate[]>([]);
  const searchTerm = useRef<string>('');

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

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
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm.current}</span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
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
    </main>
  );
}
