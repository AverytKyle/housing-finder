import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './CreateSpotForm.css';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
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
    const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const frontendErrors = {};

        if (country.length < 2) frontendErrors.country = "Country must be at least 2 characters";
        if (address.length < 5) frontendErrors.address = "Address must be at least 5 characters";
        if (city.length < 2) frontendErrors.city = "City must be at least 2 characters";
        if (state.length < 2) frontendErrors.state = "State is required";
        if (description.length < 30) frontendErrors.description = "Description needs 30 or more characters";
        if (name.length < 2) frontendErrors.name = "Name must be at least 2 characters";
        if (price <= 0 || isNaN(price)) frontendErrors.price = "Price is required";
        if (lat === "") frontendErrors.lat = "Latitude is required";
        if (lng === "") frontendErrors.lng = "Longitude is required";
        if (imageUrls[0] === "") frontendErrors.imageUrls = "The preview image URL is required";

        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        const newSpot = await dispatch(spotActions.createSpot({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            imageUrls
        }));
        
        navigate(`/spots/${newSpot.id}`);

    }

    return (
        <div>
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <h1>Create a new Spot</h1>
                <h2>Where&apos;s your spot located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label className="long-label">
                    Country {errors.country && <p className="errors">{errors.country}</p>}
                    <input className="long-input"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                    />
                </label>
                <label className="long-label">
                    Street Address {errors.address && <p className="errors">{errors.address}</p>}
                    <input className="long-input"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street Address"
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
                            placeholder="City"
                            required
                        />
                    </label>
                    <label className="state-label">
                        State {errors.state && <p className="errors">{errors.state}</p>}
                        <input className="state-input"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
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
                            placeholder="Latitude"
                        />
                    </label>
                    <label className="lat-lng-label">
                        Longitude {errors.lng && <p className="errors">{errors.lng}</p>}
                        <input className="lat-lng-label"
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="Longitude"
                        />
                    </label>
                </div>
                <div>
                    <h2 className="line">Describe your spot to guests</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <label className="description-label">
                        <textarea className="description-input-box"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write at least 30 characters"
                            required
                        />
                    </label>
                    {errors.description && <p className="errors">{errors.description}</p>}
                </div>
                <div>
                    <h2 className="line">Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot that highlights what makes your place special.</p>
                    <label className="name-label">
                        <input className="name-label"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                            required
                        />
                    </label>
                    {errors.name && <p className="errors">{errors.name}</p>}
                </div>
                <div>
                    <h2 className="line">Set a base price for your spot</h2>
                    <p>Competative pricing can help your listing stand out and rank higher in search results.</p>
                    <label className="price-label">
                        <div className="price">
                            <span className="dollar-sign">$</span>
                            <input className="price-input"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price per night (USD)"
                                required
                            />
                        </div>
                    </label>
                    {errors.price && <p className="errors">{errors.price}</p>}
                </div>
                <div className="image-container">
                    <h2 className="line">Add a photo for your spot</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    {errors.imageUrls && <p className="errors">{errors.imageUrls}</p>}
                    {imageUrls.map((url, index) => (
                        <label key={index} className="image-label">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    const newUrls = [...imageUrls];
                                    newUrls[index] = e.target.value;
                                    setImageUrls(newUrls);
                                }}
                                placeholder={index === 0 ? "Preview Image URL" : "Image URL"}
                            />
                        </label>
                    ))}
                </div>
                <div className="button-container">
                    <button className="create-spot-button">Create Spot</button>
                </div>
            </form>
        </div>
    )
}

export default CreateSpotForm;