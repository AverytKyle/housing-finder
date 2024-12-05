import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import * as spotActions from '../../store/spots';
import './CreateSpotForm.css';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
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

        return dispatch(spotActions.createSpot({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })).catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
                setErrors(data.errors);
            }
        })
    }

    return (
        <div>
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <h1>Create a new Spot</h1>
                <h2>Where's you spot located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <label className="country-label">
                    Country {errors.country && <p className="errors">{errors.country}</p>}
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label className="address-label">
                    Street Address {errors.address && <p className="errors">{errors.address}</p>}
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <div className="city-state">
                    <label className="city-label">
                        City {errors.city && <p className="errors">{errors.city}</p>}
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <p>,</p>
                    <label className="state-label">
                        State {errors.state && <p className="errors">{errors.state}</p>}
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="lat-lng">
                    <label className="lat-label">
                        Latitude {errors.lat && <p className="errors">{errors.lat}</p>}
                        <input
                            type="number"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                        />
                    </label>
                    <p>,</p>
                    <label className="lng-label">
                        Longitude {errors.lng && <p className="errors">{errors.lng}</p>}
                        <input
                            type="number"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                        />
                    </label>
                </div>
                <h2>Describe your spot to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <label className="description-label">
                    <input className="description-input-box"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                {errors.description && <p className="errors">{errors.description}</p>}
                <h2>Create a title for your spot</h2>
                <p>Catch guests' attention with a spot that highlights what makes your place special.</p>
                <label className="name-label">
                    <input
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
                    <input className="description-input-box"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                {errors.price && <p className="errors">{errors.price}</p>}
                <button className="create-spot-button">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpotForm;