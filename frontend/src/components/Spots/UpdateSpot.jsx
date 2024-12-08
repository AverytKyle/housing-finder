import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.allSpots);
    const navigate = useNavigate();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    // const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const frontendErrors = {};

        if (country.length < 2) frontendErrors.country = "Country must be at least 2 characters";
        if (address.length < 5) frontendErrors.address = "Address must be at least 5 characters";
        if (city.length < 2) frontendErrors.city = "City must be at least 2 characters";
        if (state.length < 2) frontendErrors.state = "State must be at least 2 characters";
        if (description.length < 30) frontendErrors.description = "Description needs 30 or more characters";
        if (name.length < 2) frontendErrors.name = "Name must be at least 2 characters";
        if (price <= 0) frontendErrors.price = "Price must be greater than 0";

        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        const updatedSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            // imageUrls
        };

        return dispatch(spotActions.updateSpot(spotId, updatedSpot))
            .then(() => {
                navigate(`/spots/${spotId}`);
            })
            .catch((res) => {
                if (res && res.errors) {
                    setErrors(res.errors);
                }
            });
    }

    useEffect(() => {
        if (spot && Object.keys(spot).length > 0) {
            setCountry(spot.country);
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setLat(spot.lat);
            setLng(spot.lng);
            setDescription(spot.description);
            setPrice(spot.price);
            setName(spot.name);
            // setImageUrls(spot.SpotImages.map(image => image.url));
        }
    }, [spot]);

    useEffect(() => {
        dispatch(spotActions.getSpotById(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <h1>Update Your Spot</h1>
                <h2>Where&apos;s your spot located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label className="long-label">
                    Country {errors.country && <p className="errors">{errors.country}</p>}
                    <input className="long-input"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label className="long-label">
                    Street Address {errors.address && <p className="errors">{errors.address}</p>}
                    <input className="long-input"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <div className="city-state">
                    <label className="city-label">
                        City {errors.city && <p className="errors">{errors.city}</p>}
                        <input className="city-input"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label className="state-label">
                        State {errors.state && <p className="errors">{errors.state}</p>}
                        <input className="state-input"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="lat-lng">
                    <label className="lat-lng-label">
                        Latitude {errors.lat && <p className="errors">{errors.lat}</p>}
                        <input className="lat-lng-label"
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                        />
                    </label>
                    <label className="lat-lng-label">
                        Longitude {errors.lng && <p className="errors">{errors.lng}</p>}
                        <input className="lat-lng-label"
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                        />
                    </label>
                </div>
                <h2>Describe your spot to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <label className="description-label">
                    <textarea className="description-input-box"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                {errors.description && <p className="errors">{errors.description}</p>}
                <h2>Create a title for your spot</h2>
                <p>Catch guests&apos; attention with a spot that highlights what makes your place special.</p>
                <label className="name-label">
                    <input className="name-label"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                {errors.name && <p className="errors">{errors.name}</p>}
                <h2>Set a base price for your spot</h2>
                <p>Competative pricing can help your listing stand out and rank higher in search results.</p>
                <label className="price-label">
                    <div className="price">
                        <span className="dollar-sign">$</span>
                        <input className="description-input-box"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                </label>
                {errors.price && <p className="errors">{errors.price}</p>}
                <h2>Add a photo for your spot</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                {/* {imageUrls.map((url, index) => (
                    <label key={index} className="image-label">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                                const newUrls = [...imageUrls];
                                newUrls[index] = e.target.value;
                                setImageUrls(newUrls);
                            }}
                            placeholder="Image URL"
                        />
                    </label>
                ))} */}
                <button className="create-spot-button">Update Spot</button>
            </form>
        </div>
    )
}

export default UpdateSpot;