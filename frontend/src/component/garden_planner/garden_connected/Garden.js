import React, {useCallback, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {environmentVariables} from "../../../EnvironmentVariables";
// Contexts
import {GardenSizeContext} from "./garden_connected_context/GardenSizeContext";
import {ActualGardenIdContext} from "./garden_connected_context/ActualGardenIdContext";
// Images
import dirt from "../../../image/garden/dirt_2.png";
import {getRequest} from "../../additionals/Requests";

function Garden(props) {
    // Refs
    const gardenRef = props.gardenRef;
    // States
    const [garden, setGarden] = useState([]);
    const [refresh, setRefresh] = useState(false)
    // Contexts
    const [gardenSize] = useContext(GardenSizeContext);
    const [actualGardenId] = useContext(ActualGardenIdContext)
    // props
    const draggedVegetable = props.draggedVegetable;
    const setDraggedVegetable = props.setDraggedVegetable;
    const rows = gardenSize.rows;
    const columns = gardenSize.columns;
    // Callbacks
    const fillGardenCells = useCallback((response) => {
        let garden = [];

        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                let vegetable = response.data[0].find(cell => cell.cell_row === i && cell.cell_column === j)
                    ?? {
                        cell_row: i,
                        cell_column: j,
                        cell_name: '',
                        cell_picture_url: dirt
                    };
                row.push({
                    id: `${vegetable.cell_row}-${vegetable.cell_column}`,
                    name: vegetable.cell_name,
                    pictureURL: vegetable.cell_picture_url,
                })
            }
            garden.push(row)
        }
        setGarden(garden)
    }, [columns, rows, setGarden])

    useEffect(() => {
        const params = {garden_id: actualGardenId};
        getRequest('/api/garden', params,
            (response) => fillGardenCells(response),
            (error) => console.log(error.response.data))
        setRefresh(false)

    }, [refresh, rows, columns, gardenSize, actualGardenId, fillGardenCells])

    const onDrop = (event) => {
        const destination = event.target.parentElement.dataset.id ?? null;

        if (destination !== null) {
            axios({
                method: "post",
                url: `${environmentVariables.BACKEND_URL}/api/garden`,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "application/json, text/plain, */*",
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
                },
                data: {
                    garden_id: actualGardenId,
                    cell_row: destination.split("-")[0],
                    cell_column: destination.split("-")[1],
                    cell_name: draggedVegetable.name,
                    cell_picture_url: draggedVegetable.pictureURL,
                }
            }).then((res) => {
                // console.log(res.data);
            }).catch((error) => {
                console.log(error.response.data)
            })
        }
        changeCellToVegetable(destination);
        setDraggedVegetable({});
    }

    const changeCellToVegetable = (destination) => {
        if (destination === null) return
        const destinationCell = garden.flat().find(cell => cell.id === destination)

        destinationCell.name = draggedVegetable.name;
        destinationCell.pictureURL = draggedVegetable.pictureURL;
    }

    const removeVegetableFromCell = (cellId) => {
        axios({
            method: "delete",
            url: `${environmentVariables.BACKEND_URL}/api/garden`,
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json, text/plain, */*",
                Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
            },
            data: {
                garden_id: actualGardenId,
                cell_row: cellId.split("-")[0],
                cell_column: cellId.split("-")[1],
            }
        }).then((res) => {
            setRefresh(true);

        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    return (
        <div id="garden"
             className="garden"
             ref={gardenRef}
             onDrop={(event) => onDrop(event)}
             onDragOver={(event => event.preventDefault())}>
            {garden.map((row, index) =>
                <div className="row" key={index}>
                    {row.map(cell =>
                        <div key={cell.id} className="cell" data-id={cell.id}>
                            {cell.name.length !== 0 ?
                                <div className="remove"
                                     onClick={() => removeVegetableFromCell(cell.id)}>X</div> : ""}
                            <img draggable={false} src={cell.pictureURL} alt=""/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Garden;
