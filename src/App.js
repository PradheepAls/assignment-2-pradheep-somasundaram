import React, { useState, useEffect } from 'react';
import './App.css';

function AddTraveller({ travellers, setTravellers }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingTime = new Date().toLocaleString();
    if (travellers.length >= 10) {
      alert('No more seats available.');
      return;
    }
    if (!id || !name || !phone) {
      alert('Please fill in all fields.');
      return;
    }
    const isDuplicateId = travellers.some((traveller) => traveller.id === id);
    if (isDuplicateId) {
      alert('Traveller ID already exists. Please use a unique ID.');
      return;
    }
    const newTraveller = { id, name, phone, bookingTime };
    const updatedTravellers = [...travellers, newTraveller];
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));

    // Clear form fields
    setId('');
    setName('');
    setPhone('');
  };

  return (
    <div>
      <h2>Add New Traveller</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <button type="submit">Add Traveller</button>
      </form>
    </div>
  );
}

function DisplayTraveller({ travellers, setTravellers }) {
  const handleDelete = (id) => {
    const updatedTravellers = travellers.filter((traveller) => traveller.id !== id);
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));
  };

  return (
    <div>
      <h2>Traveller Details</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Booking Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {travellers.length > 0 ? (
            travellers.map((traveller) => (
              <tr key={traveller.id}>
                <td>{traveller.id}</td>
                <td>{traveller.name}</td>
                <td>{traveller.phone}</td>
                <td>{traveller.bookingTime}</td>
                <td>
                  <button onClick={() => handleDelete(traveller.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Travellers Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DeleteTraveller({ travellers, setTravellers, setActiveView }) {
  const [deleteId, setDeleteId] = useState('');

  const handleDelete = (e) => {
    e.preventDefault();
    const index = travellers.findIndex((traveller) => traveller.id === deleteId);
    if (index === -1) {
      alert('Traveller not found.');
      return;
    }

    // Delete the traveller from the list
    const updatedTravellers = travellers.filter((traveller) => traveller.id !== deleteId);
    setTravellers(updatedTravellers);
    localStorage.setItem('travellerData', JSON.stringify(updatedTravellers));

    // Check if the list is empty, and auto-navigate to "Home" if no travellers are left
    if (updatedTravellers.length === 0) {
      setActiveView('home');
    }

    // Clear the delete ID field
    setDeleteId('');
  };

  return (
    <div>
      <h2>Delete Traveller</h2>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          placeholder="Enter Traveller ID"
        />
        <button type="submit">Delete Traveller</button>
      </form>
    </div>
  );
}

// Component to visualize seat availability and display total empty seats
function SeatAvailability({ travellers, totalSeats }) {
  const seatStatus = Array(totalSeats).fill(false);

  travellers.forEach((traveller, index) => {
    if (index < totalSeats) seatStatus[index] = true;
  });

  return (
    <div>
      <h2>Seat Availability</h2>
      <div className="seat-container">
        {seatStatus.map((isOccupied, index) => (
          <div key={index} className={`seat ${isOccupied ? 'occupied' : 'unoccupied'}`}>
            {isOccupied ? 'Reserved' : 'Available'}
          </div>
        ))}
      </div>
    </div>
  );
}

// Component to display free seats (used as a sub-component under all views)
function DisplayFreeSeats({ totalSeats, travellers }) {
  const availableSeats = totalSeats - travellers.length;
  return (
    <div>
      <h3>Available Free Seats: {availableSeats}</h3>
    </div>
  );
}

// Updated NavBar with conditional "View Travellers" and "Delete Traveller" tabs
function NavBar({ setActiveView, travellers }) {
  return (
    <nav>
      <ul className="nav-menu">
        <li onClick={() => setActiveView('home')}>Home</li>
        <li onClick={() => setActiveView('addTraveller')}>Add Traveller</li>

        {/* Conditionally show "View Travellers" if travellers exist */}
        {travellers.length > 0 && (
          <li onClick={() => setActiveView('viewTravellers')}>View Travellers</li>
        )}

        {/* Conditionally show "Delete Traveller" if travellers exist */}
        {travellers.length > 0 && (
          <li onClick={() => setActiveView('deleteTraveller')}>Delete Traveller</li>
        )}
      </ul>
    </nav>
  );
}

function App() {
  const [travellers, setTravellers] = useState(() => {
    const savedData = localStorage.getItem('travellerData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [activeView, setActiveView] = useState('home'); // Track the active view
  const totalSeats = 10;

  useEffect(() => {
    localStorage.setItem('travellerData', JSON.stringify(travellers));
  }, [travellers]);

  return (
    <div>
      <h1>Railway Traveller Reservation System</h1>

      {/* Navigation Bar */}
      <NavBar
        setActiveView={setActiveView}
        travellers={travellers}
      />

      {/* Display Free Seats (Always displayed as a sub-component) */}
      <DisplayFreeSeats totalSeats={totalSeats} travellers={travellers} />

      {/* Conditionally render based on activeView */}
      {activeView === 'home' && <SeatAvailability travellers={travellers} totalSeats={totalSeats} />}
      {activeView === 'addTraveller' && (
        <AddTraveller
          travellers={travellers}
          setTravellers={setTravellers}
        />
      )}
      {activeView === 'viewTravellers' && <DisplayTraveller travellers={travellers} setTravellers={setTravellers} />}
      {activeView === 'deleteTraveller' && (
        <DeleteTraveller
          travellers={travellers}
          setTravellers={setTravellers}
          setActiveView={setActiveView} // Pass setActiveView to allow auto-navigation to Home
        />
      )}

      {/* Display status for seat limits */}
      {travellers.length >= 10 && <p>All seats are reserved. No more travellers can be added.</p>}
      {travellers.length === 0 && activeView === 'viewTravellers' && <p>No travellers to display.</p>}
    </div>
  );
}

export default App;
