import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const HomePage = () => {
	const [userLists, setUserLists] = useState([]);
	const [showListModal, setShowListModal] = useState(false);
	const [newListName, setNewListName] = useState('');
	const [newListDescription, setNewListDescription] = useState('');
	const [listsLoading, setListsLoading] = useState(false);

    useEffect(() => {
        getLists();
    }, []);

    const getLists = async () => {
		setListsLoading(true);
        const url = "/api/lists";
        let response;
		console.log("Getting lists")
        try {
            response = await axios.get(url);
			if (response.status !== 200) {
				console.log("2")
				setListsLoading(false);
				return;
			}
			setUserLists(response.data);
			setListsLoading(false);
        } catch {
			console.log("1")
			setListsLoading(false);
            console.error("Error fetching lists");
        }
    }

	const createList = async () => {
		const url = "/api/newlist";
		const data = {
			name: newListName,
			description: newListDescription
		};
	
		try {
			const response = await axios.post(url, data);
			console.log(response.data);
			return response.data.listid;
		} catch (error) {
			console.error("Error posting list", error);
		}
	}

	const handleModalClose = () => {
        setShowListModal(false);
    }

	const handleListCreation = async () => {
		console.log(newListName);
		console.log(newListDescription);
		setShowListModal(false);
		const newlistid = await createList();
		window.location.href = `http://localhost:3000/build/${newlistid}`;
	}

	const handleNewListClick = async () => {
		const loggedIn = localStorage.getItem('username');
		if (!loggedIn) {
			window.location.href = 'http://localhost:3001/auth/github';
		}
		else {
			setShowListModal(true);
		}
    }

	return (
		<div className="HomeContainer">
			<Modal show={showListModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create New List</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<label>Name</label>
						<input
							id='name'
							type='text'
							onChange={(e) => setNewListName(e.target.value)}
							value={newListName}
							className="description-box"
						/>
					</div>
					<div>
						<label>Description</label>
						<input
							id='description'
							type='text'
							onChange={(e) => setNewListDescription(e.target.value)}
							value={newListDescription}
							className="description-box"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
					<Button variant="primary" onClick={handleListCreation}>Make List</Button>
				</Modal.Footer>
			</Modal>

			<div className="ListsContainer">
				{localStorage.getItem('username') ? (
					<button className='card-button' onClick={handleNewListClick} title='Create a new list'>
						<FontAwesomeIcon className="card-new" icon={faPlus} />
					</button>
				) : (
					<button className='card-button logged-out-card card-text' onClick={handleNewListClick} title='Create a new list'>
						<span>Login To Create Part Lists</span>
					</button>
				)}
				{ listsLoading ?
					<button className='card-button spinner-container'>
						<Spinner animation="grow" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</button>
					:
					<>
						{ userLists.map((partlist) => (
							<Link className='card-link card-button' to={`/build/${partlist.listid}`} key={partlist.listid}>
								<p className="card-text text-center card-tit">{partlist.name}</p>
								<hr className='hr-line' />
								<p className="card-text text-center card-desc">{partlist.description}</p>
								<hr className='hr-line' />
								<p className="card-text text-center card-price">${partlist.totalprice}</p>
							</Link>
						))}
					</>
				}
			</div>
		</div>
	)
}

export default HomePage;