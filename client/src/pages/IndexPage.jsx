import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage()
{
  const [places,setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places').then(response => {    //axios.get(`/places/${id}`).then(response => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <>
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 && places.map(place=>(
        //This div for each place
        <Link to={'/place/'+place._id}>
          <div className="bg-white-500 mb-2 rounded-2x flex" > {/*white*/}
            {place.photos?.[0] &&(
              // <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt=""/>
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}
