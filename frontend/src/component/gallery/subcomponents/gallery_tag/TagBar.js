import React, {useContext, useEffect} from 'react';
import {CirclePicker} from "react-color";
import {GalleryColorContext} from "../../contexts/GalleryColorContext";
import {GalleryTagsContext} from "../../contexts/GalleryTagsContext";
import {postRequest} from "../../../additionals/Requests";
import {GalleryDraggedTagContext} from "../../contexts/GalleryDraggedTag";

function TagBar(props) {
    const {
        showColorDropdown, setShowColorDropdown,
        selectedColor, setSelectedColor,
        availableColors, setAvailableColors
    } = useContext(GalleryColorContext)
    const {newTagNameRef, existingTags, setExistingTags} = useContext(GalleryTagsContext)
    const {setDraggedTag} = useContext(GalleryDraggedTagContext)

    useEffect(() => {
        const usedColors = existingTags.map((tag) => tag.color)
        if (usedColors) {
            setAvailableColors((availableColors) => availableColors.filter(color => !usedColors.includes(color)))
        }
    }, [existingTags, selectedColor, setAvailableColors])

    const onDrag = (event, tag) => {
        event.preventDefault();
        setDraggedTag(tag)
    }

    const returnExistingTags = () => {
        return existingTags.map((tag, index) => (
            <div key={index} className="tag" style={{backgroundColor: tag.color}}
                 draggable onDrag={(event) => onDrag(event, tag)}>{tag.tagName}</div>
        ))
    }

    const addTag = () => {
        const newTag = {tagName: newTagNameRef.current.value, color: selectedColor}

        postRequest("/api/save-tag", newTag, (response) => {
            const addedTag = {
                id: response.data.id,
                tagName: response.data.tag_name,
                color: response.data.tag_color,
            }
            setExistingTags((prevData) => ([
                ...prevData, addedTag
            ]))
            setSelectedColor(availableColors[0] === selectedColor ? availableColors[1] : availableColors[0])
        }, (error) => {
            console.log(error.data);
        })

    }

    return (
        <div className="tag-bar">
            <div className="add-new-tag" style={availableColors.length === 0 ? {visibility: "hidden"} : {}}>
                <input type="text" ref={newTagNameRef} placeholder="Tag name"/>

                <div className="add-tag-button" onClick={() => addTag()}>Add tag</div>

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
    );
}

export default TagBar;
