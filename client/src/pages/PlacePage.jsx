import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

//When we click a specific place of component for see the detail for booking
export default function PlacePage() {
  const {id} = useParams();

  //Grap information about place
  const [place,setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then(response => {  //axios.get(`/places/${id}`).then(response => {     ` ->this is called fancier string
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return '';



  return (

    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>  {/*Redirect to google map*/}
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>

          Check-in Time: {place.checkIn}<br />
          Check-out Time: {place.checkOut}<br />
          Max number of guests: {place.maxGuests}

        </div>
        <div>
          <BookingWidget place={place} />
          
        </div>
      </div>
      {/* Extra info Component */}
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}
