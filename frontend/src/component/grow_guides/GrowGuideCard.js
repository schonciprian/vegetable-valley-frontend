import React, {useEffect, useState} from 'react';
import {Vegetables} from './Descriptions';
import {FaEyeDropper, FaHeart} from "react-icons/fa";
import {heartCard, pinCard, toggleCard} from "./GrowGuideCardActions";
import {Link} from "react-router-dom";

export default function GrowGuideCard() {

    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [dataEndIndex, setDataEndIndex] = useState(Math.ceil((window.innerHeight - 155) / 340) * Math.floor(window.innerWidth * 0.8 / 255));

    const isScrolling = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
            return;
        }
        setIsFetching(true)
    }

    useEffect(() => {
        window.addEventListener("scroll", isScrolling);
        const fetchData = Object.keys(Vegetables).slice(0, dataEndIndex).reduce((result, key) => {
            result[key] = Vegetables[key];
            return result;
        }, {});

        if (isFetching) {
            setData(fetchData);
            setIsFetching(false);
            setDataEndIndex(dataEndIndex => dataEndIndex + (Math.floor(window.innerWidth * 0.8 / 255)))
        }
    }, [isFetching, dataEndIndex])

    return (
        <div className="grow-guides-container">

            {Object.keys(data).map((veggie, index) => (
                <div key={index} className="grow-guide-card-outer" onClick={() => toggleCard(index)}>
                    <div id={index} className="grow-guide-card-inner" key={index}>
                        <div className="card-face card-face-front">
                            <div className="vegetable-name">{Vegetables[veggie].name}</div>
                            <img src={Vegetables[veggie].pictureURL} alt=""/>
                        </div>
                        <div className="card-face card-face-back">
                            <div className="card-content">
                                <div id={`heart-icon-${index}`}
                                     className="icon heart-icon"
                                     onClick={(event) => heartCard(event, index)}>
                                    <FaHeart/>
                                </div>
                                <div id={`pin-icon-${index}`}
                                     className="icon pin-icon"
                                     onClick={(event) => pinCard(event, index)}>
                                    <FaEyeDropper/>
                                </div>
                                <div className="card-header">
                                    <h2>{Vegetables[veggie].name}</h2>
                                    <img className="pp" src={Vegetables[veggie].pictureURL} alt=""/>
                                </div>
                                <div className="card-body">
                                    <p>
                                        <span>Sowing depth: </span>
                                        <span>{Vegetables[veggie].sow_depth ? Vegetables[veggie].sow_depth : 0}</span>
                                    </p>
                                    <p>
                                        <span>Line spacing:</span>
                                        <span>{Vegetables[veggie].spacing_between_rows ? Vegetables[veggie].spacing_between_rows : 0}</span>
                                    </p>
                                    <p>
                                        <span>Inline spacing: </span>
                                        <span>{Vegetables[veggie].spacing_along_row ? Vegetables[veggie].spacing_along_row : 0}</span>
                                    </p>
                                    <div className="buttons" onClick={(event) => event.stopPropagation()}>
                                        <Link className="more-info" to={`/grow-guides/${Vegetables[veggie].id}`}>More info</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

