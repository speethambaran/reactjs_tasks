import React, { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './HomeScreen.css';

function HomeScreen({ data }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setIsLoading(false);
      setFilteredData(data);
    }
  }, [data]);

  const handleSearch = () => {
    setFilteredData(
      data.filter(
        (item) =>
          item.bus_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      )
    );
  };

  const handleSeatAddition = (busId) => {
    // Make API call to update available seats after successful payment
    // and return updated available seat count to the UI
    // fetch(`/update_available_seats/${busId}`, { method: 'POST' })
    //   .then(response => response.json())
    //   .then(data => {
    //     const updatedData = filteredData.map(item => {
    //       if (item._id === busId) {
    //         return {
    //           ...item,
    //           available_seats: data.available_seats
    //         }
    //       } else {
    //         return item
    //       }
    //     })
    //     setFilteredData(updatedData)
    //   })
    const updatedData = filteredData.map(item => {
      if (item._id === busId) {
        return {
          ...item,
          available_seats: data.available_seats
        }
      } else {
        return item
      }
    })
    setFilteredData(updatedData)
  }

  return (
    <div>
      <header className="header">
        <div className="header-left">Booking App</div>
        <div className="header-center">
          <input
            type="text"
            placeholder="Search for a bus"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-content">
            <Skeleton height={50} width={200} />
            <Skeleton height={50} width={200} />
            <Skeleton height={50} width={200} />
          </div>
        </div>
      ) : (
        <div>
          <form>
            <table>
              <tbody>
                <tr>
                  <th>Time</th>
                  <th>Busname</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Available Seats</th>
                  <th>Image</th>
                  <th>Rate</th>
                  <th>Add seat</th>
                </tr>
                {filteredData &&
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.time}</td>
                      <td>{item.bus_name}</td>
                      <td>{item.from}</td>
                      <td>{item.to}</td>
                      <td>{item.available_seats}</td>
                      <td>
                        <img src={item.imageUrl} alt="" height={100} />
                      </td>
                      <td>{item.rate}</td>
                      <td>
                      <a href={`/book_seat/${item._id}`}>
											<button type="button" className="btn btn-primary">
												Add seat
											</button>
										</a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </form>
        </div>
      )}
      <footer className="footer">
      <div className="footer-content">All rights reserved @ 2023</div>
    </footer>
  </div>
);
}

export default HomeScreen;
