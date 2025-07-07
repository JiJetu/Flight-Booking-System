export type TFlight = {
  _id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  image: string;
};

export type TFlightFormInputs = {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  departureTime: string;
  arrivalTime: string;
  image: FileList;
};

export type TBooking = {
  _id: string;
  flightId: string;
  user: {
    userId: string;
  };
  numberOfSeats: number;
  totalPrice: number;
  status: "Pending" | "Confirm" | "Cancel";
  timestamp: number;
  flightDetails?: {
    airline: string;
    flightNumber: string;
  };
  userDetails?: {
    name: string;
    email: string;
  };
};
