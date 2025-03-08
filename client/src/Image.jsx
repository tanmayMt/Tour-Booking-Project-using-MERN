export default function Image({src,...rest}) {
  src = src && src.includes('https://')
    ? src
    : 'https://tour-booking-api.onrender.com/uploads/'+src; //https://tour-booking-api.onrender.com      http://localhost:4000/uploads/
    // : 'http://localhost:4000/uploads/'+src;    //https://tour-booking-api.onrender.com      http://localhost:4000/uploads/
  return (
    <img {...rest} src={src} alt={''} />
  );
}