import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image} from 'cloudinary-react';
import '../../stylesheet/basic/basic_main/UserImages.css';
import {deleteRequest, getRequest} from "../additionals/Requests";
import {FaCheckCircle} from "react-icons/fa";
import {GiMagnifyingGlass} from "react-icons/gi";
import FullScreenImage from "./FullScreenImage";
import UploadImageSelection from "./subcomponents/UploadImageSelection";
import ImagePerPage from "./subcomponents/gallery_pagination/ImagePerPage";
import {FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight} from "react-icons/fi";
import {CirclePicker} from "react-color";
import {GalleryPaginationContext} from "./contexts/GalleryPaginationContext";
import Pagination from "./subcomponents/gallery_pagination/Pagination";
import {GalleryColorContext} from "./contexts/GalleryColorContext";


function Gallery(props) {
    // const [listOfUserImages, setListOfUserImages] = useState([])
    const [listOfUserImages, setListOfUserImages] = useState([
        {id: 75, image_id: "ntbbiqljxaovxy5dsik6", original_filename: "screenshot (19)", format: "png", type: "upload", tagIds: [1,3]},
        {id: 74, image_id: "sxvbxkg5ww4azf2y7ren", original_filename: "screenshot", format: "png", type: "upload", tagIds: [3,6]},
        {id: 72, image_id: "wkoff8gisjrvjrljzhad", original_filename: "screenshot (16)", format: "png", type: "upload", tagIds: [1,2,3,4]},
        {id: 70, image_id: "pnrudtk6td7jvytwjpqm", original_filename: "screenshot", format: "png", type: "upload", tagIds: [5]},
        {id: 69, image_id: "rhiubkzlzwmd1egyqffh", original_filename: "screenshot (3)", format: "png", type: "upload", tagIds: [1,2]},
        {id: 68, image_id: "mgw0wc8nrpqghitcydrk", original_filename: "screenshot (5)", format: "png", type: "upload", tagIds: [1,3,4,6]},
        {id: 67, image_id: "it54mqm7dyk2l6eudlpl", original_filename: "screenshot (15)", format: "png", type: "upload", tagIds: [3,4]},
        {id: 66, image_id: "jhrkgqitbm7klvzeo30l", original_filename: "my_garden_2", format: "jpg", type: "upload", tagIds: [4]},
        {id: 65, image_id: "zu4ukdpxlyaheniorn4b", original_filename: "my_garden_3", format: "jpg", type: "upload", tagIds: [2,5]},
        {id: 64, image_id: "yzejop0wsswmzemtihot", original_filename: "my_garden_4", format: "jpg", type: "upload", tagIds: [6]},
        {id: 63, image_id: "a7quklorpwwuq1arg2by", original_filename: "my_garden_5", format: "jpg", type: "upload", tagIds: [2,4]},
        {id: 62, image_id: "b3o3accatuxfv2jm6rca", original_filename: "my_garden_6", format: "jpg", type: "upload", tagIds: [1,4,5]},
        {id: 61, image_id: "vgnah0wz5qhkpb2m0uv5", original_filename: "my_garden_1", format: "jpg", type: "upload", tagIds: [2,3]}])
    const [fullScreenImageId, setFullScreenImageId] = useState("")
    const [selectedImagesToRemove, setSelectedImagesToRemove] = useState([])
    const [loading, setLoading] = useState(true);
    const {imagePerPage, setImagePerPage, actualPageNumber, setActualPageNumber} = useContext(GalleryPaginationContext)

    const newTagNameRef = useRef(null)
    const [showColorDropdown, setShowColorDropdown] = useState(false)
    const {selectedColor, setSelectedColor, availableColors, setAvailableColors} = useContext(GalleryColorContext)

    const [existingTags, setExistingTags] = useState([
        {id: 1, tagName: "First", color: "#e91e63"},
        {id: 2, tagName: "Second", color: "#795548"},
        {id: 3, tagName: "Third", color: "#2196f3"},
        {id: 4, tagName: "Forth", color: "#4caf50"},
        {id: 5, tagName: "Fifth", color: "#673ab7"},
        {id: 6, tagName: "Sixth", color: "#ff9800"},
    ])

    useEffect(() => {
        // getRequest('/api/get-images', {}, (response) => {
            setLoading(false)
        //     setListOfUserImages(response.data)
        // })

        const usedColors = existingTags.map((tag) => tag.color)
        if (usedColors) {
            setAvailableColors((availableColors) => availableColors.filter(color => !usedColors.includes(color)))
        }

    }, [loading, existingTags, selectedColor])

    const removeImage = () => {
        deleteRequest('/api/remove-image', {image_ids: selectedImagesToRemove}, () => {
                getRequest('/api/get-images', {},
                    (response) => {
                        setSelectedImagesToRemove([])
                        setListOfUserImages(response.data)
                        if (actualPageNumber > response.data.length / imagePerPage) setActualPageNumber(Math.ceil(response.data.length / imagePerPage))
                    })
            },
            (error) => console.log(error))
    }

    const toggleImageSelection = (image) => {
        if (selectedImagesToRemove.includes(image.image_id)) {
            setSelectedImagesToRemove(selectedImagesToRemove.filter(item => item !== image.image_id))
        } else {
            setSelectedImagesToRemove([...selectedImagesToRemove, image.image_id]);
        }
    }

    const createImageContainers = () => {
        if (listOfUserImages.length === 0) return <div className="text">No images available</div>;

        return listOfUserImages.slice(imagePerPage * actualPageNumber - imagePerPage, imagePerPage * actualPageNumber).map((image, index) => (
            <div key={index} className="image-container" data-imageid={image.image_id}
                 onClick={() => toggleImageSelection(image)}>
                <div className="image-tag-list">

                    {existingTags.map((tag, index) => (
                        image.tagIds.includes(tag.id) ?
                            <div key={index} style={{backgroundColor: tag.color, width: "30px", height: "30px"}}/> : ""
                    ))}

                </div>
                <Image cloudName="dfvo9ybxe" publicId={image.image_id}/>
                <FaCheckCircle
                    className={`remove-container ${selectedImagesToRemove.includes(image.image_id) ? " active" : ""}`}/>
                <GiMagnifyingGlass className="magnifying-glass" onClick={(event) => {
                    event.stopPropagation()
                    setFullScreenImageId(image.image_id)
                }}/>
            </div>
        ))
    }

    const selectAllImages = () => {
        if (selectedImagesToRemove.length === listOfUserImages.length) {
            setSelectedImagesToRemove([])
            return;
        }

        listOfUserImages.forEach(image => {
            if (!selectedImagesToRemove.includes(image.image_id)) {
                setSelectedImagesToRemove(prevData => ([...prevData, image.image_id]))
            }
        })
    }

    const returnExistingTags = () => {
        // if (existingTags.length === 0) return

        return existingTags.map((tag, index) => (
            <div key={index} className="tag" style={{backgroundColor: tag.color}}>{tag.tagName}</div>
        ))
    }

    return (
        <div>
            {fullScreenImageId.length !== 0 &&
            <FullScreenImage imgId={fullScreenImageId} setFullScreenImageId={setFullScreenImageId}/>}

            <div className="container">
                <h1 className="title">Image gallery</h1>
                <div className="navigation-bar">
                    <UploadImageSelection setLoading={setLoading}/>

                    <div className="extra-options">
                        {selectedImagesToRemove.length !== 0 &&
                        <div className="remove-button" onClick={() => removeImage()}>Remove images</div>}

                        {listOfUserImages.length !== 0 &&
                        <div className="select-all" onClick={() => selectAllImages()}>
                            {selectedImagesToRemove.length !== listOfUserImages.length
                                ? "Select all images"
                                : "Unselect all images"}
                        </div>}

                        {listOfUserImages.length !== 0 && <ImagePerPage imagePerPage={imagePerPage}
                                                                        setImagePerPage={setImagePerPage}
                                                                        actualPageNumber={actualPageNumber}
                                                                        setActualPageNumber={setActualPageNumber}
                                                                        imageCount={listOfUserImages.length}/>}
                    </div>
                </div>

                <div className="tag-bar">
                    <div className="add-new-tag" style={availableColors.length === 0 ? {visibility: "hidden"} : {}}>
                        <input type="text" ref={newTagNameRef} placeholder="Tag name"/>


                        <div className="add-tag-button" onClick={() => {
                            const newItem = {tagName: newTagNameRef.current.value, color: selectedColor, imageId: []}
                            setExistingTags((prevData) => ([
                                ...prevData, newItem
                            ]))
                            setSelectedColor(availableColors[0] === selectedColor ? availableColors[1] : availableColors[0] )
                        }}>Add tag
                        </div>

                        <div className="color-dropdown">
                            <div className="color-dropdown-button"
                                 style={{backgroundColor: selectedColor}}
                                 onClick={() => setShowColorDropdown(!showColorDropdown)}>
                            </div>
                            <CirclePicker className="color-dropdown-content"
                                          circleSpacing={0}
                                          color={selectedColor}
                                          colors={availableColors}
                                          onChangeComplete={(color) => setSelectedColor(color.hex)}/>
                        </div>
                    </div>
                    <div className="existing-tag">
                        {returnExistingTags()}
                    </div>
                </div>

                <div className="gallery">
                    {loading ? <div className="text">Loading...</div> : createImageContainers()}
                </div>

                <Pagination listOfUserImagesLength={listOfUserImages.length}/>
            </div>
        </div>
    );
}

export default Gallery;
