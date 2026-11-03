
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080";

const emptyCar = {
  brand: "",
  model: "",
  registrationNumber: "",
  pricePerDay: "",
  available: true
};

const emptyCustomer = {
  fullName: "",
  email: "",
  phone: "",
  licenseNumber: ""
};

const emptyRental = {
  carId: "",
  customerId: "",
  startDate: "",
  endDate: "",
  totalAmount: "",
  status: "BOOKED"
};

function App() {
  const [section, setSection] = useState("cars");

  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [car, setCar] = useState(emptyCar);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [rental, setRental] = useState(emptyRental);

  const [editCarId, setEditCarId] = useState(null);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editRentalId, setEditRentalId] = useState(null);

  // Load all data
  const loadData = async () => {
    try {
      const [carRes, customerRes, rentalRes] = await Promise.all([
        axios.get(`${API}/cars`),
        axios.get(`${API}/customers`),
        axios.get(`${API}/rentals`)
      ]);

      setCars(carRes.data);
      setCustomers(customerRes.data);
      setRentals(rentalRes.data);
    } catch (error) {
      console.error("Loading error:", error);
      alert("Unable to load data. Check Spring Boot.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // CAR: Add or Update
  const saveCar = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...car,
        pricePerDay: Number(car.pricePerDay)
      };

      if (editCarId) {
        await axios.put(`${API}/cars/${editCarId}`, data);
        alert("Car updated successfully!");
      } else {
        await axios.post(`${API}/cars`, data);
        alert("Car added successfully!");
      }

      setCar(emptyCar);
      setEditCarId(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save car.");
    }
  };

  // CAR: Load details into form
  const editCar = (c) => {
    setCar({
      brand: c.brand || "",
      model: c.model || "",
      registrationNumber: c.registrationNumber || "",
      pricePerDay: c.pricePerDay ?? "",
      available: c.available ?? true
    });

    setEditCarId(c.carId);
    setSection("cars");
  };

  // CAR: Delete
  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      await axios.delete(`${API}/cars/${id}`);
      alert("Car deleted successfully!");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete car. It may be linked to an existing rental.");
    }
  };

  // CUSTOMER: Add or Update
  const saveCustomer = async (e) => {
    e.preventDefault();

    try {
      if (editCustomerId) {
        await axios.put(`${API}/customers/${editCustomerId}`, customer);
        alert("Customer updated successfully!");
      } else {
        await axios.post(`${API}/customers`, customer);
        alert("Customer added successfully!");
      }

      setCustomer(emptyCustomer);
      setEditCustomerId(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save customer.");
    }
  };

  // CUSTOMER: Load details into form
  const editCustomer = (c) => {
    setCustomer({
      fullName: c.fullName || "",
      email: c.email || "",
      phone: c.phone || "",
      licenseNumber: c.licenseNumber || ""
    });

    setEditCustomerId(c.customerId);
    setSection("customers");
  };

  // CUSTOMER: Delete
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await axios.delete(`${API}/customers/${id}`);
      alert("Customer deleted successfully!");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete customer. It may be linked to an existing rental.");
    }
  };

  // RENTAL: Add or Update
  const saveRental = async (e) => {
    e.preventDefault();

    if (new Date(rental.endDate) < new Date(rental.startDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      const data = {
        car: { carId: Number(rental.carId) },
        customer: { customerId: Number(rental.customerId) },
        startDate: rental.startDate,
        endDate: rental.endDate,
        totalAmount: Number(rental.totalAmount),
        status: rental.status
      };

      if (editRentalId) {
        await axios.put(`${API}/rentals/${editRentalId}`, data);
        alert("Rental updated successfully!");
      } else {
        await axios.post(`${API}/rentals`, data);
        alert("Rental created successfully!");
      }

      setRental(emptyRental);
      setEditRentalId(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save rental.");
    }
  };

  // RENTAL: Load details into form
  const editRental = (r) => {
    setRental({
      carId: r.car?.carId || "",
      customerId: r.customer?.customerId || "",
      startDate: r.startDate || "",
      endDate: r.endDate || "",
      totalAmount: r.totalAmount ?? "",
      status: r.status || "BOOKED"
    });

    setEditRentalId(r.rentalId);
    setSection("rentals");
  };

  // RENTAL: Delete
  const deleteRental = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) {
      return;
    }

    try {
      await axios.delete(`${API}/rentals/${id}`);
      alert("Rental deleted successfully!");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete rental.");
    }
  };

  return (
    <div className="app">
      <h1>Car Rental Management System</h1>

      <nav>
        <button onClick={() => setSection("cars")}>Cars</button>
        <button onClick={() => setSection("customers")}>Customers</button>
        <button onClick={() => setSection("rentals")}>Rentals</button>
      </nav>

      {/* CARS */}
      {section === "cars" && (
        <section>
          <h2>{editCarId ? "Edit Car" : "Add Car"}</h2>

          <form onSubmit={saveCar}>
            <input
              placeholder="Brand"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
              required
            />

            <input
              placeholder="Model"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
              required
            />

            <input
              placeholder="Registration Number"
              value={car.registrationNumber}
              onChange={(e) =>
                setCar({ ...car, registrationNumber: e.target.value })
              }
              required
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price Per Day"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({ ...car, pricePerDay: e.target.value })
              }
              required
            />

            <button type="submit">
              {editCarId ? "Update Car" : "Add Car"}
            </button>

            {editCarId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setCar(emptyCar);
                  setEditCarId(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>Car Details</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Registration</th>
                  <th>Price/Day</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((c) => (
                  <tr key={c.carId}>
                    <td>{c.carId}</td>
                    <td>{c.brand}</td>
                    <td>{c.model}</td>
                    <td>{c.registrationNumber}</td>
                    <td>₹{c.pricePerDay}</td>
                    <td>
                      <button onClick={() => editCar(c)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCar(c.carId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CUSTOMERS */}
      {section === "customers" && (
        <section>
          <h2>{editCustomerId ? "Edit Customer" : "Add Customer"}</h2>

          <form onSubmit={saveCustomer}>
            <input
              placeholder="Full Name"
              value={customer.fullName}
              onChange={(e) =>
                setCustomer({ ...customer, fullName: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
              required
            />

            <input
              placeholder="Phone"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              required
            />

            <input
              placeholder="License Number"
              value={customer.licenseNumber}
              onChange={(e) =>
                setCustomer({ ...customer, licenseNumber: e.target.value })
              }
              required
            />

            <button type="submit">
              {editCustomerId ? "Update Customer" : "Add Customer"}
            </button>

            {editCustomerId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setCustomer(emptyCustomer);
                  setEditCustomerId(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>Customer Details</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.customerId}>
                    <td>{c.customerId}</td>
                    <td>{c.fullName}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.licenseNumber}</td>
                    <td>
                      <button onClick={() => editCustomer(c)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCustomer(c.customerId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RENTALS */}
      {section === "rentals" && (
        <section>
          <h2>{editRentalId ? "Edit Rental" : "Create Rental"}</h2>

          <form onSubmit={saveRental}>
            <label>Select Car</label>
            <select
              value={rental.carId}
              onChange={(e) =>
                setRental({ ...rental, carId: e.target.value })
              }
              required
            >
              <option value="">Choose Car</option>
              {cars.map((c) => (
                <option key={c.carId} value={c.carId}>
                  {c.brand} {c.model} - {c.registrationNumber}
                </option>
              ))}
            </select>

            <label>Select Customer</label>
            <select
              value={rental.customerId}
              onChange={(e) =>
                setRental({ ...rental, customerId: e.target.value })
              }
              required
            >
              <option value="">Choose Customer</option>
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.fullName}
                </option>
              ))}
            </select>

            <label>Start Date</label>
            <input
              type="date"
              value={rental.startDate}
              onChange={(e) =>
                setRental({ ...rental, startDate: e.target.value })
              }
              required
            />

            <label>End Date</label>
            <input
              type="date"
              value={rental.endDate}
              onChange={(e) =>
                setRental({ ...rental, endDate: e.target.value })
              }
              required
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Total Amount"
              value={rental.totalAmount}
              onChange={(e) =>
                setRental({ ...rental, totalAmount: e.target.value })
              }
              required
            />

            <select
              value={rental.status}
              onChange={(e) =>
                setRental({ ...rental, status: e.target.value })
              }
            >
              <option value="BOOKED">BOOKED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <button type="submit">
              {editRentalId ? "Update Rental" : "Create Rental"}
            </button>

            {editRentalId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setRental(emptyRental);
                  setEditRentalId(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h2>Rental Details</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Car</th>
                  <th>Customer</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((r) => (
                  <tr key={r.rentalId}>
                    <td>{r.rentalId}</td>
                    <td>{r.car?.brand} {r.car?.model}</td>
                    <td>{r.customer?.fullName}</td>
                    <td>{r.startDate}</td>
                    <td>{r.endDate}</td>
                    <td>₹{r.totalAmount}</td>
                    <td>{r.status}</td>
                    <td>
                      <button onClick={() => editRental(r)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteRental(r.rentalId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
